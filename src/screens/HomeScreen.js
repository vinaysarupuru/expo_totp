import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/Header';
import AccountCard from '../components/AccountCard';
import EmptyState from '../components/EmptyState';
import AddAccountModal from '../components/AddAccountModal';
import useOTPTimer from '../hooks/useOTPTimer';
import * as otpUtils from '../utils/otpUtils';
import colors from '../styles/colors';

export default function HomeScreen() {
  const [accounts, setAccounts] = useState([
    { id: '1', name: 'Google Account', code: '428913', issuer: 'Google', secretKey: 'JBSWY3DPEHPK3PXP', type: 'totp', counter: 0 },
    { id: '2', name: 'Microsoft Account', code: '582671', issuer: 'Microsoft', secretKey: 'JBSWY3DPEHPK3PXQ', type: 'totp', counter: 0 },
    { id: '3', name: 'GitHub Account', code: '395814', issuer: 'GitHub', secretKey: 'JBSWY3DPEHPK3PXR', type: 'totp', counter: 0 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountIssuer, setNewAccountIssuer] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newAccountType, setNewAccountType] = useState('totp');
  const [isEditing, setIsEditing] = useState(false);

  const { timeLeft, progressAnim } = useOTPTimer(accounts, setAccounts);

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