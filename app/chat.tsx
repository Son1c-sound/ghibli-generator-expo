import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Animated,
  Easing,
  ScrollView,
  Keyboard
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SubscriptionBanner from "./FreePlanHeader";

const { width, height } = Dimensions.get("window");

const ART_STYLES = [
  {
    id: '1',
    name: 'No Style',
    image: { uri: 'https://via.placeholder.com/100x70/333333/FFFFFF?text=No+Style' }
  },
  {
    id: '2',
    name: 'Anime',
    image: { uri: 'https://via.placeholder.com/100x70/6B46C1/FFFFFF?text=Anime' }
  },
  {
    id: '3',
    name: 'Fantasy',
    image: { uri: 'https://via.placeholder.com/100x70/9F7AEA/FFFFFF?text=Fantasy' }
  },
  {
    id: '4',
    name: 'Realistic',
    image: { uri: 'https://via.placeholder.com/100x70/D6BCFA/FFFFFF?text=Realistic' }
  }
];

export default function AIImageGenerator() {
  const [inputText, setInputText] = useState("An anime boy strikes a pose in front of a moody cityscape, his hair a deep shade of blue and his eyes sharp and confident.");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([null, null, null, null]);
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (isGenerating) {
      Animated.loop(
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
    } else {
      loadingAnim.setValue(0);
    }
  }, [isGenerating]);

  const generateImages = () => {
    if (inputText.trim() === "") return;
    
    Keyboard.dismiss();
    setIsGenerating(true);
    
    setTimeout(() => {
      const styleColor = selectedStyle === '2' ? '6B46C1' : 
                         selectedStyle === '3' ? '9F7AEA' : 
                         selectedStyle === '4' ? 'D6BCFA' : '805AD5';
                          
      setGeneratedImages([
        `https://via.placeholder.com/300x300/${styleColor}/FFFFFF?text=Generated+Image+1`,
        `https://via.placeholder.com/300x300/${styleColor}/FFFFFF?text=Generated+Image+2`,
        `https://via.placeholder.com/300x300/${styleColor}/FFFFFF?text=Generated+Image+3`,
        `https://via.placeholder.com/300x300/${styleColor}/FFFFFF?text=Generated+Image+4`
      ]);
      setIsGenerating(false);
    }, 3000);
  };
  
  const handleImageSelect = (index) => {
    if (generatedImages[index]) {
      router.push({
        pathname: "/result",
        params: { 
          resultImage: generatedImages[index], 
          styleId: selectedStyle ? selectedStyle : '1'
        }
      });
    }
  };

  const selectArtStyle = (id) => {
    setSelectedStyle(id);
  };

  const goBack = () => {
    router.push("/");
  };

  const spin = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>

        <StatusBar barStyle="light-content" />
        
        <SafeAreaView style={styles.safeAreaContainer}>
        <SubscriptionBanner />
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="chevron-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

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
            </View>
            
            <View style={styles.artStyleSection}>
              <Text style={styles.sectionTitle}>Art Style</Text>
              <View style={styles.artStyleGrid}>
                {ART_STYLES.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    style={[
                      styles.artStyleItem,
                      selectedStyle === style.id && styles.selectedArtStyle
                    ]}
                    onPress={() => selectArtStyle(style.id)}
                  >
                    <Image source={style.image} style={styles.artStyleImage} />
                    {style.id === '1' && (
                      <View style={styles.noStyleOverlay}>
                        <Ionicons name="close-circle" size={30} color="white" />
                      </View>
                    )}
                    <Text style={styles.artStyleName}>{style.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.generatedImagesSection}>
              <Text style={styles.sectionTitle}>Generated Images</Text>
              {isGenerating ? (
                <View style={styles.loadingContainer}>
                  <Animated.View style={{transform: [{rotate: spin}]}}>
                    <MaterialCommunityIcons name="image-filter" size={40} color="#f5f5f5" />
                  </Animated.View>
                  <Text style={styles.loadingText}>Creating your images...</Text>
                </View>
              ) : (
                <View style={styles.imageGrid}>
                  {generatedImages.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageGridItem}
                      onPress={() => handleImageSelect(index)}
                    >
                      {image ? (
                        <Image 
                          source={{ uri: image }} 
                          style={styles.generatedImage} 
                        />
                      ) : (
                        <View style={styles.emptyImagePlaceholder}>
                          <Ionicons name="image-outline" size={30} color="rgba(255, 255, 255, 0.3)" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.bottomPadding} />
          </ScrollView>
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity
              style={[
                styles.generateButton,
                (!inputText.trim() || isGenerating) && styles.disabledGenerateButton
              ]}
              onPress={generateImages}
              disabled={!inputText.trim() || isGenerating}
            >
              <Text style={styles.generateButtonText}>Generate</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 90, // Space for the button at the bottom
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 4,
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
  artStyleSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
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
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 2,
    backgroundColor: "#1E1E1E",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedArtStyle: {
    borderColor: "#9370DB",
  },
  artStyleImage: {
    width: "100%",
    height: 70,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  artStyleName: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
    paddingVertical: 5,
  },
  noStyleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  generatedImagesSection: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    height: width - 40, // Match the height of the image grid
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 16,
    fontSize: 16,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageGridItem: {
    width: (width - 40) / 2,
    height: (width - 40) / 2,
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  generatedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  bottomPadding: {
    height: 20, // Extra padding at the bottom
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(147, 112, 219, 0.2)",
  },
  generateButton: {
    backgroundColor: "#9370DB",
    borderRadius: 25,
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#9370DB",
    shadowOffset: { width: 0, height: 4 },
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
});