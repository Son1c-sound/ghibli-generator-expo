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
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Animated,
  Easing
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function AIChatScreen() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I can help you generate images. Describe what you'd like to create!", 
      isUser: false, 
      timestamp: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollViewRef = useRef();
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

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        text: `I'll generate an image based on "${inputText}". Please wait...`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      generateImage(inputText);
    }, 1000);
  };
  
  const generateImage = (prompt) => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setGeneratedImage("https://via.placeholder.com/500");
      setIsGenerating(false);
      
      const successMessage = {
        id: messages.length + 3,
        text: "Here's your generated image! What do you think?",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, successMessage]);
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
  
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  const spin = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <SafeAreaView style={styles.safeAreaContainer}>
          {/* Header with gradient */}
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
          
          <View style={styles.chatContainer}>
            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map(message => (
                <View key={message.id} style={styles.messageWrapper}>
                  {!message.isUser && (
                    <View style={styles.avatarContainer}>
                      <LinearGradient
                        colors={['#4776E6', '#8E54E9']}
                        style={styles.avatar}
                      >
                        <Text style={styles.avatarText}>AI</Text>
                      </LinearGradient>
                    </View>
                  )}
                  <View style={styles.messageContent}>
                    <View 
                      style={[
                        styles.messageBubble,
                        message.isUser ? styles.userBubble : styles.aiBubble
                      ]}
                    >
                      <Text style={message.isUser ? styles.userMessageText : styles.aiMessageText}>
                        {message.text}
                      </Text>
                    </View>
                    <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.bottomPadding} />
            </ScrollView>
          </View>
        </SafeAreaView>
        
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', '#000000']}
          style={styles.bottomNavContainer}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          >
            <SafeAreaView>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Describe the image you want..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton, 
                    inputText.trim() === "" && styles.disabledSendButton
                  ]} 
                  onPress={sendMessage}
                  disabled={inputText.trim() === ""}
                >
                  <LinearGradient
                    colors={inputText.trim() === "" ? ['#999', '#777'] : ['#4776E6', '#8E54E9']}
                    style={styles.sendButtonGradient}
                  >
                    <Ionicons 
                      name="send" 
                      size={20} 
                      color={inputText.trim() === "" ? "rgba(0, 0, 0, 0.4)" : "white"} 
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "rgba(20, 20, 20, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  avatarContainer: {
    marginRight: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: "90%",
  },
  userBubble: {
    backgroundColor: "#f5f5f5",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  aiBubble: {
    backgroundColor: "rgba(50, 50, 50, 0.9)",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  userMessageText: {
    fontSize: 15,
    color: "#000",
  },
  aiMessageText: {
    fontSize: 15,
    color: "#fff",
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bottomPadding: {
    height: 70,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: Platform.OS === "ios" ? 25 : 15,
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(50, 50, 50, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
    maxHeight: 100,
    minHeight: 46,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  sendButton: {
    width: 46,
    height: 46,
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendButton: {
    opacity: 0.7,
  },
});