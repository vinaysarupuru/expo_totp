// Mock React Native before importing anything else
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock the problematic modules
  RN.NativeModules.SettingsManager = {
    settings: {
      AppleLocale: 'en_US',
      AppleLanguages: ['en'],
    }
  };
  
  // Mock Animated
  RN.Animated = {
    ...RN.Animated,
    timing: jest.fn(() => ({
      start: jest.fn(cb => cb && cb()),
    })),
    sequence: jest.fn(() => ({
      start: jest.fn(cb => cb && cb()),
    })),
    Value: jest.fn(() => ({
      interpolate: jest.fn(() => ({})),
      setValue: jest.fn(),
    })),
  };
  
  // Mock Settings
  RN.Settings = {
    get: jest.fn(),
    set: jest.fn(),
    watchKeys: jest.fn(),
    clearWatch: jest.fn(),
  };
  
  return RN;
});

// Import after mocking
import { NativeModules } from 'react-native';

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
}), { virtual: true });

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

// Mock TurboModuleRegistry
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => {
  const turboModuleRegistry = jest.requireActual('react-native/Libraries/TurboModule/TurboModuleRegistry');
  return {
    ...turboModuleRegistry,
    getEnforcing: jest.fn((name) => {
      if (name === 'SettingsManager') {
        return {
          settings: {
            AppleLocale: 'en_US',
            AppleLanguages: ['en'],
          }
        };
      }
      return null;
    }),
  };
}, { virtual: true });

// Suppress React act() warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
}; 