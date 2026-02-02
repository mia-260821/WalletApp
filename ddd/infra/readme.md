
## Infrastructure layer

```
src/infrastructure/
├── persistence/              # Data Storage (Disk)
│   ├── AsyncStorageWalletRepository.ts
│   ├── SqliteTransactionRepository.ts
│   └── mappers/              # Converts DB rows to Domain Entities
│       └── WalletMapper.ts
├── services/                 # Technical Implementations of Domain Services
│   ├── KeyDerivationService.ts (wraps ethers.js)
│   ├── BiometricAuthService.ts (wraps react-native-keychain)
│   └── EthereumBlockchainService.ts
├── api/                      # External Network Communication
│   ├── AlchemyProvider.ts    # Blockchain node provider
│   ├── CoingeckoClient.ts    # Price feeds
│   └── dto/                  # Data Transfer Objects (raw JSON responses)
│       └── EtherScanResponse.ts
├── security/                 # Sensitive operations
│   └── EncryptionProvider.ts
└── config/                   # Tech-specific configuration
    └── env.ts                # API Keys, Node URLs

```

