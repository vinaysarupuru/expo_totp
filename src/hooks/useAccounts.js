import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as otpUtils from '../utils/otpUtils';

const STORAGE_KEY = '@authenticator_accounts';

export default function useAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
          setFilteredAccounts(updatedAccounts);
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

  // Filter accounts when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAccounts(accounts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = accounts.filter(
        account => 
          account.name.toLowerCase().includes(query) || 
          account.issuer.toLowerCase().includes(query)
      );
      setFilteredAccounts(filtered);
    }
  }, [searchQuery, accounts]);

  // Add a new account
  const addAccount = (newAccountName, newAccountIssuer, newSecretKey, newAccountType) => {
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
      setAccounts(prevAccounts => [...prevAccounts, newAccount]);
      return true;
    }
    return false;
  };

  // Delete an account
  const deleteAccount = (id) => {
    setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
  };

  // Update an account
  const updateAccount = (id, updates) => {
    console.log(`Updating account ${id} with:`, updates);
    console.log('Current accounts:', accounts);
    
    setAccounts(prevAccounts => {
      const updatedAccounts = prevAccounts.map(account => 
        account.id === id ? { ...account, ...updates } : account
      );
      console.log('Updated accounts:', updatedAccounts);
      return updatedAccounts;
    });
  };

  return {
    accounts,
    filteredAccounts,
    isLoading,
    searchQuery,
    setSearchQuery,
    addAccount,
    deleteAccount,
    updateAccount
  };
} 