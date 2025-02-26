import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../../components/SearchBar';
import { ThemeProvider } from '../../context/ThemeContext';

describe('SearchBar Component', () => {
  const mockSetSearchQuery = jest.fn();
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render with the provided search query', () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <SearchBar 
          searchQuery="test query" 
          setSearchQuery={mockSetSearchQuery} 
          onClose={mockOnClose} 
        />
      </ThemeProvider>
    );
    
    const input = getByPlaceholderText('Search accounts...');
    expect(input.props.value).toBe('test query');
  });
  
  it('should call setSearchQuery when text changes', () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <SearchBar 
          searchQuery="" 
          setSearchQuery={mockSetSearchQuery} 
          onClose={mockOnClose} 
        />
      </ThemeProvider>
    );
    
    const input = getByPlaceholderText('Search accounts...');
    fireEvent.changeText(input, 'new search');
    
    expect(mockSetSearchQuery).toHaveBeenCalledWith('new search');
  });
  
  it('should call onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <SearchBar 
          searchQuery="" 
          setSearchQuery={mockSetSearchQuery} 
          onClose={mockOnClose} 
        />
      </ThemeProvider>
    );
    
    // Add testID to the close button in SearchBar.js
    fireEvent.press(getByTestId('search-close-button'));
    
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 