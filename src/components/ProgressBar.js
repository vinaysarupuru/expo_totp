import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import colors from '../styles/colors';

export default function ProgressBar({ timeLeft, progressAnim }) {
  return (
    <View style={styles.timerContainer}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: progressAnim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [colors.danger, colors.warning, colors.success],
            }),
          },
        ]}
      />
      <Text style={styles.timerText}>{timeLeft}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  timerText: {
    color: 'white',
    fontSize: 12,
    position: 'absolute',
    right: 0,
    top: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
}); 