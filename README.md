# Expo Authenticator App

A React Native application built with Expo for generating TOTP (Time-based One-Time Password) and HOTP (HMAC-based One-Time Password) authentication codes. This app provides a secure and convenient way to manage your two-factor authentication needs.

## Setup Instructions

### Dependencies

Install the required dependencies for web support:
# for web install these
npx expo install react-dom react-native-web @expo/metro-runtime

# for local storage
npm install @react-native-async-storage/async-storage

### Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npx expo start`
4. Scan the QR code with the Expo Go app on your mobile device or press 'w' to open in web browser

## Available Scripts

- `npx expo start` - Start the development server
- `npx expo start --web` - Start the development server for web
- `npx expo start --android` - Start the development server for Android
- `npx expo start --ios` - Start the development server for iOS

## Project Structure

The project is organized into a modular structure for better maintainability:

- `src/components/` - Reusable UI components
  - `AccountCard.js` - Individual account display with copy and delete functionality
  - `AddAccountModal.js` - Modal for adding new accounts
  - `HeaderBar.js` - App header with search and theme toggle
  - `ProgressBar.js` - Visual timer for TOTP codes
  - `SearchBar.js` - Search input for filtering accounts
- `src/hooks/` - Custom React hooks
  - `useAccounts.js` - Account management logic
  - `useOTPTimer.js` - Timer logic for TOTP codes
- `src/utils/` - Utility functions for OTP generation
- `src/screens/` - Main application screens
- `src/styles/` - Styling constants and themes
- `src/context/` - React context providers
  - `ThemeContext.js` - Theme management

If you prefer a simpler approach, you can use the `test.js` file which contains all the functionality in a single file.

## How to Use

### Adding an Account

1. Tap the "+" button in the bottom right corner
2. Enter the service provider name (e.g., Google, Microsoft)
3. Enter your account name or email
4. Enter the secret key provided by the service
5. Select the authentication type (TOTP or HOTP)
6. Tap "Add" to save the account

### Viewing Codes

- TOTP codes will automatically refresh every 30 seconds
- HOTP codes will update when you tap on the account card
- Tap the copy icon next to a code to copy it to your clipboard

### Managing Accounts

- Tap "Edit" in the header to enter edit mode
- Tap the delete icon on an account to remove it
- Use the search icon to find specific accounts

### Changing Themes

- Tap the theme icon in the header to toggle between light and dark mode

## Security Considerations

- Secret keys are stored locally on your device
- No data is transmitted to external servers
- Consider using device encryption for additional security

## Contributing

Guidelines for contributing to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.