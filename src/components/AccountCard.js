import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCode } from '../utils/otpUtils';
import { generateHOTPCode } from '../utils/otpUtils';
import colors from '../styles/colors';

export default function AccountCard({ account, isEditing, deleteAccount, updateAccount, index }) {
  const shakingValue = useRef(new Animated.Value(0)).current;

  const shakeAccount = () => {
    Animated.sequence([
      Animated.timing(shakingValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakingValue, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakingValue, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakingValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    if (account.type === 'hotp') {
      const updatedCounter = account.counter + 1;
      const updatedCode = generateHOTPCode(account.secretKey, updatedCounter);
      updateAccount(account.id, { counter: updatedCounter, code: updatedCode });
    }
    shakeAccount();
  };

  return (
    <Animated.View
      style={[
        styles.accountCard,
        {
          transform: [{ translateX: shakingValue }],
        },
      ]}
    >
      <TouchableOpacity style={styles.accountCardInner} onPress={handlePress}>
        <View style={styles.accountInfo}>
          <View style={styles.accountHeader}>
            <Text style={styles.issuerName}>{account.issuer}</Text>
            <View style={[styles.typeTag, account.type === 'hotp' ? styles.hotpTag : styles.totpTag]}>
              <Text style={styles.typeTagText}>{account.type === 'totp' ? 'TIME BASED' : 'COUNTER BASED'}</Text>
            </View>
          </View>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.codeText}>{formatCode(account.code)}</Text>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAccount(account.id)}>
            <MaterialIcons name="delete" size={24} color={colors.danger} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accountCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  accountCardInner: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  issuerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  accountName: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: colors.text.primary,
  },
  deleteButton: {
    padding: 10,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totpTag: {
    backgroundColor: 'rgba(66, 133, 244, 0.1)',
  },
  hotpTag: {
    backgroundColor: 'rgba(52, 168, 83, 0.1)',
  },
  typeTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#555',
  },
}); 