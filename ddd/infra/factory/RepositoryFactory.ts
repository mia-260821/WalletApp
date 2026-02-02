import { Platform } from 'react-native';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository';
import { SimpleWalletRepository as  NativeWalletRepository } from '../persistence/SimpleWalletRepository.native';
import { SimpleWalletRepository as WebWalletRepository } from '../persistence/SimpleWalletRepository.web';

export class RepositoryFactory {
  static createWalletRepository(): IWalletRepository {
    // Platform.select is the "Expert" way to switch
    return Platform.select({
      web: () => new WebWalletRepository(),
      native: () => new NativeWalletRepository(), // native = iOS + Android
      default: () => new NativeWalletRepository(),
    })();
  }
}
