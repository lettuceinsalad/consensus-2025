module BetGame::CoinFlip {
    use std::signer;
    use std::vector;
    use std::option;
    use std::string;
    use std::coin;
    use aptos_framework::timestamp;

    struct Bet has store {
        user: address,
        amount: u64,
        token_address_1: address,
        token_name_1: string::String,
        token_address_2: address,
        token_name_2: string::String,
        chosen_coin: u8, // 1 or 2
        won: option::Option<bool>,
        timestamp: u64,
        resolved: bool,
    }

    struct BetLedger has store {
        bets: vector<Bet>,
    }

    struct Ledger has key {
        ledger: BetLedger,
    }

    /// Initialize the ledger
    public entry fun init(owner: &signer) {
        move_to(owner, Ledger { ledger: BetLedger { bets: vector::empty<Bet>() } });
    }

    /// Place a bet (user sends APT to contract)
    public entry fun place_bet(
        user: &signer,
        amount: u64,
        token_address_1: address,
        token_name_1: string::String,
        token_address_2: address,
        token_name_2: string::String,
        chosen_coin: u8
    ) acquires Ledger {
        coin::transfer<0x1::aptos_coin::AptosCoin>(user, @0xb59bbba782d7643233d773e1a5d0f0e169a0d17b68e59e94f8af6216354ef999, amount);

        let ledger = borrow_global_mut<Ledger>(@0xb59bbba782d7643233d773e1a5d0f0e169a0d17b68e59e94f8af6216354ef999);
        let bet = Bet {
            user: signer::address_of(user),
            amount,
            token_address_1,
            token_name_1,
            token_address_2,
            token_name_2,
            chosen_coin,
            won: option::none(),
            timestamp: timestamp::now_seconds(),
            resolved: false,
        };
        vector::push_back(&mut ledger.ledger.bets, bet);
    }

    /// Resolve a bet (only owner can call)
    public entry fun resolve_bet(
        owner: &signer,
        bet_index: u64,
        won: bool
    ) acquires Ledger {
        assert!(signer::address_of(owner) == @0xb59bbba782d7643233d773e1a5d0f0e169a0d17b68e59e94f8af6216354ef999, 1);

        let ledger = borrow_global_mut<Ledger>(@0xb59bbba782d7643233d773e1a5d0f0e169a0d17b68e59e94f8af6216354ef999);
        let bet_ref = vector::borrow_mut(&mut ledger.ledger.bets, bet_index);
        bet_ref.won = option::some(won);
        bet_ref.resolved = true;
    }

    /// Payout winnings (only owner can call)
    public entry fun payout(
        owner: &signer,
        user: address,
        amount: u64
    ) {
        assert!(signer::address_of(owner) == @0xb59bbba782d7643233d773e1a5d0f0e169a0d17b68e59e94f8af6216354ef999, 1);
        coin::transfer<0x1::aptos_coin::AptosCoin>(owner, user, amount);
    }
}