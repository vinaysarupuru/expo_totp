import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import AccountCard from '../components/AccountCard';
import EmptyState from '../components/EmptyState';
import AddAccountModal from '../components/AddAccountModal';
import useOTPTimer from '../hooks/useOTPTimer';
import * as otpUtils from '../utils/otpUtils';
import colors from '../styles/colors';

const STORAGE_KEY = '@authenticator_accounts';

export default function HomeScreen() {
  const [accounts, setAccounts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountIssuer, setNewAccountIssuer] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newAccountType, setNewAccountType] = useState('totp');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load accounts from storage on initial render
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const storedAccounts = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedAccounts !== null) {
          // Update codes for TOTP accounts before setting state
          const parsedAccounts = JSON.parse(storedAccounts);
          const updatedAccounts = parsedAccounts.map(acc => {
            if (acc.type === 'totp') {
              return {
                ...acc,
                code: otpUtils.generateTOTPCode(acc.secretKey)
              };
            }
            return acc;
          });
          setAccounts(updatedAccounts);
        }
      } catch (error) {
        console.error('Failed to load accounts from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccounts();
  }, []);

  // Save accounts to storage whenever they change
  useEffect(() => {
    const saveAccounts = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
      } catch (error) {
        console.error('Failed to save accounts to storage', error);
      }
    };

    if (!isLoading) {
      saveAccounts();
    }
  }, [accounts, isLoading]);

  const { timeLeft, progressAnim } = useOTPTimer(accounts, setAccounts);

  // Add a new account
  const addAccount = () => {
    if (newAccountName.trim() && newAccountIssuer.trim() && newSecretKey.trim()) {
      const newAccount = {
        id: Date.now().toString(), // Use timestamp as unique ID
        name: newAccountName,
        issuer: newAccountIssuer,
        secretKey: newSecretKey,
        type: newAccountType,
        counter: newAccountType === 'hotp' ? 0 : undefined,
        code: newAccountType === 'totp' ? otpUtils.generateTOTPCode(newSecretKey) : otpUtils.generateHOTPCode(newSecretKey, 0),
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

  // Update an account
  const updateAccount = (id, updates) => {
    setAccounts(
      accounts.map((account) => (account.id === id ? { ...account, ...updates } : account))
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Header 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        timeLeft={timeLeft} 
        progressAnim={progressAnim} 
      />

      <ScrollView style={styles.scrollView}>
        {accounts.length === 0 ? (
          <EmptyState />
        ) : (
          accounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              isEditing={isEditing}
              deleteAccount={deleteAccount}
              updateAccount={updateAccount}
              index={index}
            />
          ))
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
        <LinearGradient 
          colors={[colors.primary, colors.secondary]} 
          style={styles.addButtonGradient}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <AddAccountModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addAccount}
        newAccountName={newAccountName}
        setNewAccountName={setNewAccountName}
        newAccountIssuer={newAccountIssuer}
        setNewAccountIssuer={setNewAccountIssuer}
        newSecretKey={newSecretKey}
        setNewSecretKey={setNewSecretKey}
        newAccountType={newAccountType}
        setNewAccountType={setNewAccountType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
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
  bottomSpacer: {
    height: 80,
  },
}); 