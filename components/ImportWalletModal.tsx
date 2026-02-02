import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, TextInput, 
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { ImportWalletUseCase } from '@/ddd/application/usecases/ImportWalletUseCase';
import { RepositoryFactory } from '@/ddd/infra/factory/RepositoryFactory';
import { KeyDerivationService } from '@/ddd/infra/services/KeyDerivationService';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: (walletId: string) => void;
}

export function ImportWalletModal({ isVisible, onClose, onSuccess }: Props) {
  const [phrase, setPhrase] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    console.log(phrase)
    const cleanPhrase = phrase.trim().toLowerCase();
    
    // Quick validation before hitting the Use Case
    if (cleanPhrase.split(/\s+/).length < 12) {
      Alert.alert("Error", "Mnemonic must be at least 12 words.");
      return;
    }

    setLoading(true);
    try {
      // DDD Orchestration
      const repo = RepositoryFactory.createWalletRepository();
      const keyService = new KeyDerivationService();
      const useCase = new ImportWalletUseCase(repo, keyService);

      const wallet = await useCase.execute(cleanPhrase);
      
      console.log('import done');
      setPhrase('');
      onSuccess(wallet.id);
    } catch (e: any) {
      // This catches the 'invalid checksum' error from our SeedPhrase Value Object
      Alert.alert("Import Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Import Wallet</Text>
          <View style={{ width: 50 }} /> 
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Secret Recovery Phrase</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Enter your 12 or 24-word phrase, separated by spaces..."
            placeholderTextColor="#9ca3af"
            value={phrase}
            onChangeText={setPhrase}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.warning}>
            ⚠️ Never share your recovery phrase. Anyone with these words can steal your funds.
          </Text>

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleImport}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Import Wallet</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' 
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  closeText: { color: '#4f46e5', fontSize: 16 },
  content: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
  input: { 
    height: 160, backgroundColor: '#f9fafb', borderRadius: 16, 
    padding: 16, fontSize: 16, textAlignVertical: 'top',
    borderWidth: 1, borderColor: '#e5e7eb', color: '#111827'
  },
  warning: { color: '#b91c1c', fontSize: 13, marginTop: 16, lineHeight: 18 },
  button: { 
    backgroundColor: '#4f46e5', padding: 18, borderRadius: 16, 
    alignItems: 'center', marginTop: 32 
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

