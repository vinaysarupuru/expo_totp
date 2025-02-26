import colors from './colors';

export const lightTheme = {
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    inputBg: colors.inputBg,
    danger: colors.danger,
    warning: colors.warning,
    success: colors.success,
  },
  statusBar: 'dark-content',
};

export const darkTheme = {
  colors: {
    primary: '#1a73e8',
    secondary: '#34A853',
    background: '#121212',
    card: '#1e1e1e',
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
      light: '#FFFFFF',
      muted: '#888888',
    },
    border: '#333333',
    inputBg: '#2c2c2c',
    danger: '#FF5252',
    warning: '#FFC107',
    success: '#4CAF50',
  },
  statusBar: 'light-content',
}; 