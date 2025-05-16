# Crypto Prediction Game Smart Contract

This is an Aptos blockchain smart contract for a cryptocurrency price prediction game. Players can predict whether a cryptocurrency's price will go up or down, bet APT tokens, and win payouts if their prediction is correct.

## Features

- Place predictions on whether crypto prices will go up or down
- Set minimum and maximum bet limits
- Configurable fee percentage for the house
- Admin functions to manage the game parameters
- Oracle integration for settlement of predictions
- Events emitted for tracking prediction creation and settlement

## Contract Structure

### Key Resources

- `GameConfig`: Stores game parameters, including min/max bet limits, fee percentage, and treasury
- `UserPredictions`: Stores user's prediction history and stats
- `Prediction`: Individual prediction data including bet amount, direction, and result

### Key Functions

- `initialize_game`: Set up the game with initial parameters
- `create_prediction`: Place a new prediction with a bet
- `settle_prediction`: Oracle function to settle prediction with actual result
- Admin functions for updating game parameters

## How to Use

### Prerequisites

- Aptos CLI installed
- Account with APT tokens for deploying and interacting with the contract

### Deployment

1. Update the address in `Move.toml`:
   ```toml
   [addresses]
   crypto_game = "YOUR_ADDRESS_HERE"
   ```

2. Compile the contract:
   ```bash
   aptos move compile --named-addresses crypto_game=YOUR_ADDRESS
   ```

3. Publish the contract:
   ```bash
   aptos move publish --named-addresses crypto_game=YOUR_ADDRESS
   ```

### Initialization

Initialize the game with parameters:

```bash
aptos move run --function-id YOUR_ADDRESS::prediction_game::initialize_game \
  --args u64:100 u64:10000 u64:5 address:ORACLE_ADDRESS
```

### Placing a Prediction

```bash
aptos move run --function-id YOUR_ADDRESS::prediction_game::create_prediction \
  --args u64:1000 bool:true string:bitcoin
```

This places a 1000 APT token bet predicting that Bitcoin's price will go up.

### Oracle Settlement

The oracle can settle a prediction:

```bash
aptos move run --function-id YOUR_ADDRESS::prediction_game::settle_prediction \
  --args address:PLAYER_ADDRESS u64:0 bool:true
```

This settles prediction ID 0 for the player as a win (price went up).

## Integration with Web App

To integrate this smart contract with your web application:
1. Use the Aptos SDK to connect to the blockchain
2. Create function calls for users to place predictions
3. Track events from the contract for UI updates
4. Display user's prediction history and statistics

## Testing

The contract includes test modules that can be run with:

```bash
aptos move test --named-addresses crypto_game=YOUR_ADDRESS
```

## License

This smart contract is provided under the [MIT License](LICENSE). 