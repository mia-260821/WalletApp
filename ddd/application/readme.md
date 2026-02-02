
## Application Layer. 

```
src/application/
├── use-cases/                # Specific User Actions (Commands)
│   ├── wallet/
│   │   ├── InitializeWalletUseCase.ts
│   │   └── ImportWalletUseCase.ts
│   ├── account/
│   │   ├── CreateAccountUseCase.ts
│   │   └── GetAccountBalanceUseCase.ts
│   └── transaction/
│       └── SendFundsUseCase.ts
├── services/                 # Cross-cutting technical orchestration
│   ├── AuthService.ts        # Handles PIN/Biometrics coordination
│   └── NotificationService.ts # Orchestrates push alerts
├── dtos/                     # Data Transfer Objects
│   ├── RequestDTOs.ts        # Input shapes from the UI
│   └── ResponseDTOs.ts       # Output shapes for the UI
└── common/                   # Shared Application logic
    └── UseCaseInterface.ts   # Optional: Standardize execute() methods

```