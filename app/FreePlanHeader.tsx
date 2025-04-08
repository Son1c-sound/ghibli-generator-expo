import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSuperwall } from '@/hooks/useSuperwall';
import { SUPERWALL_TRIGGERS } from './config/superwall';
  
const SubscriptionBanner = () => {
  const { isSubscribed, showPaywall } = useSuperwall();
    
  if (isSubscribed) {
    return null;
  }
    
  return (
    <SafeAreaView>
      <ImageBackground
        source={require('@/assets/premium-bg.jpeg')}
        style={styles.imageBg}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.contentRow}>
            <View style={styles.textContainer}>
              <Text style={styles.headingText}>Try GoToon Plus</Text>
              <Text style={styles.message}>
                Get Plus and unlock premium features
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK)} 
            style={styles.upgradeButton}
          >
            <Text style={styles.upgradeButtonText}>GET PLUS</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageBg: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 25,
  },
  backgroundImage: {
    borderRadius: 25,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,

  },
  headingText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: '#CCCCCC',
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  upgradeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default SubscriptionBanner;