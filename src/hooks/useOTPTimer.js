import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import * as otpUtils from '../utils/otpUtils';

export default function useOTPTimer(accounts, updateAccount) {
  const [timeLeft, setTimeLeft] = useState(30);
  const progressAnim = useRef(new Animated.Value(1)).current;
  
  // Store the accounts in a ref to avoid dependency issues
  const accountsRef = useRef(accounts);
  useEffect(() => {
    accountsRef.current = accounts;
  }, [accounts]);

  useEffect(() => {
    // Start the progress animation
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 30000,
      useNativeDriver: false,
    }).start();
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          console.log(prevTime);
          // Regenerate TOTP codes when timer expires
          const currentAccounts = accountsRef.current;
          
          currentAccounts.forEach(account => {

          
            if (account.type === 'totp') {
              const newCode = otpUtils.generateTOTPCode(account.secretKey);
              updateAccount(account.id, { code: newCode });
            }
          });

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
  }, []); // Empty dependency array to run only on mount

  return { timeLeft, progressAnim };
} 