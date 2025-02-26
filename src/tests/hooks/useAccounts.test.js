import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAccounts from '../../hooks/useAccounts';
import * as otpUtils from '../../utils/otpUtils';

// Mock the OTP utils
jest.mock('../../utils/otpUtils', () => ({
  generateTOTPCode: jest.fn(() => '123456'),
  generateHOTPCode: jest.fn(() => '654321'),
}));

describe('useAccounts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('should initialize with empty accounts', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAccounts());
    
    await waitForNextUpdate();
    
    expect(result.current.accounts).toEqual([]);
    expect(result.current.filteredAccounts).toEqual([]);
  });

  it('should add a new account', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAccounts());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.addAccount('test@example.com', 'Google', 'SECRETKEY', 'totp');
    });
    
    expect(result.current.accounts.length).toBe(1);
    expect(result.current.accounts[0].name).toBe('test@example.com');
    expect(result.current.accounts[0].issuer).toBe('Google');
    expect(result.current.accounts[0].secretKey).toBe('SECRETKEY');
    expect(result.current.accounts[0].type).toBe('totp');
    expect(result.current.accounts[0].code).toBe('123456');
  });

  it('should delete an account', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAccounts());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.addAccount('test@example.com', 'Google', 'SECRETKEY', 'totp');
    });
    
    const accountId = result.current.accounts[0].id;
    
    act(() => {
      result.current.deleteAccount(accountId);
    });
    
    expect(result.current.accounts.length).toBe(0);
  });

  it('should update an account', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAccounts());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.addAccount('test@example.com', 'Google', 'SECRETKEY', 'totp');
    });
    
    const accountId = result.current.accounts[0].id;
    
    act(() => {
      result.current.updateAccount(accountId, { code: '999999' });
    });
    
    expect(result.current.accounts[0].code).toBe('999999');
  });

  it('should filter accounts based on search query', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAccounts());
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.addAccount('test@example.com', 'Google', 'SECRETKEY', 'totp');
      result.current.addAccount('other@example.com', 'Microsoft', 'SECRETKEY2', 'hotp');
    });
    
    act(() => {
      result.current.setSearchQuery('Google');
    });
    
    expect(result.current.filteredAccounts.length).toBe(1);
    expect(result.current.filteredAccounts[0].issuer).toBe('Google');
    
    act(() => {
      result.current.setSearchQuery('other');
    });
    
    expect(result.current.filteredAccounts.length).toBe(1);
    expect(result.current.filteredAccounts[0].name).toBe('other@example.com');
  });
}); 