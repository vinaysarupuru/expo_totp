import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <MaterialIcons name="security" size={64} color="#DDD" />
      <Text style={styles.emptyStateText}>No accounts added yet</Text>
      <Text style={styles.emptyStateSubtext}>Tap + to add your first account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: colors.text.muted,
    marginTop: 8,
    textAlign: 'center',
  },
}); 