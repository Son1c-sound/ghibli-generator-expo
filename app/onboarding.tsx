import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  Text
} from 'react-native';
import { useRouter } from 'expo-router';
import useOnboarding from '@/hooks/useOnboarding';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS } from './config/superwall';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SimplifiedComponent = () => {
  const [step, setStep] = useState(1);
  const { showPaywall } = useSuperwall();
  const { isOnboarded, completeOnboarding } = useOnboarding();
  const router = useRouter();
  
  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    
    // Final continue button - complete onboarding and route to home
    await completeOnboarding();
    
    try {
      isOnboarded == true;
      router.push('/');
      const paywallResult = await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
    } catch (error) {
      console.error('Error showing paywall:', error);
      // Navigate anyway as fallback
      router.push('/');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome to GoToon</Text>
          <Text style={styles.welcomeSubtext}>Ready to turn yourself into animated character?</Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://res.cloudinary.com/dzvttwdye/image/upload/v1743295994/anime_yfap6y.png' }}
            style={styles.placeholderImage}
            resizeMode="cover"
          />
          
          {step === 2 && (
            <>
              <View style={styles.additionalImageContainer}>
                <Image 
                  source={{ uri: '' }}
                  style={styles.additionalImage}
                  resizeMode="cover"
                />
              </View>
            </>
          )}
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {step === 1 ? 'Continue' : 'Get Started'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtext: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  imageContainer: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    marginBottom: 10,
  },
  additionalImageContainer: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  additionalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SimplifiedComponent;