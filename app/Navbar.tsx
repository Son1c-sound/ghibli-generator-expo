import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const Header = ({ title = 'Featured Styles', onSettingsPress }: {onSettingsPress:any, title:any} ) => {
  const name = 'GoToon';
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>{name}</Text>
          </View>
          
          <View style={styles.rightContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={() => {router.push('/profile')}}>
              <Ionicons name="settings-outline" size={22} color="#f5f5f5" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.featureContainer}>
          <Text style={styles.featureText}>{title}</Text>
          <View style={styles.featureUnderline} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'ios' ? 45 : 35,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logo: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureContainer: {
    marginTop: 4,
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  featureUnderline: {
    width: 40,
    height: 3,
    backgroundColor: '#rgba(147, 112, 219, 0.8)',
    borderRadius: 2,
  },
});

export default Header;