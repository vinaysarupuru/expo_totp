import { NativeModules } from 'react-native';
import 'react-native-gesture-handler/jestSetup';

// Mock the AsyncStorage module
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock the Clipboard module
jest.mock('react-native/Libraries/Components/Clipboard/Clipboard', () => ({
  setString: jest.fn(),
}));

// Mock Animated
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Expo LinearGradient
jest.mock('expo-linear-gradient', () => 'LinearGradient');

// Mock MaterialIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// Mock Platform
NativeModules.PlatformConstants = {
  OS: 'ios',
}; 