import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { InitializeWalletUseCase } from '@/ddd/application/usecases/InitializeWalletUseCase';
import { RepositoryFactory } from '@/ddd/infra/factory/RepositoryFactory';
import { KeyDerivationService } from '@/ddd/infra/services/KeyDerivationService';
import { IWalletRepository } from '@/ddd/domain/repositories/IWalletRepository';
import { ImportWalletModal } from '@/components/ImportWalletModal';
import { useRouter } from 'expo-router';
import { useWalletStore } from '@/store/useWalletStore';


export default function OnboardingScreen() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const updateWalletId = useWalletStore((state) => state.updateWalletId);

  const goToWallet = (walletId: string) => router.replace({pathname: "/[id]/dashboard", params: { id: walletId }});

  const handleCreateWallet = async () => {
    setIsCreating(true);
    try {
      const repo: IWalletRepository = RepositoryFactory.createWalletRepository();
      const keyService = new KeyDerivationService();
      
      const useCase = new InitializeWalletUseCase(repo, keyService);
      const wallet = await useCase.execute();

      updateWalletId(wallet.id);
      goToWallet(wallet.id);
    } catch (error) {
      Alert.alert("Creation Failed", "Could not generate secure wallet.");
    } finally {
      setIsCreating(false);
    }
  };

  const onImportSuccess = (walletId: string) => {
    setShowImport(false);
    
    updateWalletId(walletId);
    goToWallet(walletId);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>SecureWallet</Text>
          <Text style={styles.subtitle}>Your gateway to the decentralized world.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleCreateWallet}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Create New Wallet</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setShowImport(true)}
          >
            <Text style={styles.secondaryButtonText}>I already have a wallet</Text>
          </TouchableOpacity>

          <ImportWalletModal 
            isVisible={showImport} 
            onClose={() => setShowImport(false)}
            onSuccess={onImportSuccess}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 30, justifyContent: 'space-between' },
  logoContainer: { alignItems: 'center', marginTop: 100 },
  logo: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 12, paddingHorizontal: 20 },
  buttonContainer: { marginBottom: 40 },
  primaryButton: { backgroundColor: '#4f46e5', padding: 18, borderRadius: 16, alignItems: 'center', marginBottom: 16 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { padding: 18, alignItems: 'center' },
  secondaryButtonText: { color: '#4f46e5', fontSize: 16, fontWeight: '600' },
});
