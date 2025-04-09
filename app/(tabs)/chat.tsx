import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  Platform,
  Animated,
  Easing,
  ScrollView,
  Keyboard,
  Alert
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SubscriptionBanner from "../FreePlanHeader";
import Header from "../Navbar";
import { useSuperwall } from "@/hooks/useSuperwall";
import { SUPERWALL_TRIGGERS } from "../config/superwall";

const { width, height } = Dimensions.get("window");

const STYLE_MAP = {
  '1': 'none',
  '2': 'anime',
  '3': 'fantasy',
  '4': 'realistic'
};

const ART_STYLES = [
  {
    id: '1',
    name: 'No Style',
    image: { uri: 'https://media.tenor.com/0LtvGK3-jb0AAAAe/anime-no.png' }
  },
  {
    id: '2',
    name: 'Anime',
    image: { uri: 'https://res.cloudinary.com/dzvttwdye/image/upload/v1744133016/lgmoq2oekudo6yqqul5q.png' }
  },
  {
    id: '3',
    name: 'Fantasy',
    image: { uri: 'https://res.cloudinary.com/dzvttwdye/image/upload/v1744132958/hcslyrnxknu7d9wvlpmp.png' }
  },
  {
    id: '4',
    name: 'Realistic',
    image: { uri: 'https://res.cloudinary.com/dzvttwdye/image/upload/v1743295994/Screenshot_2025-03-29_190345_gk19da.png' }
  }
];

const API_URL = 'https://ghibil-studio-server-production.up.railway.app/api/text-to-image';

const FREE_GENERATION_LIMIT = 3;
const STORAGE_KEY = 'ghibliAI_generation_count';

export default function AIImageGenerator() {
  const [inputText, setInputText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStarted, setGenerationStarted] = useState(false);
  const [generatingImageIndex, setGeneratingImageIndex] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([null, null, null, null]);
  const [generatedImagesBase64, setGeneratedImagesBase64] = useState([null, null, null, null]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [generationCount, setGenerationCount] = useState(0);
  const { isSubscribed, showPaywall } = useSuperwall();
  
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadGenerationCount();
    
    if (isGenerating) {
      Animated.loop(
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
      
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ 
            y: 400, 
            animated: true 
          });
        }
      }, 300);
    } else {
      loadingAnim.setValue(0);
    }
  }, [isGenerating]);

  useEffect(() => {
    Animated.timing(inputAnim, {
      toValue: inputFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [inputFocused]);

  const loadGenerationCount = async () => {
    try {
      const count = await AsyncStorage.getItem(STORAGE_KEY);
      if (count !== null) {
        setGenerationCount(parseInt(count, 10));
      }
    } catch (error) {
      console.error('Error loading generation count:', error);
    }
  };

  const generateSingleImage = async (prompt:any, style:any, index:any) => {
    try {
      console.log(`Generating image ${index + 1}/4...`);
      setGeneratingImageIndex(index);
      
      const variationPrompt = index > 0 
        ? `Another unique variation of: ${prompt}` 
        : prompt;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userPrompt: variationPrompt,
          style: style,
          imageIndex: index + 1
        })
      });
      
      if (!response.ok) {
        let errorMessage = `Server returned status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.imageBase64) {
        throw new Error('No image data received');
      }
      
      console.log(`Successfully received image ${index + 1}`);
      
      setGeneratedImages(prev => {
        const updated:any = [...prev];
        updated[index ]  = `data:image/jpeg;base64,${data.imageBase64}`;
        return updated;
      });
      
      setGeneratedImagesBase64(prev => {
        const updated = [...prev];
        updated[index] = data.imageBase64;
        return updated;
      });
      
      setCurrentImageIndex(prev => Math.max(prev, index + 1));
      setGeneratingImageIndex(null);
      
      return true;
    } catch (error) {
      console.error(`Error generating image ${index + 1}:`, error);
      setGeneratingImageIndex(null);
      throw error;
    }
  };

  const generateImages = async () => {
    if (inputText.trim() === "") return;
      
    if (!isSubscribed) {
      const currentCount = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedCount = currentCount ? parseInt(currentCount, 10) : 0;
      
      if (parsedCount >= FREE_GENERATION_LIMIT) {
        showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK);
        return;
      }
      
      const newCount = parsedCount + 1;
      await AsyncStorage.setItem(STORAGE_KEY, newCount.toString());
      setGenerationCount(newCount);
      
      if (newCount >= FREE_GENERATION_LIMIT) {
        Alert.alert(
          'Free Limit Reached',
          'This is your last free generation. Upgrade to Premium for unlimited generations!',
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
    
    Keyboard.dismiss();
    setIsGenerating(true);
    setGenerationStarted(true);
    setGeneratedImages([null, null, null, null]);
    setGeneratedImagesBase64([null, null, null, null]);
    setCurrentImageIndex(0);
    
    const apiStyle = selectedStyle ? STYLE_MAP[selectedStyle] : 'none';
    
    for (let i = 0; i < 4; i++) {
      try {
        await generateSingleImage(inputText, apiStyle, i);
      } catch (error:any) {
        console.error(`Failed to generate image ${i + 1}:`, error);
        Alert.alert(
          'Warning',
          `Failed to generate image ${i + 1}: ${error.message}`
        );
      }
    }
    
    setIsGenerating(false);
  };

  const downloadImage = async (base64Data:any, index:any) => {
    try {
      if (!base64Data) {
        Alert.alert('Error', 'No image data to download');
        return;
      }

      setDownloadingIndex(index);

      if (!mediaLibraryPermission) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please grant storage permission to save images',
            [
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          setDownloadingIndex(null);
          return;
        }
        setMediaLibraryPermission(true);
      }

      const timestamp = new Date().getTime();
      const styleText = selectedStyle ? STYLE_MAP[selectedStyle] : 'none';
      const fileName = `ghibli-ai-${styleText}-${timestamp}-${index + 1}.jpg`;
      
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      
      try {
        const album = await MediaLibrary.getAlbumAsync('GhibliAI');
        
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync('GhibliAI', asset, false);
        }
      } catch (albumError) {
        console.error('Error with album:', albumError);
      }
      
      Alert.alert(
        'Success',
        'Image saved to your gallery in GhibliAI album'
      );
      
      setDownloadingIndex(null);
    } catch (error:any) {
      console.error('Error downloading image:', error);
      Alert.alert('Error', `Failed to download image: ${error.message}`);
      setDownloadingIndex(null);
    }
  };

  const selectArtStyle = (id:any) => {
    setSelectedStyle(id);
  };

  const spin = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header title='Create with AI' onSettingsPress={undefined} />
        <SafeAreaView style={styles.safeAreaContainer}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputPromptSection}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptTitle}>Input Prompt</Text>
              </View>
              <View style={styles.promptInputContainer}>
                <TextInput
                  style={styles.promptInput}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline={true}
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  placeholder="Describe the image you want to create..."
                />
              </View>
              <Text style={styles.promptHint}>
                Try: "A majestic castle on a floating island in the clouds with flying ships"
              </Text>
            </View>
            
            <View style={styles.artStyleSection}>
              <Text style={styles.sectionTitle}>Select Art Style</Text>
              <View style={styles.artStyleGrid}>
                {ART_STYLES.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    style={[
                      styles.artStyleItem,
                      selectedStyle === style.id && styles.selectedArtStyleItem
                    ]}
                    onPress={() => selectArtStyle(style.id)}
                  >
                    <View style={styles.artStyleImageContainer}>
                      <Image 
                        source={style.image} 
                        style={styles.artStyleImage} 
                      />
                      {style.id === '1' && (
                        <View style={styles.noStyleOverlay} />
                      )}
                    </View>
                    <Text style={[
                      styles.artStyleName,
                      selectedStyle === style.id && styles.selectedArtStyleName
                    ]}>
                      {style.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
                
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  (!inputText.trim() || isGenerating) && styles.disabledGenerateButton
                ]}
                onPress={generateImages}
                disabled={!inputText.trim() || isGenerating}
              >
                <Text style={styles.generateButtonText}>
                  {isGenerating ? "Generating..." : "Generate Images"}
                </Text>
              </TouchableOpacity>
            </View>
            {generationStarted && (
              <View style={styles.generatedImagesSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Generated Images</Text>
                  
                  {!isSubscribed && (
                    <View style={styles.freeUsageContainer}>
                      <Text style={styles.freeUsageText}>
                        {generationCount}/{FREE_GENERATION_LIMIT} free
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.imageGrid}>
                  {generatedImages.map((image, index) => (
                    <View key={index} style={styles.imageGridItemContainer}>
                      <TouchableOpacity
                        style={styles.imageGridItem}
                        disabled={!image}
                      >
                        {image ? (
                          <>
                            <Image 
                              source={{ uri: image }} 
                              style={styles.generatedImage} 
                            />
                            <TouchableOpacity
                              style={styles.downloadButton}
                              onPress={() => downloadImage(generatedImagesBase64[index], index)}
                              disabled={downloadingIndex === index}
                            >
                              {downloadingIndex === index ? (
                                <Animated.View style={{transform: [{rotate: spin}]}}>
                                  <MaterialCommunityIcons name="loading" size={20} color="white" />
                                </Animated.View>
                              ) : (
                                <Feather name="download" size={20} color="white" />
                              )}
                            </TouchableOpacity>
                          </>
                        ) : isGenerating && generatingImageIndex === index ? (
                          <View style={styles.loadingImageContainer}>
                            <Text style={styles.loadingImageText}>Cooking...🧑‍🍳</Text>
                          </View>
                        ) : (
                          <View style={styles.pendingImageContainer}>
                            <MaterialCommunityIcons name="image-plus" size={24} color="rgba(255, 255, 255, 0.3)" />
                            <Text style={styles.pendingImageText}>Processing...</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
        
            
            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeAreaContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  inputPromptSection: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
  },
  promptHeader: {
    marginBottom: 10,
  },
  promptTitle: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: "600",
    color: "white",
  },
  promptInputContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(147, 112, 219, 0.4)",
    overflow: "hidden",
  },
  promptInput: {
    padding: 15,
    color: "white",
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  promptHint: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 8,
    fontStyle: "italic",
    paddingLeft: 4,
  },
  artStyleSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  artStyleGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  artStyleItem: {
    width: (width - 32 - 30) / 4,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  selectedArtStyleItem: {
    transform: [{ scale: 1.05 }],
  },
  artStyleImageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(147, 112, 219, 0.3)',
  },
  artStyleImage: {
    width: (width - 32 - 30) / 4 - 4,
    height: 70,
  },
  noStyleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  artStyleName: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 8,
  },
  selectedArtStyleName: {
    color: "#9370DB",
    fontWeight: "600",
  },
  generatedImagesSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  freeUsageContainer: {
    backgroundColor: 'rgba(147, 112, 219, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeUsageText: {
    color: "#9370DB",
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  progressText: {
    color: "white",
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9370DB',
    borderRadius: 2,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageGridItemContainer: {
    width: (width - 40) / 2,
    height: (width - 40) / 2,
    marginBottom: 8,
    position: 'relative',
  },
  imageGridItem: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  generatedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  downloadButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(147, 112, 219, 0.8)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.8)",
  },
  loadingImageText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
  },
  pendingImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.5)",
  },
  pendingImageText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    marginTop: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: "#9370DB",
    borderRadius: 16,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9370DB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledGenerateButton: {
    opacity: 0.7,
    backgroundColor: "#666",
    shadowColor: "#333",
  },
  bottomPadding: {
    height: Platform.OS === 'ios' ? 20 : 10,
  },
});