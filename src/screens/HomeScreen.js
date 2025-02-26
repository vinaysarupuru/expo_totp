import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AccountCard from '../components/AccountCard';
import EmptyState from '../components/EmptyState';
import AddAccountModal from '../components/AddAccountModal';
import HeaderBar from '../components/HeaderBar';
import useOTPTimer from '../hooks/useOTPTimer';
import useAccounts from '../hooks/useAccounts';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountIssuer, setNewAccountIssuer] = useState('');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newAccountType, setNewAccountType] = useState('totp');
  const [isEditing, setIsEditing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const {
    accounts,
    filteredAccounts,
    searchQuery,
    setSearchQuery,
    addAccount,
    deleteAccount,
    updateAccount
  } = useAccounts();

  const { timeLeft, progressAnim } = useOTPTimer(accounts, updateAccount);

  // Toggle search mode
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchQuery('');
    }
  };

  // Handle adding a new account
  const handleAddAccount = () => {
    if (addAccount(newAccountName, newAccountIssuer, newSecretKey, newAccountType)) {
      setNewAccountName('');
      setNewAccountIssuer('');
      setNewSecretKey('');
      setNewAccountType("totp");
      setShowAddModal(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.statusBar} />

      <HeaderBar
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        timeLeft={timeLeft}
        progressAnim={progressAnim}
        isSearching={isSearching}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleSearch={toggleSearch}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
      />

      <ScrollView style={styles.scrollView}>
        {filteredAccounts.length === 0 ? (
          searchQuery ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={64} color={theme.colors.text.muted} />
              <Text style={[styles.emptyStateText, { color: theme.colors.text.secondary }]}>
                No matching accounts
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.colors.text.muted }]}>
                Try a different search term
              </Text>
            </View>
          ) : (
            <EmptyState />
          )
        ) : (
          filteredAccounts.map((account, index) => (
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
          colors={[theme.colors.primary, theme.colors.secondary]} 
          style={styles.addButtonGradient}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <AddAccountModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAccount}
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 15,
    marginTop: 8,
    textAlign: 'center',
  },
}); 