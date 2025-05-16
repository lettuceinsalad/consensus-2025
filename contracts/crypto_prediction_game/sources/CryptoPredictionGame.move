module crypto_game::prediction_game {
    use std::signer;
    use std::string::{String};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};

    // Error codes
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_PREDICTION_NOT_FOUND: u64 = 2;
    const E_PREDICTION_ALREADY_SETTLED: u64 = 3;
    const E_GAME_PAUSED: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;
    const E_BET_TOO_LOW: u64 = 6;
    const E_BET_TOO_HIGH: u64 = 7;
    const E_PREDICTION_NOT_CLOSED: u64 = 8;

    // Game state
    struct GameConfig has key {
        owner: address,
        min_bet: u64,
        max_bet: u64,
        fee_percentage: u64,
        paused: bool,
        treasury: Coin<AptosCoin>,
        outcome_feed: address,
    }

    // Prediction direction
    struct PredictionDirection has drop, copy, store {
        up: bool, // true = UP, false = DOWN
    }

    // Prediction data
    struct Prediction has store {
        bet_amount: u64,
        direction: PredictionDirection,
        timestamp: u64,
        crypto_id: String,
        settled: bool,
        won: bool,
    }

    // User's predictions
    struct UserPredictions has key {
        predictions: vector<Prediction>,
        total_won: u64,
        total_lost: u64,
        prediction_created_events: EventHandle<PredictionCreatedEvent>,
        prediction_settled_events: EventHandle<PredictionSettledEvent>,
    }

    // Events
    struct PredictionCreatedEvent has drop, store {
        user: address,
        prediction_id: u64,
        crypto_id: String,
        bet_amount: u64,
        direction: PredictionDirection,
        timestamp: u64,
    }

    struct PredictionSettledEvent has drop, store {
        user: address,
        prediction_id: u64,
        crypto_id: String,
        bet_amount: u64,
        won: bool,
        payout: u64,
        timestamp: u64,
    }

    // Initialize the game
    public entry fun initialize_game(
        owner: &signer,
        min_bet: u64,
        max_bet: u64,
        fee_percentage: u64,
        outcome_feed: address
    ) {
        let owner_addr = signer::address_of(owner);
        
        // Create the game config resource
        move_to(owner, GameConfig {
            owner: owner_addr,
            min_bet,
            max_bet,
            fee_percentage,
            paused: false,
            treasury: coin::zero<AptosCoin>(),
            outcome_feed,
        });
    }

    // Initialize user's prediction storage
    public entry fun initialize_user(user: &signer) {
        let user_addr = signer::address_of(user);
        
        if (!exists<UserPredictions>(user_addr)) {
            move_to(user, UserPredictions {
                predictions: vector::empty(),
                total_won: 0,
                total_lost: 0,
                prediction_created_events: account::new_event_handle<PredictionCreatedEvent>(user),
                prediction_settled_events: account::new_event_handle<PredictionSettledEvent>(user),
            });
        }
    }

    // Create a new prediction
    public entry fun create_prediction(
        user: &signer,
        bet_amount: u64,
        direction_up: bool,
        crypto_id_str: String
    ) acquires GameConfig, UserPredictions {
        let user_addr = signer::address_of(user);
        
        // Ensure the game is not paused
        let game_config = borrow_global<GameConfig>(@crypto_game);
        assert!(!game_config.paused, E_GAME_PAUSED);
        
        // Validate bet amount
        assert!(bet_amount >= game_config.min_bet, E_BET_TOO_LOW);
        assert!(bet_amount <= game_config.max_bet, E_BET_TOO_HIGH);
        
        // Ensure user has initialized
        if (!exists<UserPredictions>(user_addr)) {
            initialize_user(user);
        }
        
        // Create prediction
        let direction = PredictionDirection { up: direction_up };
        let prediction = Prediction {
            bet_amount,
            direction,
            timestamp: timestamp::now_seconds(),
            crypto_id: crypto_id_str,
            settled: false,
            won: false,
        };
        
        // Transfer tokens to the game treasury
        let coins = coin::withdraw<AptosCoin>(user, bet_amount);
        
        // Update game config
        let game_config = borrow_global_mut<GameConfig>(@crypto_game);
        coin::merge(&mut game_config.treasury, coins);
        
        // Add prediction to user's predictions
        let user_predictions = borrow_global_mut<UserPredictions>(user_addr);
        let prediction_id = vector::length(&user_predictions.predictions);
        vector::push_back(&mut user_predictions.predictions, prediction);
        
        // Emit event
        event::emit_event(
            &mut user_predictions.prediction_created_events,
            PredictionCreatedEvent {
                user: user_addr,
                prediction_id,
                crypto_id: crypto_id_str,
                bet_amount,
                direction,
                timestamp: timestamp::now_seconds(),
            }
        );
    }

    // Oracle function to settle prediction with result
    public entry fun settle_prediction(
        oracle: &signer,
        user_addr: address,
        prediction_id: u64,
        result_up: bool
    ) acquires GameConfig, UserPredictions {
        // Ensure the caller is the authorized oracle
        let oracle_addr = signer::address_of(oracle);
        let game_config = borrow_global<GameConfig>(@crypto_game);
        assert!(oracle_addr == game_config.outcome_feed, E_UNAUTHORIZED);
        
        // Get user predictions
        assert!(exists<UserPredictions>(user_addr), E_PREDICTION_NOT_FOUND);
        let user_predictions = borrow_global_mut<UserPredictions>(user_addr);
        
        // Ensure prediction exists
        assert!(prediction_id < vector::length(&user_predictions.predictions), E_PREDICTION_NOT_FOUND);
        
        // Get the prediction
        let prediction = vector::borrow_mut(&mut user_predictions.predictions, prediction_id);
        
        // Ensure it's not already settled
        assert!(!prediction.settled, E_PREDICTION_ALREADY_SETTLED);
        
        // Set as settled
        prediction.settled = true;
        
        // Check if prediction was correct
        let won = prediction.direction.up == result_up;
        prediction.won = won;
        
        // Process payout
        let payout = 0;
        if (won) {
            // Calculate payout (2x minus fee)
            let fee = prediction.bet_amount * game_config.fee_percentage / 100;
            payout = (prediction.bet_amount * 2) - fee;
            
            // Update user stats
            user_predictions.total_won = user_predictions.total_won + 1;
            
            // Transfer payout to user
            let game_config_mut = borrow_global_mut<GameConfig>(@crypto_game);
            let payout_coins = coin::extract(&mut game_config_mut.treasury, payout);
            coin::deposit(user_addr, payout_coins);
        } else {
            // Update user stats
            user_predictions.total_lost = user_predictions.total_lost + 1;
            // No payout needed, funds stay in treasury
        }
        
        // Emit event
        event::emit_event(
            &mut user_predictions.prediction_settled_events,
            PredictionSettledEvent {
                user: user_addr,
                prediction_id,
                crypto_id: prediction.crypto_id,
                bet_amount: prediction.bet_amount,
                won,
                payout,
                timestamp: timestamp::now_seconds(),
            }
        );
    }

    // Admin functions
    public entry fun set_game_paused(admin: &signer, paused: bool) acquires GameConfig {
        let admin_addr = signer::address_of(admin);
        let game_config = borrow_global_mut<GameConfig>(@crypto_game);
        
        // Ensure caller is the owner
        assert!(admin_addr == game_config.owner, E_UNAUTHORIZED);
        
        // Update paused state
        game_config.paused = paused;
    }

    // Admin function to update bet limits
    public entry fun update_bet_limits(
        admin: &signer,
        min_bet: u64,
        max_bet: u64
    ) acquires GameConfig {
        let admin_addr = signer::address_of(admin);
        let game_config = borrow_global_mut<GameConfig>(@crypto_game);
        
        // Ensure caller is the owner
        assert!(admin_addr == game_config.owner, E_UNAUTHORIZED);
        
        // Update limits
        game_config.min_bet = min_bet;
        game_config.max_bet = max_bet;
    }

    // Admin function to update fee percentage
    public entry fun update_fee_percentage(
        admin: &signer,
        fee_percentage: u64
    ) acquires GameConfig {
        let admin_addr = signer::address_of(admin);
        let game_config = borrow_global_mut<GameConfig>(@crypto_game);
        
        // Ensure caller is the owner
        assert!(admin_addr == game_config.owner, E_UNAUTHORIZED);
        assert!(fee_percentage <= 20, E_UNAUTHORIZED); // Max 20% fee
        
        // Update fee
        game_config.fee_percentage = fee_percentage;
    }

    // Admin function to update oracle address
    public entry fun update_oracle(
        admin: &signer,
        new_oracle: address
    ) acquires GameConfig {
        let admin_addr = signer::address_of(admin);
        let game_config = borrow_global_mut<GameConfig>(@crypto_game);
        
        // Ensure caller is the owner
        assert!(admin_addr == game_config.owner, E_UNAUTHORIZED);
        
        // Update oracle
        game_config.outcome_feed = new_oracle;
    }

    // Admin function to withdraw fees
    public entry fun withdraw_treasury(
        admin: &signer,
        amount: u64
    ) acquires GameConfig {
        let admin_addr = signer::address_of(admin);
        let game_config = borrow_global_mut<GameConfig>(@crypto_game);
        
        // Ensure caller is the owner
        assert!(admin_addr == game_config.owner, E_UNAUTHORIZED);
        
        // Ensure there's enough in the treasury
        assert!(coin::value(&game_config.treasury) >= amount, E_INSUFFICIENT_BALANCE);
        
        // Extract and transfer
        let withdrawal = coin::extract(&mut game_config.treasury, amount);
        coin::deposit(admin_addr, withdrawal);
    }
} 