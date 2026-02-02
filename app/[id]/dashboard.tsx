import { SendFundsModal } from '@/components/SendFundsModal';
import { NetworkType } from '@/ddd/domain/services/CoinTypePolicy';
import { useGlobalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';

// UI Constants
const HEADER_HEIGHT = 280;

export default function DashboardScreen() {
  const scrollY = useSharedValue(0);

  // 1. Scroll Handler (Replaces deprecated useScrollViewOffset)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // 2. Parallax Header Animations
  const headerStyle = useAnimatedStyle(() => {
    return {
      height: HEADER_HEIGHT,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [HEADER_HEIGHT / 2, 0, -HEADER_HEIGHT / 2],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const balanceStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT / 2], [1, 0]),
      transform: [{ scale: interpolate(scrollY.value, [-100, 0], [1.2, 1], Extrapolation.CLAMP) }],
    };
  });

  const { id: walletId } = useGlobalSearchParams<{id: string}>();
  const [isSendFundsModalOpen, setIsSendFundsModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      {/* BACKGROUND LAYER: Total Balance */}
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.View style={balanceStyle}>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.amount}>$12,450.80</Text>
          <View style={styles.chip}>
            <Text style={styles.chipText}>+5.2% Today</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* FOREGROUND LAYER: Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Assets</Text>
          
          {/* Example of mapping Domain Entity Data */}
          {['Ethereum', 'Polygon', 'Arbitrum'].map((network, index) => (
            <TouchableOpacity key={network} style={styles.assetRow}>
              <View style={styles.iconPlaceholder} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.assetName}>{network}</Text>
                <Text style={styles.assetAddress}>0x71...74{index}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.assetBalance}>{(1.2 + index).toFixed(2)} ETH</Text>
                <Text style={styles.assetValue}>${(3200 * (1.2 + index)).toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Quick Actions */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setIsSendFundsModalOpen(true)}>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10b981' }]}>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <SendFundsModal 
            isVisible={isSendFundsModalOpen}
            walletId={walletId}
            fromAddress={"0x123...example"} // This should come from your selected account
            network={NetworkType.ETHEREUM}
            onClose={() => setIsSendFundsModalOpen(false)}
            onSuccess={()=> Alert.alert("ok")} // Automatically refreshes the Go-Gin balance
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  label: { color: '#9ca3af', fontSize: 16, marginBottom: 8 },
  amount: { color: '#fff', fontSize: 48, fontWeight: 'bold' },
  chip: { backgroundColor: '#064e3b', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 12 },
  chipText: { color: '#34d399', fontSize: 14, fontWeight: '600' },
  scrollContent: { paddingTop: HEADER_HEIGHT },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 800,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  assetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb' },
  assetName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  assetAddress: { fontSize: 12, color: '#6b7280' },
  assetBalance: { fontSize: 16, fontWeight: '600', color: '#111827' },
  assetValue: { fontSize: 12, color: '#6b7280' },
  actionContainer: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionButton: { flex: 1, height: 50, backgroundColor: '#4f46e5', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
