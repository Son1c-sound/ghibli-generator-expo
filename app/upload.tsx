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
  Dimensions,
  ScrollView,
  Platform
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { router, useLocalSearchParams } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useSuperwall } from "@/hooks/useSuperwall"
import { SUPERWALL_TRIGGERS } from "./config/superwall"
import { generateImage, StyleItem } from "./utils/imageUtils"
import { stylesList } from "./mainComps/stylesData"
import { BlurView } from 'expo-blur';
const { width } = Dimensions.get("window")
const ACCENT_COLOR = "#3B82F6"

export default function UploadScreen() {
  const { styleId } = useLocalSearchParams()
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [imageSize, setImageSize] = useState(0)
  const { isSubscribed, showPaywall } = useSuperwall()
  
  const selectedStyle = stylesList.find(style => style.id === Number(styleId)) || stylesList[0]

  useEffect(() => {
    if (!isSubscribed && 
        selectedStyle && 
        selectedStyle.name !== "Anime" && 
        selectedStyle.name !== "OldSchool" && 
        selectedStyle.name !== "Lego") {
      showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK)
      router.replace("/")
      return
    }
  }, [selectedStyle, isSubscribed])

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

  const handleSelectedImage = async (selectedImage:any) => {
    setImage(selectedImage)
  }

  const handleStyleChange = (style:any) => {
    if (!isSubscribed && 
        style.name !== "Anime" && 
        style.name !== "OldSchool" && 
        style.name !== "Lego") {
      showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK)
      return
    }
    
    router.replace({
      pathname: "/upload",
      params: { styleId: style.id }
    })
  }

  const handleGenerateImage = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or capture an image first")
      return
    }

    setLoading(true)
    
    try {
      const resultImageUri = await generateImage(
        image,
        Number(styleId),
        stylesList,
        setLoading
      )
      
      if (resultImageUri) {
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
      <LinearGradient
        colors={['#000000', '#000000', '#000000']}
        locations={[0, 0.35, 0.7]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          
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
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.stylePreviewContainer}>
              <View style={styles.styleImageWrapper}>
                <Image 
                  source={{ uri: selectedStyle ? selectedStyle.src : null as any }} 
                  style={styles.stylePreviewImage} 
                />
              </View>
              <Text style={styles.styleDescription}>
                {`Transform your photos into ${selectedStyle ? selectedStyle.DisplayName : ""} style`}
              </Text>
            </View>
            
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
                <View
                  style={styles.emptyImageContainer}
                >
                  <Ionicons name="image-outline" size={60} color="#f5f5f5" />
                  <Text style={styles.emptyImageText}>
                    Select or capture an image
                  </Text>
                  
                  <View style={styles.uploadButtonsContainer}>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleImagePicker}
                    >
                      <View style={styles.uploadButtonGradient}>
                        <Ionicons name="images-outline" size={24} color="black" />
                        <Text style={styles.uploadButtonText}>Gallery</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleCameraCapture}
                    >
                      <View style={styles.uploadButtonGradient}>
                        <Ionicons name="camera-outline" size={24} color="black" />
                        <Text style={styles.uploadButtonText}>Camera</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
            
            {image && !loading && (
              <View style={styles.generateButtonContainer}>
                <TouchableOpacity
                  style={styles.generateButtonContent}
                  onPress={handleGenerateImage}
                >
                  <Ionicons name="sparkles" size={20} color="black" />
                  <Text style={styles.generateText}>Generate Image</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.switchStyleContainer}>
              <Text style={styles.switchStyleTitle}>Switch Style</Text>
              <View style={styles.stylesGrid}>
                {stylesList.map((style) => (
                  <TouchableOpacity
                    key={style.id}
                    style={[
                      styles.styleCardGrid,
                      selectedStyle && selectedStyle.id === style.id ? styles.selectedStyleCard : null
                    ]}
                    onPress={() => handleStyleChange(style)}
                  >
                    <View style={styles.styleCardImageContainer}>
                      <Image source={{ uri: style.src }} style={styles.styleCardImage} />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.styleCardGradient}
                      >
                        <Text style={styles.styleCardName}>{style.DisplayName}</Text>
                      </LinearGradient>
                      
                      {!isSubscribed && 
                        style.name !== "Anime" && 
                        style.name !== "OldSchool" && 
                        style.name !== "Lego" && (
                        <View style={styles.styleLockOverlay}>
                          <Ionicons name="lock-closed" size={16} color="white" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.bottomNavContainer}>
      <BlurView intensity={40} tint="dark">
      <SafeAreaView style={styles.bottomNavSafeArea}>
        <View style={styles.bottomNavBar}>
          <TouchableOpacity 
            style={styles.bottomNavButton}
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
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
            <Text style={styles.bottomNavText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      </BlurView>
    </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingTop: 20,
  },
  backButton: {
    padding: 10,
    color: "white",
    borderRadius: 20,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSpacing: {
    width: 40,
  },
  stylePreviewContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  styleImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(245, 245, 245, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  stylePreviewImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  styleDescription: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  uploadContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  emptyImageContainer: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  emptyImageText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 30,
    fontWeight: "500",
  },
  uploadButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  uploadButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
    width: 120,
  },
  uploadButtonGradient: {
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  uploadButtonText: {
    color: "black",
    marginTop: 8,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  imagePreview: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 20,
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
    borderRadius: 20,
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  progressBar: {
    width: "70%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#f5f5f5",
  },
  generateButtonContainer: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  generateButton: {
    width: "90%",
    backgroundColor: "#3B82F6",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 16,
  },
  generateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    width: "90%",
  },
  generateText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  changeImageButton: {
    alignItems: "center",
    padding: 8,
  },
  changeImageText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    fontWeight: "500",
  },
  switchStyleContainer: {
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
  },
  switchStyleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
    marginLeft: 4,
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width * 0.85,
    alignSelf: "center",
  },
  styleCardGrid: {
    width: (width * 0.85 - 16) / 3,
    height: (width * 0.85 - 16) / 3,
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedStyleCard: {
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  styleCardImageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  styleCardImage: {
    width: "100%",
    height: "100%",
  },
  styleCardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
    padding: 8,
  },
  styleCardName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  styleLockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavSafeArea: {
    alignItems: 'center',
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 25,
    width: width * 0.95,
    paddingVertical: 3,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
});