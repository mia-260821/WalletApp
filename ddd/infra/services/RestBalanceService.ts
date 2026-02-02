import { IBalanceService } from '../../domain/services/IBalanceService';
import { Address } from '@/ddd/domain/value-objects/Address';
import { Balance } from '../../domain/value-objects/Balance';
import { NetworkType } from '../../domain/services/CoinTypePolicy';
import { BACKEND_HOST } from '../config/backend';



export class RestBalanceService implements IBalanceService {
  private readonly API_URL = BACKEND_HOST;

  async fetchRemoteBalance(address: Address, network: NetworkType): Promise<Balance> {
    try {
      const response = await fetch(`${this.API_URL}/balance/${network.toLowerCase()}/${address.getValue()}`);
      const data = await response.json();
      
      // Map the API response back to our Domain Value Object
      return new Balance(data.amount); 
    } catch (error) {
      console.error("API Error:", error);
      return new Balance(0); // Fallback or throw domain error
    }
  }
}
