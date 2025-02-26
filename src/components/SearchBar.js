import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SearchBar({ searchQuery, setSearchQuery, onClose }) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.searchContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search accounts..."
        placeholderTextColor="rgba(255,255,255,0.7)"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus
        returnKeyType="search"
        selectionColor="white"
        outlineColor="transparent"
        underlineColorAndroid="transparent"
      />
      <TouchableOpacity 
        onPress={onClose} 
        style={styles.searchButton}
        testID="search-close-button"
      >
        <MaterialIcons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'white',
    fontSize: 16,
    outlineStyle: 'none', // Remove outline for web
  },
  searchButton: {
    padding: 8,
  },
}); 