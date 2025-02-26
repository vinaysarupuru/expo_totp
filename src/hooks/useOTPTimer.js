import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { generateTOTPCode } from '../utils/otpUtils';

export default function useOTPTimer(accounts, setAccounts) {
  const [timeLeft, setTimeLeft] = useState(30);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // Regenerate TOTP codes and reset timer
          setAccounts((prevAccounts) =>
            prevAccounts.map((acc) =>
              acc.type === 'totp' ? { ...acc, code: generateTOTPCode(acc.secretKey) } : acc
            )
          );

          // Reset progress bar animation
          progressAnim.setValue(1);
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 30000,
            useNativeDriver: false,
          }).start();

          return 30;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [progressAnim, setAccounts]);

  return { timeLeft, progressAnim };
} 