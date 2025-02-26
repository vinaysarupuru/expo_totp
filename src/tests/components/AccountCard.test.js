import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccountCard from '../../components/AccountCard';
import { ThemeProvider } from '../../context/ThemeContext';
import { formatCode } from '../../utils/otpUtils';

// Mock the formatCode function
jest.mock('../../utils/otpUtils', () => ({
  formatCode: jest.fn(code => code),
  generateHOTPCode: jest.fn(() => '654321'),
}));

describe('AccountCard Component', () => {
  const mockAccount = {
    id: '1',
    name: 'test@example.com',
    issuer: 'Google',
    secretKey: 'SECRETKEY',
    type: 'totp',
    code: '123456',
  };
  
  const mockDeleteAccount = jest.fn();
  const mockUpdateAccount = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render account information correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <AccountCard 
          account={mockAccount} 
          isEditing={false} 
          deleteAccount={mockDeleteAccount} 
          updateAccount={mockUpdateAccount} 
          index={0} 
        />
      </ThemeProvider>
    );
    
    expect(getByText('Google')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByText('TIME BASED')).toBeTruthy();
    expect(formatCode).toHaveBeenCalledWith('123456');
  });
  
  it('should show delete button when in editing mode', () => {
    const { getByLabelText } = render(
      <ThemeProvider>
        <AccountCard 
          account={mockAccount} 
          isEditing={true} 
          deleteAccount={mockDeleteAccount} 
          updateAccount={mockUpdateAccount} 
          index={0} 
        />
      </ThemeProvider>
    );
    
    expect(getByLabelText('Delete test@example.com')).toBeTruthy();
  });
  
  it('should not show delete button when not in editing mode', () => {
    const { queryByLabelText } = render(
      <ThemeProvider>
        <AccountCard 
          account={mockAccount} 
          isEditing={false} 
          deleteAccount={mockDeleteAccount} 
          updateAccount={mockUpdateAccount} 
          index={0} 
        />
      </ThemeProvider>
    );
    
    expect(queryByLabelText('Delete test@example.com')).toBeNull();
  });
  
  it('should update HOTP code when pressed', () => {
    const hotpAccount = {
      ...mockAccount,
      type: 'hotp',
      counter: 0,
    };
    
    const { getByText } = render(
      <ThemeProvider>
        <AccountCard 
          account={hotpAccount} 
          isEditing={false} 
          deleteAccount={mockDeleteAccount} 
          updateAccount={mockUpdateAccount} 
          index={0} 
        />
      </ThemeProvider>
    );
    
    fireEvent.press(getByText('COUNTER BASED').parent.parent);
    
    expect(mockUpdateAccount).toHaveBeenCalledWith('1', {
      counter: 1,
      code: '654321',
    });
  });
}); 