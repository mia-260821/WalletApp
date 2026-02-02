import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Modal, TextInput, ActivityIndicator, Alert 
} from 'react-native';
import { RepositoryFactory } from '@/ddd/infra/factory/RepositoryFactory';
import { CreateAccountUseCase } from '@/ddd/application/usecases/CreateAccountUseCase';
import { KeyDerivationService } from '@/ddd/infra/services/KeyDerivationService';
import { NETWORKS } from '@/constants/network';

interface CreateAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAccountCreated: () => void; // Callback to refresh the list
  walletId: string,
}

export function CreateAccountModal({ isVisible, onClose, onAccountCreated, walletId }: CreateAccountModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [label, setLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    const repo = RepositoryFactory.createWalletRepository();
    const keyService = new KeyDerivationService();
    const useCase = new CreateAccountUseCase(repo, keyService);

    await useCase.execute(walletId, label, selectedNetwork.id);
    
    onAccountCreated();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>New Account</Text>

          <Text style={styles.label}>Select Network</Text>
          <View style={styles.networkGrid}>
            {NETWORKS.map((net) => (
              <TouchableOpacity 
                key={net.id}
                style={[styles.netCard, selectedNetwork.id === net.id && { borderColor: net.color, borderWidth: 2 }]}
                onPress={() => setSelectedNetwork(net)}
              >
                <Text style={styles.netIcon}>{net.icon}</Text>
                <Text style={styles.netName}>{net.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Account Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. My Savings" 
            value={label}
            onChangeText={setLabel}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSubmitting}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmText}>Create</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, color: '#6b7280', marginBottom: 8, marginTop: 16 },
  networkGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  netCard: { width: '30%', padding: 12, borderRadius: 12, backgroundColor: '#f9fafb', alignItems: 'center', borderColor: 'transparent' },
  netIcon: { fontSize: 24, marginBottom: 4 },
  netName: { fontSize: 12, fontWeight: '600' },
  input: { backgroundColor: '#f3f4f6', padding: 16, borderRadius: 12, fontSize: 16 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  cancelBtn: { flex: 1, padding: 18, alignItems: 'center' },
  confirmBtn: { flex: 2, backgroundColor: '#4f46e5', padding: 18, borderRadius: 14, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: 'bold' }
});
