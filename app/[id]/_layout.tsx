import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Wallet',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Accounts',
        }}
      />
    </Tabs>
  );
}
