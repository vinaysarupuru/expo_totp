# Expo Authenticator App

A React Native application built with Expo for generating TOTP and HOTP authentication codes.

## Setup Instructions

### Dependencies

Install the required dependencies for web support:
# for web install these
npx expo install react-dom react-native-web @expo/metro-runtime

# for local storage
npm install @react-native-async-storage/async-storage

### Getting Started

1. Clone the repository
2. Install dependencies with `npm install` or `yarn`
3. Start the development server with `npx expo start`

## Available Scripts

- `npx expo start` - Start the development server
- `npx expo start --web` - Start the development server for web
- `npx expo start --android` - Start the development server for Android
- `npx expo start --ios` - Start the development server for iOS

## Project Structure

The project is organized into a modular structure for better maintainability:

- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions for OTP generation
- `src/screens/` - Main application screens
- `src/styles/` - Styling constants and themes

If you prefer a simpler approach, you can use the `test.js` file which contains all the functionality in a single file.

## Features

- Generate time-based (TOTP) and counter-based (HOTP) authentication codes
- Add, view, and delete accounts
- Visual timer for TOTP code expiration
- Shake animation when viewing codes
- Local storage of accounts (persists between app restarts)

## Contributing

Guidelines for contributing to this project.