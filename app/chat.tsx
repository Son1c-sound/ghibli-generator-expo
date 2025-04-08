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
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
  Keyboard
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const SUGGESTED_PROMPTS = [
  {
    id: '1',
    text: 'Sunset over mountains with a lake reflection',
    category: 'Landscape'
  },
  {
    id: '2',
    text: 'Cyberpunk cityscape at night with neon lights',
    category: 'Sci-Fi'
  },
  {
    id: '3',
    text: 'A magical forest with glowing mushrooms and fairies',
    category: 'Fantasy'
  },
  {
    id: '4',
    text: 'Abstract painting with vibrant colors and geometric shapes',
    category: 'Art'
  },
  {
    id: '5',
    text: 'Underwater scene with coral reef and tropical fish',
    category: 'Nature'
  },
  {
    id: '6',
    text: 'Vintage car on a desert road with dramatic sky',
    category: 'Travel'
  },
  {
    id: '7',
    text: 'Astronaut floating in space with Earth in background',
    category: 'Space'
  },
  {
    id: '8',
    text: 'Cozy cabin interior with fireplace in winter',
    category: 'Lifestyle'
  }
];

export default function AIImageGenerator() {
  const [inputText, setInputText] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const loadingAnim = useRef(new Animated.Value(0)).current;

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

  const generateImage = () => {
    if (inputText.trim() === "") return;
    
    Keyboard.dismiss();
    
    setIsGenerating(true);
    
    setTimeout(() => {
      setGeneratedImage("https://via.placeholder.com/500");
      setIsGenerating(false);
    }, 3000);
  };
  
  const handleSaveImage = () => {
    if (generatedImage) {
      router.push({
        pathname: "/result",
        params: { 
          resultImage: generatedImage, 
          styleId: 1
        }
      });
    }
  };
  
  const handlePromptSelect = (prompt) => {
    setInputText(prompt.text);
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
          <LinearGradient
            colors={['rgba(30, 30, 30, 0.9)', 'rgba(0, 0, 0, 0.8)']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Text to Image</Text>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="settings-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          
          <View style={styles.imageGenerationContainer}>
            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <Animated.View style={{transform: [{rotate: spin}]}}>
                  <MaterialCommunityIcons name="image-filter" size={40} color="#f5f5f5" />
                </Animated.View>
                <Text style={styles.loadingText}>Creating your masterpiece...</Text>
                <View style={styles.loadingBar}>
                  <Animated.View 
                    style={[
                      styles.loadingProgress, 
                      {width: loadingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['5%', '75%']
                      })}
                    ]} 
                  />
                </View>
              </View>
            ) : generatedImage ? (
              <View style={styles.generatedImageContainer}>
                <Image 
                  source={{ uri: generatedImage }} 
                  style={styles.generatedImage} 
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.imageActionButton}>
                    <Ionicons name="share-outline" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveImage}
                  >
                    <Text style={styles.saveButtonText}>Save Image</Text>
                    <Ionicons name="download-outline" size={18} color="black" style={{marginLeft: 5}} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageActionButton}>
                    <Ionicons name="refresh-outline" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.noImageContainer}>
                <View style={styles.iconContainer}>
                  <Ionicons name="image-outline" size={45} color="#f5f5f5" />
                  <MaterialCommunityIcons name="plus" size={25} color="#f5f5f5" style={styles.plusIcon} />
                  <MaterialCommunityIcons name="creation" size={30} color="#f5f5f5" style={styles.creationIcon} />
                </View>
                <Text style={styles.noImageTitle}>AI Image Generator</Text>
                <Text style={styles.noImageText}>
                  Describe what you want to create, and I'll turn it into an image
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.suggestedPromptsSection}>
            <Text style={styles.suggestedPromptsTitle}>Suggested Prompts</Text>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestedPromptsScrollContainer}
            >
              {SUGGESTED_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt.id}
                  style={styles.promptCard}
                  onPress={() => handlePromptSelect(prompt)}
                >
                  <View style={styles.promptCardBackground}>
                    <Text style={styles.promptCategory}>{prompt.category}</Text>
                    <Text style={styles.promptText}>{prompt.text}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.spacer} />
        </SafeAreaView>
        
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', '#000000']}
          style={styles.bottomInputContainer}
        >
          <SafeAreaView>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Describe the image you want to create..."
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={inputText}
                onChangeText={setInputText}
                multiline={true}
                numberOfLines={3}
              />
              <TouchableOpacity 
                style={[
                  styles.generateButton, 
                  inputText.trim() === "" && styles.disabledGenerateButton
                ]} 
                onPress={generateImage}
                disabled={inputText.trim() === ""}
              >
                <LinearGradient
                  colors={inputText.trim() === "" ? ['#999', '#777'] : ['#4776E6', '#8E54E9']}
                  style={styles.generateButtonGradient}
                >
                  <Text style={styles.generateButtonText}>Generate</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
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
  headerGradient: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 12 : 10,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  imageGenerationContainer: {
    width: "92%",
    height: height * 0.35,
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    color: "white",
    marginTop: 14,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 20,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#4776E6',
  },
  generatedImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  generatedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageActionButton: {
    width: 40,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 10,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 14,
  },
  noImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  iconContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  creationIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  noImageTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  noImageText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  suggestedPromptsSection: {
    paddingLeft: 16,
    marginTop: 15,
    marginBottom: 15,
  },
  suggestedPromptsTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  suggestedPromptsScrollContainer: {
    paddingRight: 16,
  },
  promptCard: {
    width: width * 0.7,
    height: 100,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  promptCardBackground: {
    width: '100%',
    height: '100%',
    padding: 12,
    justifyContent: 'space-between',
  },
  promptCategory: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    fontWeight: "500",
    backgroundColor: 'rgba(20, 20, 20, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  promptText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  bottomInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
  },
  inputWrapper: {
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
  },
  input: {
    backgroundColor: "rgba(50, 50, 50, 0.8)",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    color: "white",
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  generateButton: {
    height: 50,
    marginTop: 12,
    alignSelf: "stretch",
  },
  generateButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  generateButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledGenerateButton: {
    opacity: 0.7,
  },
});