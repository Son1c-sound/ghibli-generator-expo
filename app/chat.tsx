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
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <SafeAreaView style={styles.safeAreaContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI Chat</Text>
            <View style={{ width: 40 }} />
          </View>
          
          <View style={styles.imageGenerationContainer}>
            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f5f5f5" />
                <Text style={styles.loadingText}>Generating your image...</Text>
              </View>
            ) : generatedImage ? (
              <View style={styles.generatedImageContainer}>
                <Image 
                  source={{ uri: generatedImage }} 
                  style={styles.generatedImage} 
                />
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveImage}
                >
                  <Text style={styles.saveButtonText}>Save Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noImageContainer}>
                <Ionicons name="image-outline" size={60} color="#f5f5f5" />
                <Text style={styles.noImageText}>
                  Ask the AI to generate an image for you
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
                <View 
                  key={message.id} 
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userBubble : styles.aiBubble
                  ]}
                >
                  <Text style={message.isUser ? styles.userMessageText : styles.aiMessageText}>
                    {message.text}
                  </Text>
                </View>
              ))}
              <View style={styles.bottomPadding} />
            </ScrollView>
          </View>
        </SafeAreaView>
        
        <View style={styles.bottomNavContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          >
            <SafeAreaView>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
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
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={inputText.trim() === "" ? "rgba(0, 0, 0, 0.4)" : "black"} 
                  />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  imageGenerationContainer: {
    width: "90%",
    height: height * 0.35,
    alignSelf: "center",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
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
  saveButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  saveButtonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 14,
  },
  noImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noImageText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  chatContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderBottomWidth: 0,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#f5f5f5",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  userMessageText: {
    fontSize: 15,
    color: "#000",
  },
  aiMessageText: {
    fontSize: 15,
    color: "#fff",
  },
  bottomPadding: {
    height: 70,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#000000",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "white",
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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
});