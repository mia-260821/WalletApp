// src/infrastructure/services/BlockchainService.ts

import { ethers, Wallet as EthersWallet } from 'ethers';
import * as btc from '@scure/btc-signer';
import * as solana from '@solana/web3.js';
// @ts-ignore
import { secp256k1 } from '@noble/curves/secp256k1';

import { IBlockchainService } from '../../domain/services/IBlockchainService';
import { NetworkType } from '../../domain/services/CoinTypePolicy';
import { PrivateKey } from '../../domain/value-objects/PrivateKey';
import { Address } from '../../domain/value-objects/Address';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionMapper } from '../persistence/mappers/TransactionMapper';
import { BACKEND_HOST } from '../config/backend';

export class BlockchainService implements IBlockchainService {
  private readonly BACKEND_URL = BACKEND_HOST;

  async transfer(
    network: NetworkType,
    privateKey: PrivateKey,
    to: Address,
    amount: number
  ): Promise<Transaction> {
    let signedPayload: string;
    let fromAddress: string;

    const privKeyBuffer = Buffer.from(privateKey.getValue().replace('0x', ''), 'hex');

    // 1. SIGNING STRATEGY PER CHAIN
    switch (network) {
      case NetworkType.ETHEREUM: {
        const signer = new EthersWallet(privateKey.getValue());
        fromAddress = await signer.getAddress();
        
        // Sign an EIP-191 message for the mock Go-backend to verify
        const message = JSON.stringify({ to: to.getValue(), amount, network, nonce: Date.now() });
        signedPayload = await signer.signMessage(message);
        break;
      }

      case NetworkType.BITCOIN: {
        // Use modern scure-btc-signer for SegWit (bc1q...)
        const publicKey = secp256k1.getPublicKey(privKeyBuffer, true);
        const p2wpkh = btc.p2wpkh(publicKey);
        fromAddress = p2wpkh.address!;
        
        // Mock signing: in production, you'd build a btc.Transaction() here
        signedPayload = Buffer.from(secp256k1.sign(Buffer.from("tx_hash"), privKeyBuffer).toRawBytes()).toString('hex');
        break;
      }

      case NetworkType.SOLANA: {
        // Use Solana web3.js 2.0+ keypair logic
        const keypair = solana.Keypair.fromSeed(privKeyBuffer.slice(0, 32));
        fromAddress = keypair.publicKey.toBase58();
        
        // Create and sign a mock instruction
        signedPayload = "sol_signed_tx_2026"; 
        break;
      }

      default:
        throw new Error(`Unsupported network: ${network}`);
    }

    // 2. BROADCAST TO GOLANG BACKEND
    const response = await fetch(`${this.BACKEND_URL}/transactions/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress,
        to: to.getValue(),
        amount,
        network,
        signature: signedPayload
      }),
    });

    if (!response.ok) throw new Error("Transaction rejected by backend");

    const data = await response.json();
    return TransactionMapper.toDomain(data);
  }
}
