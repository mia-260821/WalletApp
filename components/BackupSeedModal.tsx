import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';

interface Props {
  isVisible: boolean;
  seedPhrase: string; // "apple banana cherry..."
  onClose: () => void;
}

export const BackupSeedModal = ({ isVisible, seedPhrase, onClose }: Props) => {
  const words = seedPhrase.split(' ');

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <Text style={styles.title}>Recovery Phrase</Text>
        <Text style={styles.subtitle}>Write down these 12 words in order and keep them safe.</Text>

        <View style={styles.wordGrid}>
          {words.map((word, index) => (
            <View key={index} style={styles.wordBox}>
              <Text style={styles.wordIndex}>{index + 1}</Text>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>I've Written It Down</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  subtitle: { textAlign: 'center', color: '#6b7280', marginVertical: 16 },
  wordGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 },
  wordBox: { 
    width: '30%', padding: 12, backgroundColor: '#f3f4f6', 
    borderRadius: 8, flexDirection: 'row', alignItems: 'center' 
  },
  wordIndex: { fontSize: 10, color: '#9ca3af', marginRight: 4 },
  wordText: { fontWeight: '600', fontSize: 14 },
  closeButton: { backgroundColor: '#4f46e5', padding: 18, borderRadius: 16, marginTop: 40, width: '100%', alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold' }
});
