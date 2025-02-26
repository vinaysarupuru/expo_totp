import { renderHook, act } from '@testing-library/react-hooks';
import { Animated } from 'react-native';
import useOTPTimer from '../../hooks/useOTPTimer';
import * as otpUtils from '../../utils/otpUtils';

// Mock the OTP utils
jest.mock('../../utils/otpUtils', () => ({
  generateTOTPCode: jest.fn(() => '123456'),
}));

// Mock timers
jest.useFakeTimers();

describe('useOTPTimer Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with 30 seconds', () => {
    const updateAccount = jest.fn();
    const accounts = [
      { id: '1', type: 'totp', secretKey: 'SECRET1' },
      { id: '2', type: 'hotp', secretKey: 'SECRET2' },
    ];
    
    const { result } = renderHook(() => useOTPTimer(accounts, updateAccount));
    
    expect(result.current.timeLeft).toBe(30);
  });

  it('should count down every second', () => {
    const updateAccount = jest.fn();
    const accounts = [
      { id: '1', type: 'totp', secretKey: 'SECRET1' },
    ];
    
    const { result } = renderHook(() => useOTPTimer(accounts, updateAccount));
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeLeft).toBe(29);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(result.current.timeLeft).toBe(24);
  });

  it('should regenerate TOTP codes when timer expires', () => {
    const updateAccount = jest.fn();
    const accounts = [
      { id: '1', type: 'totp', secretKey: 'SECRET1' },
      { id: '2', type: 'hotp', secretKey: 'SECRET2' },
    ];
    
    renderHook(() => useOTPTimer(accounts, updateAccount));
    
    act(() => {
      jest.advanceTimersByTime(30000);
    });
    
    expect(otpUtils.generateTOTPCode).toHaveBeenCalledWith('SECRET1');
    expect(updateAccount).toHaveBeenCalledWith('1', { code: '123456' });
    expect(updateAccount).not.toHaveBeenCalledWith('2', expect.anything());
  });
}); 