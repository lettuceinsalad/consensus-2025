#[test_only]
module crypto_game::prediction_game_tests {
    use std::signer;
    use std::string;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use crypto_game::prediction_game;
    
    // Test addresses
    const ADMIN: address = @0xA11CE;
    const PLAYER: address = @0xB0B;
    const ORACLE: address = @0xC0C;
    
    // Test constants
    const MIN_BET: u64 = 100;
    const MAX_BET: u64 = 10000;
    const FEE_PERCENTAGE: u64 = 5;
    const INITIAL_BALANCE: u64 = 100000;
    
    #[test(admin = @0xA11CE, player = @0xB0B, oracle = @0xC0C, aptos_framework = @0x1)]
    fun test_game_lifecycle(
        admin: &signer,
        player: &signer,
        oracle: &signer,
        aptos_framework: &signer
    ) {
        // Setup blockchain environment
        setup_test(admin, player, oracle, aptos_framework);
        
        // Initialize game
        prediction_game::initialize_game(admin, MIN_BET, MAX_BET, FEE_PERCENTAGE, signer::address_of(oracle));
        
        // Initialize user
        prediction_game::initialize_user(player);
        
        // Create a prediction
        let crypto_id = string::utf8(b"bitcoin");
        prediction_game::create_prediction(player, 1000, true, crypto_id);
        
        // Settle prediction as win
        prediction_game::settle_prediction(oracle, signer::address_of(player), 0, true);
        
        // Check player balance increased (1000 * 2 - 5% fee = 1900)
        assert!(coin::balance<AptosCoin>(signer::address_of(player)) == INITIAL_BALANCE - 1000 + 1900, 0);
    }
    
    #[test(admin = @0xA11CE, player = @0xB0B, oracle = @0xC0C, aptos_framework = @0x1)]
    fun test_admin_functions(
        admin: &signer,
        player: &signer,
        oracle: &signer,
        aptos_framework: &signer
    ) {
        // Setup blockchain environment
        setup_test(admin, player, oracle, aptos_framework);
        
        // Initialize game
        prediction_game::initialize_game(admin, MIN_BET, MAX_BET, FEE_PERCENTAGE, signer::address_of(oracle));
        
        // Test pausing the game
        prediction_game::set_game_paused(admin, true);
        
        // Test updating bet limits
        prediction_game::update_bet_limits(admin, 200, 20000);
        
        // Test updating fee percentage
        prediction_game::update_fee_percentage(admin, 10);
        
        // Test updating oracle
        prediction_game::update_oracle(admin, @0xD0D);
        
        // No assertions needed as we're just testing these don't abort
    }
    
    #[test(admin = @0xA11CE, player = @0xB0B, oracle = @0xC0C, aptos_framework = @0x1)]
    fun test_losing_prediction(
        admin: &signer,
        player: &signer,
        oracle: &signer,
        aptos_framework: &signer
    ) {
        // Setup blockchain environment
        setup_test(admin, player, oracle, aptos_framework);
        
        // Initialize game
        prediction_game::initialize_game(admin, MIN_BET, MAX_BET, FEE_PERCENTAGE, signer::address_of(oracle));
        
        // Initialize user
        prediction_game::initialize_user(player);
        
        // Create a prediction
        let crypto_id = string::utf8(b"ethereum");
        let bet_amount = 500;
        prediction_game::create_prediction(player, bet_amount, true, crypto_id);
        
        // Settle prediction as loss (predicted up but result was down)
        prediction_game::settle_prediction(oracle, signer::address_of(player), 0, false);
        
        // Check player balance decreased (just the bet amount)
        assert!(coin::balance<AptosCoin>(signer::address_of(player)) == INITIAL_BALANCE - bet_amount, 0);
    }
    
    // Helper function to setup test environment
    fun setup_test(
        admin: &signer,
        player: &signer,
        oracle: &signer,
        aptos_framework: &signer
    ) {
        // Set up timestamp for testing
        timestamp::set_time_has_started_for_testing(aptos_framework);
        
        // Create accounts
        account::create_account_for_test(signer::address_of(admin));
        account::create_account_for_test(signer::address_of(player));
        account::create_account_for_test(signer::address_of(oracle));
        
        // Initialize and register the AptosCoin
        aptos_coin::initialize_for_test(aptos_framework);
        
        // Register accounts with AptosCoin
        coin::register<AptosCoin>(admin);
        coin::register<AptosCoin>(player);
        coin::register<AptosCoin>(oracle);
        
        // Mint some coins to the player for testing
        aptos_coin::mint(aptos_framework, signer::address_of(player), INITIAL_BALANCE);
    }
} 