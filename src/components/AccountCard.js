import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert, Platform, Clipboard, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatCode, generateHOTPCode } from '../utils/otpUtils';
import { useTheme } from '../context/ThemeContext';

export default function AccountCard({ account, isEditing, deleteAccount, updateAccount, index }) {
  const { theme } = useTheme();
  const shakingValue = useRef(new Animated.Value(0)).current;
  const [copied, setCopied] = useState(false);

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

  const handleDelete = () => {
    console.log('Delete button pressed for account:', account.id);
    
    // Use a different approach for web platform
    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to delete "${account.issuer} - ${account.name}"?`)) {
        deleteAccount(account.id);
      }
    } else {
      // Use Alert for native platforms
      Alert.alert(
        "Delete Account",
        `Are you sure you want to delete "${account.issuer} - ${account.name}"?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Delete", 
            onPress: () => deleteAccount(account.id),
            style: "destructive"
          }
        ]
      );
    }
  };

  const copyToClipboard = () => {
    const code = account.code;
    
    // Handle clipboard differently based on platform
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      Clipboard.setString(code);
      
      // Show toast on Android
      if (Platform.OS === 'android') {
        ToastAndroid.show('Code copied to clipboard', ToastAndroid.SHORT);
      }
      
      // For iOS and other platforms, use the copied state
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Animated.View
      style={[
        styles.accountCard,
        {
          transform: [{ translateX: shakingValue }],
          backgroundColor: theme.colors.card,
        },
      ]}
    >
      <TouchableOpacity style={styles.accountCardInner} onPress={handlePress}>
        <View style={styles.accountInfo}>
          <View style={styles.accountHeader}>
            <Text style={[styles.issuerName, { color: theme.colors.primary }]}>
              {account.issuer}
            </Text>
            <View style={[
              styles.typeTag, 
              account.type === 'hotp' ? styles.hotpTag : styles.totpTag
            ]}>
              <Text style={styles.typeTagText}>
                {account.type === 'totp' ? 'TIME BASED' : 'COUNTER BASED'}
              </Text>
            </View>
          </View>
          <Text style={[styles.accountName, { color: theme.colors.text.secondary }]}>
            {account.name}
          </Text>
          <View style={styles.codeContainer}>
            <Text style={[styles.codeText, { color: theme.colors.text.primary }]}>
              {formatCode(account.code)}
            </Text>
            <TouchableOpacity 
              style={styles.copyButton} 
              onPress={copyToClipboard}
              accessibilityLabel={`Copy code for ${account.name}`}
            >
              <MaterialIcons 
                name={copied ? "check" : "content-copy"} 
                size={20} 
                color={copied ? theme.colors.success : theme.colors.text.secondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDelete}
            accessibilityLabel={`Delete ${account.name}`}
          >
            <MaterialIcons name="delete" size={24} color={theme.colors.danger} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accountCard: {
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
    marginBottom: 4,
  },
  accountName: {
    fontSize: 13,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  copyButton: {
    marginLeft: 12,
    padding: 6,
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