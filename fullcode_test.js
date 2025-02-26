import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CryptoJS from 'crypto-js';


// Helper function to generate HMAC-SHA1 hash
const generateHMACSHA1 = (secretKey, message) => {
  const hmac = CryptoJS.HmacSHA1(message, secretKey);
  return hmac.toString(CryptoJS.enc.Hex);
};

// Helper function to generate a dynamic truncation (DT) string
const dynamicTruncation = (hmacHash) => {
  const offset = parseInt(hmacHash.slice(-1), 16);
  const binary = ((parseInt(hmacHash.substr(offset * 2, 8), 16) & 0x7fffffff).toString());
  return binary.slice(-6); // Last 6 digits
};

// Generate HOTP code
const generateHOTPCode = (secretKey, counter) => {
  const counterHex = counter.toString(16).padStart(16, '0'); // Convert counter to 8-byte hex
  const hmacHash = generateHMACSHA1(secretKey, counterHex);
  const otp = dynamicTruncation(hmacHash);
  return otp.padStart(6, '0'); // Ensure 6 digits
};

// Generate TOTP code
const generateTOTPCode = (secretKey) => {
  const timeStep = 30; // 30-second time step
  const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
  const counter = Math.floor(timestamp / timeStep); // Counter based on time step
  return generateHOTPCode(secretKey, counter);
};

export default function AuthenticatorApp() {
  const [accounts, setAccounts] = useState([
    { id: '1', name: 'Google Account', code: '428913', issuer: 'Google', secretKey: 'JBSWY3DPEHPK3PXP', type: 'totp', counter: 0 },
    { id: '2', name: 'Microsoft Account', code: '582671', issuer: 'Microsoft', secretKey: 'JBSWY3DPEHPK3PXQ', type: 'totp', counter: 0 },
    { id: '3', name: 'GitHub Account', code: '395814', issuer: 'GitHub', secretKey: 'JBSWY3DPEHPK3PXR', type: 'totp', counter: 0 },
  ]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountIssuer, setNewAccountIssuer] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newAccountType, setNewAccountType] = useState('totp');
  const [isEditing, setIsEditing] = useState(false);

  const progressAnim = useRef(new Animated.Value(1)).current;
  const shakingValues = useRef(accounts.map(() => new Animated.Value(0))).current;

  // Timer and progress bar animation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Regenerate TOTP codes and reset timer
          setAccounts((prevAccounts) =>
            prevAccounts.map((acc) =>
              acc.type === 'totp' ? { ...acc, code: generateTOTPCode(acc.secretKey) } : acc
            )
          );

          // Reset progress bar animation
          progressAnim.setValue(1);
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 30000,
            useNativeDriver: false,
          }).start();

          return 30;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [progressAnim]);

  // Shake animation for account cards
  const shakeAccount = (index) => {
    Animated.sequence([
      Animated.timing(shakingValues[index], { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakingValues[index], { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakingValues[index], { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakingValues[index], { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Add a new account
  const addAccount = () => {
    if (newAccountName.trim() && newAccountIssuer.trim() && newSecretKey.trim()) {
      const newAccount = {
        id: (accounts.length + 1).toString(),
        name: newAccountName,
        issuer: newAccountIssuer,
        secretKey: newSecretKey,
        type: newAccountType,
        counter: newAccountType === 'hotp' ? 0 : undefined,
        code: newAccountType === 'totp' ? generateTOTPCode(newSecretKey) : generateHOTPCode(newSecretKey, 0),
      };
      setAccounts([...accounts, newAccount]);
      setNewAccountName('');
      setNewAccountIssuer('');
      setNewSecretKey('');
      setShowAddModal(false);
    }
  };

  // Delete an account
  const deleteAccount = (id) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  // Format code for readability
  const formatCode = (code) => {
    return `${code.substring(0, 3)} ${code.substring(3)}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#4285F4', '#34A853']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Authenticator</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Timer and Progress Bar */}
        <View style={styles.timerContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: progressAnim.interpolate({
                  inputRange: [0, 0.3, 1],
                  outputRange: ['#FF5252', '#FFC107', '#4CAF50'],
                }),
              },
            ]}
          />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </LinearGradient>

      {/* Accounts List */}
      <ScrollView style={styles.scrollView}>
        {accounts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="security" size={64} color="#DDD" />
            <Text style={styles.emptyStateText}>No accounts added yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap + to add your first account</Text>
          </View>
        ) : (
          accounts.map((account, index) => (
            <Animated.View
              key={account.id}
              style={[
                styles.accountCard,
                {
                  transform: [{ translateX: shakingValues[index] }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.accountCardInner}
                onPress={() => {
                  if (account.type === 'hotp') {
                    const updatedCounter = account.counter + 1;
                    const updatedCode = generateHOTPCode(account.secretKey, updatedCounter);
                    setAccounts((prevAccounts) =>
                      prevAccounts.map((acc) =>
                        acc.id === account.id ? { ...acc, counter: updatedCounter, code: updatedCode } : acc
                      )
                    );
                  }
                  shakeAccount(index);
                }}
              >
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
                    <MaterialIcons name="delete" size={24} color="#FF5252" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <LinearGradient colors={['#4285F4', '#34A853']} style={styles.addButtonGradient}>
          <MaterialIcons name="add" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Account Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Account</Text>
            <Text style={styles.inputLabel}>Service Provider</Text>
            <TextInput
              style={styles.input}
              placeholder="Google, Microsoft, GitHub, etc."
              value={newAccountIssuer}
              onChangeText={setNewAccountIssuer}
            />
            <Text style={styles.inputLabel}>Account Name</Text>
            <TextInput
              style={styles.input}
              placeholder="username@example.com"
              value={newAccountName}
              onChangeText={setNewAccountName}
            />
            <Text style={styles.inputLabel}>Secret Key</Text>
            <TextInput
              style={styles.input}
              placeholder="JBSWY3DPEHPK3PXP"
              value={newSecretKey}
              onChangeText={setNewSecretKey}
            />
            <Text style={styles.inputLabel}>Authentication Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, newAccountType === 'totp' && styles.typeButtonSelected]}
                onPress={() => setNewAccountType('totp')}
              >
                <Text style={[styles.typeButtonText, newAccountType === 'totp' && styles.typeButtonTextSelected]}>
                  Time Based (TOTP)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, newAccountType === 'hotp' && styles.typeButtonSelected]}
                onPress={() => setNewAccountType('hotp')}
              >
                <Text style={[styles.typeButtonText, newAccountType === 'hotp' && styles.typeButtonTextSelected]}>
                  Counter Based (HOTP)
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButtonModal, !(newAccountName && newAccountIssuer && newSecretKey) && styles.addButtonDisabled]}
                disabled={!(newAccountName && newAccountIssuer && newSecretKey)}
                onPress={addAccount}
              >
                <Text style={styles.addButtonText}>Add Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  timerContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  timerText: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    right: 0,
    top: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  accountCard: {
    backgroundColor: 'white',
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
  issuerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4285F4',
    marginBottom: 4,
  },
  accountName: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#333',
  },
  deleteButton: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E3E5',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F7F9FC',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E1E3E5',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  typeButtonText: {
    color: '#555',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: 'white',
  },
  addButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F3F5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  addButtonModal: {
    backgroundColor: '#4285F4',
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
});