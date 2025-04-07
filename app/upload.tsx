import React, { useState, useEffect } from "react"
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  StatusBar, 
  Alert, 
  ActivityIndicator, 
  Dimensions 
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { router, useLocalSearchParams } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { stylesList } from "./mainComps/stylesData"
import { generateImage } from "./utils/imageUtils"


const { width } = Dimensions.get("window")
const ACCENT_COLOR = "#3B82F6"

export default function UploadScreen() {
  const { styleId } = useLocalSearchParams()
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [imageSize, setImageSize] = useState(0)
  
  // Find the selected style
  const selectedStyle = stylesList.find(style => style.id === Number(styleId)) || stylesList[0]

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress((prevProgress) => {
          const newProgress = prevProgress + Math.random() * 10
          return newProgress > 95 ? 95 : newProgress
        })
      }, 500)

      return () => {
        clearInterval(interval)
        setLoadingProgress(0)
      }
    }
  }, [loading])

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Required", "Sorry, we need camera roll permissions to upload photos.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled) {
        const selectedImage = result.assets[0].uri
        handleSelectedImage(selectedImage)
      }
    } catch (error) {
      console.log("Error picking image:", error)
      Alert.alert("Error", "Something went wrong while selecting your image")
    }
  }

  const handleCameraCapture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Required", "Sorry, we need camera permissions to take photos.")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      })

      if (!result.canceled) {
        const selectedImage = result.assets[0].uri
        handleSelectedImage(selectedImage)
      }
    } catch (error) {
      console.log("Error taking photo:", error)
      Alert.alert("Error", "Something went wrong while taking your photo")
    }
  }

  const handleSelectedImage = async (selectedImage) => {
    setImage(selectedImage)
  }

  const handleGenerateImage = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or capture an image first")
      return
    }

    setLoading(true)
    
    try {
      // Process the image using the generateImage function
      const resultImageUri = await generateImage(
        image,
        Number(styleId),
        stylesList,
        setLoading
      )
      
      if (resultImageUri) {
        // Navigate to the result screen with the necessary data
        router.push({
          pathname: "/result",
          params: {
            originalImage: image,
            resultImage: resultImageUri,
            styleId: styleId
          }
        })
      }
    } catch (error) {
      console.log("Error generating image:", error)
      Alert.alert("Error", "Something went wrong while generating your image")
      setLoading(false)
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedStyle ? selectedStyle.DisplayName : "Upload"}</Text>
          <View style={styles.headerSpacing} />
        </View>
        
        {/* Style Preview */}
        <View style={styles.stylePreviewContainer}>
          <Image 
            source={{ uri: selectedStyle ? selectedStyle.src : null }} 
            style={styles.stylePreviewImage} 
          />
          <Text style={styles.styleDescription}>
            {`Transform your photos into ${selectedStyle ? selectedStyle.DisplayName : ""} style`}
          </Text>
        </View>
        
        {/* Image Upload Area */}
        <View style={styles.uploadContainer}>
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              {loading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingText}>
                    Processing... {Math.round(loadingProgress)}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${loadingProgress}%` },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyImageContainer}>
              <Ionicons name="image-outline" size={60} color="#666" />
              <Text style={styles.emptyImageText}>
                Select or capture an image
              </Text>
              
              <View style={styles.uploadButtonsContainer}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="images-outline" size={24} color="white" />
                  <Text style={styles.uploadButtonText}>Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleCameraCapture}
                >
                  <Ionicons name="camera-outline" size={24} color="white" />
                  <Text style={styles.uploadButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {image && !loading && (
          <View style={styles.generateButtonContainer}>
            <LinearGradient
              colors={[ACCENT_COLOR, "#1E40AF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.generateButton}
            >
              <TouchableOpacity
                style={styles.generateButtonContent}
                onPress={handleGenerateImage}
              >
                <Ionicons name="sparkles" size={20} color="white" />
                <Text style={styles.generateText}>Generate Image</Text>
              </TouchableOpacity>
            </LinearGradient>
            
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={() => setImage(null)}
            >
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerSpacing: {
    width: 40,
  },
  stylePreviewContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  stylePreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  styleDescription: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  uploadContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyImageText: {
    color: "#999",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  uploadButton: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 8,
    width: 120,
  },
  uploadButtonText: {
    color: "white",
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: "relative",
  },
  imagePreview: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
  },
  progressBar: {
    width: "70%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: ACCENT_COLOR,
  },
  generateButtonContainer: {
    width: "100%",
    marginTop: 24,
    marginBottom: 12,
  },
  generateButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  generateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  generateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  changeImageButton: {
    alignItems: "center",
    padding: 8,
  },
  changeImageText: {
    color: "#999",
    fontSize: 14,
  },
});