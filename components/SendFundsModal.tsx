import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TextInput, 
  TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import { RepositoryFactory } from '@/ddd/infra/factory/RepositoryFactory';
import { NetworkType } from '@/ddd/domain/services/CoinTypePolicy';
import { Address } from '@/ddd/domain/value-objects/Address';

export interface SendFundsModalProps {
  isVisible: boolean;
  walletId: string;
  fromAddress: string;
  network: NetworkType;
  onClose: () => void;
  onSuccess: () => void;
}

export const SendFundsModal = ({ 
  isVisible, walletId, fromAddress, network, onClose, onSuccess 
}: SendFundsModalProps) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTransfer = async () => {
    setIsSending(true);
    try {
      const { BlockchainService } = await import('@/ddd/infra/services/BlockchainService');
      const { KeyDerivationService } = await import('@/ddd/infra/services/KeyDerivationService');
      const { SendFundsUseCase } = await import('@/ddd/application/usecases/SendFundsUseCase');

      const repo = RepositoryFactory.createWalletRepository();
      const blockchain = new BlockchainService();
      const keyService = new KeyDerivationService();
      
      const useCase = new SendFundsUseCase(repo, blockchain, keyService);
      
      await useCase.execute(
        walletId,
        new Address(fromAddress),
        new Address(toAddress),
        parseFloat(amount),
        network
      );

      console.log("Success", "Transaction sent successfully!");
      onSuccess(); // Triggers dashboard refresh
      onClose();
    } catch (error: any) {
      Alert.alert("Transfer Failed", error.message || "Unknown error occurred");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Transfer {network}</Text>
          <Text style={styles.subtitle}>From: {fromAddress.slice(0, 6)}...{fromAddress.slice(-4)}</Text>

          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={toAddress}
            onChangeText={setToAddress}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sendBtn, isSending && { opacity: 0.6 }]} 
              onPress={handleTransfer}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendText}>Confirm Send</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#f9fafb', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', fontSize: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  cancelBtn: { flex: 1, padding: 18, alignItems: 'center' },
  cancelText: { color: '#6b7280', fontWeight: '600' },
  sendBtn: { flex: 2, backgroundColor: '#4f46e5', padding: 18, borderRadius: 14, alignItems: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
