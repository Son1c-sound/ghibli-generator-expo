import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Linking,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import SubscriptionBanner from './FreePlanHeader';

const { width } = Dimensions.get('window');
const ACCENT_COLOR = "#f5f5f5";

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

  return (
    <LinearGradient
      colors={['#000000', '#000000', '#000000']}
      locations={[0, 0.35, 0.7]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.spacer} />
        </View>
        
        <ScrollView style={styles.scrollContainer}>
        <SubscriptionBanner />
          <View style={styles.content}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Help & Support</Text>
              <TouchableOpacity style={[styles.optionCard, styles.rowCard]} onPress={handleContactDeveloper}>
                <Ionicons name="code-slash-outline" size={22} color={ACCENT_COLOR} />
                <Text style={styles.optionText}>Contact Developer</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.optionCard, styles.rowCard]} onPress={handleSupport}>
                <Ionicons name="help-circle-outline" size={22} color={ACCENT_COLOR} />
                <Text style={styles.optionText}>Support</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Connect With Us</Text>
              
              <TouchableOpacity style={[styles.optionCard, styles.rowCard]} onPress={openTwitter}>
                <Ionicons name="logo-twitter" size={22} color={ACCENT_COLOR} />
                <Text style={styles.optionText}>Twitter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.optionCard, styles.rowCard]} onPress={openInstagram}>
                <Ionicons name="logo-instagram" size={22} color={ACCENT_COLOR} />
                <Text style={styles.optionText}>Instagram</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Legal</Text>
              
              <TouchableOpacity style={[styles.optionCard, styles.rowCard]} onPress={handleTerms}>
                <Ionicons name="document-text-outline" size={22} color={ACCENT_COLOR} />
                <Text style={styles.optionText}>Terms of Service</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.optionCard, styles.rowCard]} onPress={handlePrivacyPolicy}>
                <Ionicons name="shield-checkmark-outline" size={22} color={ACCENT_COLOR} />
                <Text style={styles.optionText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.version}>Version 2.0.0</Text>
        </ScrollView>
        <View style={styles.bottomNavContainer}>
          <SafeAreaView>
            <View style={styles.bottomNavBar}>
              <TouchableOpacity 
                style={styles.bottomNavButton}
                onPress={() => router.push("/")}
              >
                <Ionicons name="grid-outline" size={24} color="white" />
                <Text style={styles.bottomNavText}>Styles</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bottomNavButton}
                onPress={() => router.push("/chat")}
              >
                <Ionicons name="chatbubble-outline" size={24} color="white" />
                <Text style={styles.bottomNavText}>Text to Image</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.bottomNavButton}
              >
                <Ionicons name="settings-outline" size={24} color={ACCENT_COLOR} />
                <Text style={[styles.bottomNavText, styles.activeNavText]}>Settings</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 40,
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
    padding: 4,
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 0.3,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  version: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 80,
    marginTop: 20,
  },
  
  contactInput: {
    flex: 1,
    color: 'white',
    minHeight: 80,
    textAlignVertical: 'top',
    padding: 8,
  },
  sendButton: {
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  sendButtonText: {
    color: 'black',
    fontWeight: '600',
  },
  patchNotesTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  patchNotesText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 8,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    borderTopWidth: 0.3,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 10 : 10,
  },
  bottomNavButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  bottomNavText: {
    color: "white",
    marginTop: 4,
    fontSize: 12,
  },
  activeNavText: {
    color: ACCENT_COLOR,
  },
});