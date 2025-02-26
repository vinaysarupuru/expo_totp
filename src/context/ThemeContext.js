import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../styles/themes';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = '@authenticator_theme';

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme !== null) {
          const isDark = JSON.parse(storedTheme);
          setIsDarkMode(isDark);
          setTheme(isDark ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save theme preference to storage
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(isDarkMode));
      } catch (error) {
        console.error('Failed to save theme preference', error);
      }
    };

    if (!isLoading) {
      saveTheme();
    }
  }, [isDarkMode, isLoading]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(!isDarkMode ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 