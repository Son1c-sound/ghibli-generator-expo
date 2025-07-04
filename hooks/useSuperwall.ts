import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SubscriptionStatus } from '@superwall/react-native-superwall';
import { superwallService } from '@/app/services/superwall';

export function useSuperwall() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsLoading(false);
      return;
    }

    superwallService.initialize();
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const status = await superwallService.getSubscriptionStatus();
      console.log('Subscription status:', status);
      console.log('SubscriptionStatus enum:', SubscriptionStatus);
      
      if (typeof status === 'string') {
        setIsSubscribed(status === 'active');
      } else if (typeof status === 'object' && status !== null) {
        setIsSubscribed(
          status.status.toLowerCase() === 'active' || 
          Object.hasOwnProperty.call(status, 'active')
        );
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('[Superwall] Hook subscription check failed:', error);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };

  const showPaywall = async (triggerId: string) => {
    if (isLoading || Platform.OS === 'web') return;
    
    try {
      await superwallService.presentPaywall(triggerId);
      await checkSubscription();
    } catch (error) {
      console.error('[Superwall] Hook failed to show paywall:', error);
    }
  };

  return {
    isSubscribed,
    isLoading,
    showPaywall,
    checkSubscription,
  };
}