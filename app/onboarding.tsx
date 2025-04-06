import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Dimensions, 
  TouchableOpacity, 
  Animated, 
  Text,
  SafeAreaView
} from 'react-native';
import useOnboarding from '@/hooks/useOnboarding';
import { useRouter } from 'expo-router';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS } from './config/superwall';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ImagePlaceholderScreen = () => {
  const { showPaywall } = useSuperwall() 
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  
  const { isOnboarded, completeOnboarding } = useOnboarding();
  const router = useRouter();
  
  const imageAnim = useRef(new Animated.Value(0)).current;
  const welcomeTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateImage();
  }, []);

  const handleContinue = async () => {
    await completeOnboarding();
    
    try {
      router.push('/');
      const paywallResult = await showPaywall(SUPERWALL_TRIGGERS.ONBOARDING);
    } catch (error) {
      console.error('Error showing paywall:', error);
     // Navigate anyway as fallback
      router.push('/');
    }
  };

  const animateImage = () => {
    Animated.sequence([
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      Animated.timing(welcomeTextOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 300,
      })
    ]).start(() => {
      setShowWelcomeText(true);
    });
  };

  const imageOpacity = imageAnim;
  const imageScale = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }]
            }
          ]}
        >
          <Image 
            source={{ uri: 'https://res.cloudinary.com/dzvttwdye/image/upload/v1743914510/mugnuifqcfrmmjmy9xti.png' }}
            style={styles.fullImage}
            resizeMode="cover"
          />
        </Animated.View>
        
        <Animated.View style={[
          styles.welcomeTextContainer,
          { opacity: welcomeTextOpacity }
        ]}>
          <View style={styles.bottomContent}>
            <Text style={styles.welcomeText}>Welcome to GoToon</Text>
            <Text style={styles.welcomeSubtext}>Ready to turn yourself into animated character?</Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  welcomeTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', // Changed from rgba black to transparent
    justifyContent: 'flex-end', // Position content at bottom
    alignItems: 'center',
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 50, // Add padding at the bottom
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
  continueButton: {
    backgroundColor: '#ffffff',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20, // Add margin at the bottom of the button
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ImagePlaceholderScreen;