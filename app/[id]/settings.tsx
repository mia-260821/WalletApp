import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Account } from '@/ddd/domain/entities/Account'; 
import { CreateAccountModal } from '@/components/CreateAccountModal';
import { RepositoryFactory } from '@/ddd/infra/factory/RepositoryFactory';
import { GetAccountsUseCase } from '@/ddd/application/usecases/GetAccountsUseCase';
import { useGlobalSearchParams } from 'expo-router';
import { useBalanceRefresh } from '@/hooks/useRefreshBalance';
import { useWalletStore } from '@/store/useWalletStore';
import { Ionicons } from '@expo/vector-icons';
import { BackupSeedModal } from '@/components/BackupSeedModal';
import { GetSeedPhraseUseCase } from '@/ddd/application/usecases/GetSeedPhraseUseCase';



export default function SettingsScreen() {

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seedToShow, setSeedToShow] = useState<string | null>(null);

  // walletId from the url path
  const params = useGlobalSearchParams<{id: string}>();
  console.log("search parameter object", params);
  const walletId = params.id;

  const { refresh: refreshBalance, isRefreshing: isRefreshingBalance } = useBalanceRefresh(walletId);
  const balances = useWalletStore((set) => set.balances);

  const getBalance = useCallback((address: string) : number => {
    const foundBalance = balances.find(item => item.address.toLowerCase() === address.toLowerCase());
    return foundBalance? foundBalance.balance : 0;
  }, [balances]);

  const handleCreateNewAccount = () => {
    setIsModalVisible(true); // Open the component we just built!
  };

  const handleBackupSeedPhrase = async () => {
    const repo = RepositoryFactory.createWalletRepository();
    const useCase = new GetSeedPhraseUseCase(repo);
    
    try {
      const phrase = await useCase.execute(walletId!);
      setSeedToShow(phrase);
    } catch (e) {
      Alert.alert("Error", "Could not retrieve seed phrase");
    }
  };

  const fetchAccounts = async (walletId: string) => {
    console.log("refresh accounts: wallet id", walletId);
    try {
      setLoading(true);
      
      const repo = RepositoryFactory.createWalletRepository();
      const useCase = new GetAccountsUseCase(repo);
      const data = await useCase.execute(walletId);
   
      setAccounts([...data]);
    } catch (error) {
      Alert.alert("Error", "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async (walletId: string) => {
    console.log("Refresh accounts");
    await fetchAccounts(walletId);
    console.log("Refresh balances");
    await refreshBalance();
  }

  useEffect(() => {
    refresh(walletId);
  }, []);

  const RefreshButton = () => (
    <TouchableOpacity 
      onPress={() => refresh(walletId) } 
      style={{}}
    >
      { isRefreshingBalance ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <Ionicons name="refresh" size={24} color="#333" />
      )}
    </TouchableOpacity>
  );

  const renderAccountItem = ({ item }: { item: Account }) => (
    <View style={styles.accountItem}>
      <View style={{flexDirection:'column', gap: 4}}>
        <Text style={styles.accountAddress}>{item.address.getValue()}</Text>
        <Text style={styles.accountPath}>{item.label || 'Unnamed Account'}</Text>
      </View>
      <Text style={styles.accountBalance}>
        {`${ getBalance(item.address.getValue()) } ${item.network.toUpperCase()}`}
      </Text>
    </View>
  );

  if (loading) return <ActivityIndicator />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Accounts</Text>
      </View>
        <ScrollView
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshingBalance} 
              tintColor="#4f46e5" // Spinner color for iOS
              colors={["#4f46e5"]} // Spinner color for Android
            />
          }
        >
        <FlatList
          data={accounts}
          renderItem={renderAccountItem}
          keyExtractor={(item) => item.address.getValue()}
          ListHeaderComponent={() => (
            <>
              <TouchableOpacity style={styles.buttonSecondary} onPress={handleBackupSeedPhrase}>
                <Text style={styles.buttonSecondaryText}>Backup Seed Phrase</Text>
              </TouchableOpacity>
              <BackupSeedModal 
                isVisible={!!seedToShow} 
                seedPhrase={seedToShow || ""} 
                onClose={() => setSeedToShow(null)} 
              />
              <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
                <Text style={styles.sectionTitle}>Your Accounts ({accounts.length})</Text>
                <Text style={styles.sectionTitle}>{ RefreshButton() }</Text>
              </View>
            </>
          )}
        />
        </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleCreateNewAccount}>
          <Text style={styles.buttonPrimaryText}>+ Create New Account</Text>
        </TouchableOpacity>
        <CreateAccountModal 
          isVisible={isModalVisible} 
          onClose={() => setIsModalVisible(false)} 
          onAccountCreated={async () => {
            console.log("Account created, refreshing...");
            setIsModalVisible(false);
            await refresh(walletId);
          }}
          walletId={walletId}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    padding: 20, 
  },
  accountItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  accountAddress: { fontSize: 14, fontWeight: '500' },
  accountPath: { fontSize: 12, color: '#888' },
  accountBalance: { fontSize: 14, fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  buttonPrimary: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonPrimaryText: { color: 'white', fontWeight: 'bold' },
  buttonSecondary: { backgroundColor: '#fff', padding: 15, borderRadius: 8, alignItems: 'center', margin: 20, borderWidth: 1, borderColor: '#ccc' },
  buttonSecondaryText: { color: '#4f46e5', fontWeight: 'bold' },
});
