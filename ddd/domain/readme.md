## Domain Layer  

### Seed Phrase
Modern wallets (known as HD Wallets) follow a one-way, hierarchical mathematical path to generate keys:  

1. Seed Phrase ➡️ Master Key: Your wallet app generates a random 12–24 word Seed Phrase using the BIP-39 standard.  
2. Master Key ➡️ Private Keys: The seed phrase is mathematically converted into a "Master Private Key". From this master, the wallet can derive an almost infinite number of individual Private Keys.  
3. Private Key ➡️ Address: Each individual private key generates a corresponding Public Key, which is hashed to create your Wallet Address.   


### Structure

```
src/domain/
├── entities/           # Objects with unique IDs and logic
│   ├── Wallet.ts       # The "Aggregate Root"
│   ├── Account.ts      # A specific crypto account
│   └── Transaction.ts  # A record of value movement
├── value-objects/      # Immutable data with no ID
│   ├── Address.ts      # Validates blockchain addresses
│   ├── Balance.ts      # Handles crypto decimals/math
│   ├── SeedPhrase.ts   # Protects the 12/24 word secret
│   └── Network.ts      # Represents ETH, BTC, etc.
├── services/           # Business logic across multiple entities
│   ├── IKeyDerivationService.ts # INTERFACE for key math
│   └── CoinTypePolicy.ts        # Rules for BIP-44 paths
├── repositories/       # Data contracts (Interfaces only)
│   ├── IWalletRepository.ts
│   └── ITransactionRepository.ts
└── events/             # Significant domain changes
    └── TransactionSigned.ts

```