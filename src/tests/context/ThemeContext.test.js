import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../../styles/themes';

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('should provide light theme by default', async () => {
    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useTheme(), { wrapper });
    
    await waitForNextUpdate();
    
    expect(result.current.theme).toEqual(lightTheme);
    expect(result.current.isDarkMode).toBe(false);
  });

  it('should toggle theme when toggleTheme is called', async () => {
    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useTheme(), { wrapper });
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toEqual(darkTheme);
    expect(result.current.isDarkMode).toBe(true);
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toEqual(lightTheme);
    expect(result.current.isDarkMode).toBe(false);
  });

  it('should load theme preference from storage', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(true));
    
    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useTheme(), { wrapper });
    
    await waitForNextUpdate();
    
    expect(result.current.theme).toEqual(darkTheme);
    expect(result.current.isDarkMode).toBe(true);
  });

  it('should save theme preference to storage when changed', async () => {
    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useTheme(), { wrapper });
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@authenticator_theme', JSON.stringify(true));
  });
}); 