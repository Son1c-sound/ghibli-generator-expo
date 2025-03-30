import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';

export default function Profile() {
  const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  
  if (!authLoaded || !userLoaded || !isSignedIn) {
    return <SafeAreaView style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </SafeAreaView>;
  }
  
  const handleSignOut = async () => {
    try {
      await signOut();
     
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Add your delete account logic here
            Alert.alert('Account Deletion', 'Your account deletion request has been submitted.');
          },
        },
      ]
    );
  };
  
  const navigateBack = () => {
    router.back();
  };
  
  const handleTerms = () => {
    // Navigate to terms page or open web link
    Alert.alert('Terms of Service', 'Navigate to Terms of Service page');
  };
  
  const handlePrivacyPolicy = () => {
    // Navigate to privacy policy page or open web link
    Alert.alert('Privacy Policy', 'Navigate to Privacy Policy page');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3B82F6" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.spacer} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.userInfoContainer}>
        <Image  src='https://i.ibb.co/s9cW0DVP/Screenshot-2025-03-29-181136.png'    />
          <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color="#3B82F6" />
            <Text style={styles.optionText}>Sign Out</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionCard} onPress={handleTerms}>
            <Ionicons name="document-text-outline" size={22} color="#3B82F6" />
            <Text style={styles.optionText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionCard} onPress={handlePrivacyPolicy}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#3B82F6" />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteAccountButton} 
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.version}>Version 1.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
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
    width: 34, // match the width of the back button for balanced layout
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userEmail: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 40,
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
  deleteAccountButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteAccountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  version: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
});