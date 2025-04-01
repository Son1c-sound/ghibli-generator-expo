import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Linking,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


export default function Settings() {
  // Example subscription data
  const subscriptionTier = "Premium";
  const expiryDate = "April 30, 2025";
  
  const navigateBack = () => {
     router.replace("/");
  };
  
  const handleTerms = () => {
    router.push("https://www.korelabstech.com/terms");
  };
  
  const handlePrivacyPolicy = () => {
    router.push("https://www.korelabstech.com/privacy");
  };
  
  const handleSupport = () => {
    Linking.openURL('https://x.com/soniconx');
  };
  
  const handleContactDeveloper = () => {
    Linking.openURL('https://x.com/soniconx');
  };
  
  const openTwitter = () => {
    Linking.openURL('https://x.com/soniconx');
  };
  
  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/pixar.ai?utm_source=qr');
  };

  return (
    <ScrollView style={styles.container}> 
    <SafeAreaView >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.spacer} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.optionCard} onPress={handleContactDeveloper}>
            <Ionicons name="code-slash-outline" size={22} color="#3B82F6" />
            <Text style={styles.optionText}>Contact Developer</Text>
          </TouchableOpacity>
        </View>
        
        {/* Social Media */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={openTwitter}>
              <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={openInstagram}>
              <Ionicons name="logo-instagram" size={28} color="#C13584" />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity style={styles.optionCard} onPress={handleTerms}>
            <Ionicons name="document-text-outline" size={22} color="#3B82F6" />
            <Text style={styles.optionText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionCard} onPress={handlePrivacyPolicy}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#3B82F6" />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.version}>Version 1.0.0</Text>
    </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  spacer: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subscriptionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subscriptionDetails: {
    marginBottom: 16,
  },
  subscriptionTier: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    color: '#999',
    fontSize: 14,
  },
  subscriptionAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  manageText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  socialButton: {
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: 16,
    borderRadius: 12,
    width: '45%',
  },
  socialText: {
    color: 'white',
    marginTop: 8,
  },
  version: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
});