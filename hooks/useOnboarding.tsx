import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const useOnboarding = (storageKey = '@onboarding_completed') => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(storageKey);
        setIsOnboarded(value === 'true');
      } catch (error) {
        console.error('Error loading onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingStatus();
  }, [storageKey]);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(storageKey, 'true');
      setIsOnboarded(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return { isOnboarded, isLoading, completeOnboarding };
};

export default useOnboarding;