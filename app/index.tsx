import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@clerk/clerk-expo';
import { Link, Redirect, router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import useOnboarding from '@/hooks/useOnboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AnimeConverter() {
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { isOnboarded, isLoading } = useOnboarding();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isOnboarded) {
      router.replace('/onboarding');
    }
  }, [isOnboarded, isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView style={[screenStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload photos.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setResultImage(null);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Something went wrong while selecting your image');
    }
  };
  
  const generateImage = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }
    
    if (!selectedStyle) {
      Alert.alert('No Style', 'Please select a style first');
      return;
    }
    
    try {
      setLoading(true);
      
      const imageBase64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      const selectedStyleObj = styles.find(style => style.id === selectedStyle);
      const apiStyle = selectedStyleObj ? selectedStyleObj.name : 'anime';
      
      const requestData = {
        imageBase64: imageBase64,
        style: apiStyle
      };
      
      const response = await fetch('https://ghibil-studio-server.vercel.app/api/generate-image', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.imageBase64) {
        setResultImage(`data:image/jpeg;base64,${data.imageBase64}`);
      } else {
        throw new Error('No image received from server');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate the styled image';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const placeholderUrl = 'https://via.placeholder.com/60';
  
  const navigateToProfile = () => {
    router.push('/profile');
  };

  const resetOnboardingTest = async () => {
    await AsyncStorage.removeItem('@onboarding_completed');
    router.replace('/onboarding');
  };

  const styles = [
    { id: 1, name: 'anime', src: placeholderUrl },
    { id: 2, name: 'ghibli', src: placeholderUrl },
    { id: 3, name: 'realistic', src: placeholderUrl },
    { id: 4, name: 'painting', src: placeholderUrl },
    { id: 5, name: 'minimalist', src: placeholderUrl },
    { id: 6, name: 'pixelart', src: placeholderUrl },
    { id: 7, name: 'cartoon', src: placeholderUrl },
    { id: 8, name: 'anime', src: placeholderUrl },
    { id: 9, name: 'threeD', src: placeholderUrl },
  ];

  return (
    <SafeAreaView style={screenStyles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={screenStyles.header}>
        <View style={screenStyles.titleContainer}>
          <Text style={screenStyles.titleIcon}>✨</Text>
          <Text style={screenStyles.title}>Turn Photo to Anime</Text>
        </View>

        <TouchableOpacity onPress={navigateToProfile} style={screenStyles.settingsButton}>
          <Ionicons name="settings" size={24} color="#3B82F6" />   
        </TouchableOpacity>
      </View>

      <View style={screenStyles.uploadContainer}>
        {resultImage ? (
          <View style={screenStyles.imagePreviewContainer}>
            <Image source={{ uri: resultImage }} style={screenStyles.resultImagePreview} />
            <TouchableOpacity 
              style={screenStyles.changeImageButton}
              onPress={() => setResultImage(null)}
            >
              <Text style={screenStyles.changeImageText}>Try another style</Text>
            </TouchableOpacity>
          </View>
        ) : image ? (
          <View style={screenStyles.imagePreviewContainer}>
            <Image source={{ uri: image }} style={screenStyles.imagePreview} />
            <TouchableOpacity 
              style={screenStyles.changeImageButton}
              onPress={handleImagePicker}
            >
              <Text style={screenStyles.changeImageText}>Change photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity 
              style={screenStyles.uploadButton}
              onPress={handleImagePicker}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="black" />
              <Text style={screenStyles.uploadText}>Upload your photo</Text>
            </TouchableOpacity>
            <Text style={screenStyles.dropText}>Or drop an image</Text>
          </>
        )}
      </View>

      <View style={screenStyles.testButtonContainer}>
        <TouchableOpacity 
          style={screenStyles.testButton}
          onPress={resetOnboardingTest}
        >
          <Text style={screenStyles.testButtonText}>Test Onboarding</Text>
        </TouchableOpacity>
      </View>
      
      <View style={screenStyles.styleSection}>
        <Text style={screenStyles.styleTitle}>Choose a Style:</Text>
        <View style={screenStyles.styleGrid}>
          {styles.map((style) => (
            <TouchableOpacity
              key={style.id}
              style={[
                screenStyles.styleItem,
                selectedStyle === style.id && screenStyles.selectedStyle
              ]}
              onPress={() => setSelectedStyle(style.id)}
            >
              <Image 
                style={screenStyles.styleImage} 
                source={{ uri: style.src }}
              />
              <Text style={screenStyles.styleName}>{style.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={generateImage}
        disabled={!image || loading || !!resultImage}
      >
        <LinearGradient
          colors={['#3B82F6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            screenStyles.generateButton,
            (!image || loading || !!resultImage) && screenStyles.disabledButton
          ]}
        >
          <View style={screenStyles.generateButtonContent}>
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="white" />
                <Text style={screenStyles.generateText}>Generate Image</Text>
              </>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      <Text style={screenStyles.version}>Version 1.0.0</Text>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    padding: 5,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: 200,
  },
  uploadButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dropText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  styleSection: {
    marginBottom: 24,
  },
  styleTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  styleItem: {
    width: '23%',
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedStyle: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    padding: 4,
  },
  styleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333',
    marginBottom: 4,
  },
  styleName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  generateButton: {
    borderRadius: 100,
    marginVertical: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  generateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  resultImagePreview: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  changeImageButton: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  changeImageText: {
    color: 'white',
    fontSize: 12,
  },
  version: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 8,
  },
  testButtonContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
  },
  testButtonText: {
    color: 'red',
    fontSize: 13,
    fontWeight: 'bold',
  },
});