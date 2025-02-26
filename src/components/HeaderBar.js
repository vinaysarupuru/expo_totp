import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressBar from './ProgressBar';
import SearchBar from './SearchBar';
import { useTheme } from '../context/ThemeContext';

export default function HeaderBar({ 
  isEditing, 
  setIsEditing, 
  timeLeft, 
  progressAnim,
  isSearching,
  searchQuery,
  setSearchQuery,
  toggleSearch,
  toggleTheme,
  isDarkMode
}) {
  const { theme } = useTheme();
  
  return (
    <LinearGradient 
      colors={[theme.colors.primary, theme.colors.secondary]} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }} 
      style={styles.header}
    >
      {isSearching ? (
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onClose={toggleSearch} 
        />
      ) : (
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Authenticator</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={toggleTheme}>
              <MaterialIcons 
                name={isDarkMode ? "light-mode" : "dark-mode"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={toggleSearch}>
              <MaterialIcons name="search" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ProgressBar timeLeft={timeLeft} progressAnim={progressAnim} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
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
}); 