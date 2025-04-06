import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Linking,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const ACCENT_COLOR = "#3B82F6";

export default function Settings() {
  
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
    Linking.openURL('https://www.instagram.com/pixar.ai?utm_source=qr');
  };
  
  const openTwitter = () => {
    Linking.openURL('https://x.com/soniconx');
  };
  
  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/pixar.ai?utm_source=qr');
  };

  const navigateToHome = () => {
    router.replace("/");
  };

  const handleCameraCapture = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}> 
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.spacer} />
        </View>
        
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Help & Support</Text>
              <TouchableOpacity style={styles.optionCard} onPress={handleContactDeveloper}>
                <Ionicons name="code-slash-outline" size={22} color="#3B82F6" />
                <Text style={styles.optionText}>Contact Developer</Text>
              </TouchableOpacity>
            </View>

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
        </ScrollView>
        
        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNavBar}>
          <TouchableOpacity 
            style={styles.bottomNavButton} 
            onPress={navigateToHome}
          >
            <Ionicons name="images-outline" size={24} color="white" />
            <Text style={styles.bottomNavText}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cameraButton} 
            onPress={handleCameraCapture}
          >
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera-outline" size={28} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.bottomNavButton, styles.activeNavButton]} 
            onPress={() => {}}
          >
            <Ionicons name="settings-outline" size={24} color={ACCENT_COLOR} />
            <Text style={[styles.bottomNavText, styles.activeNavText]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContainer: {
    flex: 1,
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
    padding: 16,
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
  
  // Bottom Navigation Bar Styles
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  bottomNavButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  activeNavButton: {
    opacity: 1,
  },
  bottomNavText: {
    color: "white",
    marginTop: 4,
    fontSize: 12,
  },
  activeNavText: {
    color: ACCENT_COLOR,
  },
  cameraButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ACCENT_COLOR,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});