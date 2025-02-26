import { StyleSheet } from 'react-native';
import colors from './colors';

export const commonStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 15,
      paddingTop: 15,
    },
    addButton: {
      position: 'absolute',
      bottom: 25,
      right: 25,
      borderRadius: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 6,
    },
    addButtonGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomSpacer: {
      height: 80,
    },
  }); 