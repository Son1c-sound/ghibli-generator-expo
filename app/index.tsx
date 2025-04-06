import React, { useEffect, useState } from "react"
import {View,Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Alert, ActivityIndicator,Dimensions, ScrollView, Platform,} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import useOnboarding from "@/hooks/useOnboarding"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import ResultScreen from "./mainComps/resultScreen"
import { Share } from "react-native"
import { useSuperwall } from "@/hooks/useSuperwall"
import { SUPERWALL_TRIGGERS } from "./config/superwall"
import {
  processSelectedImage,
  generateImage as generateStyledImage,
  handleDownload as saveImage,
  handleShare as shareImage,
  StyleItem,
} from "./utils/imageUtils"
import { stylesList } from "./mainComps/stylesData"

const { width } = Dimensions.get("window")
const ACCENT_COLOR = "#3B82F6"

export default function AnimeConverter() {
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [imageSize, setImageSize] = useState(0)
  const [showResultScreen, setShowResultScreen] = useState(false)
  const [verificationNote, setVerificationNote] = useState("")
  const { isSubscribed, showPaywall } = useSuperwall()

  const { isOnboarded, isLoading } = useOnboarding()

  useEffect(() => {
    if (isLoading) return

    if (!isOnboarded) {
      router.replace("/onboarding")
    }
  }, [isOnboarded, isLoading])

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

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          screenStyles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
      </SafeAreaView>
    )
  }

  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to upload photos."
        )
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
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to take photos."
        )
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

  const handleSelectedImage = async (selectedImage: string) => {
    await processSelectedImage(
      selectedImage,
      setImage,
      setImageSize,
      setResultImage,
      setShowResultScreen
    )
  }

  const handleGenerateImage = async () => {
    setLoading(true)
    try {
      await generateStyledImage(
        image,
        selectedStyle,
        styles,
        setLoading,
        setShowResultScreen,
        setResultImage
      )
      setLoadingProgress(100)
    } catch (error) {
      console.log("Error generating image:", error)
      Alert.alert("Error", "Something went wrong while generating your image")
      setLoading(false)
      setLoadingProgress(0)
    }
  }

  const handleDownload = async () => {
    await saveImage(resultImage, handleShare)
  }

  const handleShare = async () => {
    await shareImage(resultImage, Share)
  }

  const handleRetry = () => {
    setShowResultScreen(false)
    setResultImage(null)
  }

  const navigateToProfile = () => {
    router.push("/profile")
  }

  const styles: StyleItem[] = stylesList

  if (showResultScreen) {
    return (
      <ResultScreen
        image={image}
        resultImage={resultImage}
        loading={loading}
        selectedStyle={selectedStyle}
        verificationNote={verificationNote}
        styles={styles}
        handleRetry={handleRetry}
        handleDownload={handleDownload}
        handleShare={handleShare}
      />
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={screenStyles.container}>
        <StatusBar barStyle="light-content" />

        <View style={screenStyles.header}>
          <View style={screenStyles.titleContainer}>
            <Text style={screenStyles.titleIcon}></Text>
            <Text style={screenStyles.title}>GoToon</Text>
          </View>
          <TouchableOpacity onPress={navigateToProfile} style={screenStyles.settingsButton}>
            <Ionicons name="settings" size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>
        <View style={screenStyles.mainContent}>
          <View style={screenStyles.imageContainer}>
            {image ? (
              <View style={screenStyles.imagePreviewContainer}>
                <Image source={{ uri: image }} style={screenStyles.imagePreview} />
                {loading ? (
                  <View style={screenStyles.loadingOverlay}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={screenStyles.loadingText}>Processing... {Math.round(loadingProgress)}% </Text>
                    <View style={screenStyles.progressBar}>
                      <View style={[screenStyles.progressFill,{ width: `${loadingProgress}%` },]}/>
                    </View>
                  </View>
                ) : (
                  <View style={screenStyles.changeImageButtonsContainer}>
                    <TouchableOpacity style={screenStyles.changeImageButton} onPress={handleImagePicker}>
                      <Text style={screenStyles.changeImageText}>Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={screenStyles.changeImageButton} onPress={handleCameraCapture}>
                      <Ionicons name="camera-outline" size={18} color="white" />
                      <Text style={screenStyles.changeImageText}>Selfie</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View style={screenStyles.uploadOptionsContainer}>
                <TouchableOpacity
                  style={screenStyles.uploadButton}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="image-outline" size={24} color="black" />
                  <Text style={screenStyles.uploadText}>Select Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={screenStyles.uploadButton}
                  onPress={handleCameraCapture}
                >
                  <Ionicons name="camera-outline" size={24} color="black" />
                  <Text style={screenStyles.uploadText}>Take a Selfie</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {!loading && (
          <View style={screenStyles.bottomContainer}>
            <View style={screenStyles.styleTitleContainer}>
              <Text style={screenStyles.styleTitle}>Swipe For More Styles</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 10,
                paddingHorizontal: 5,
              }}
            >
              {styles.map((style) => (
                <TouchableOpacity
                  key={style.id}
                  style={[
                    screenStyles.styleItem,
                    selectedStyle === style.id && screenStyles.selectedStyle,
                  ]}
                  onPress={() => {
                    if (
                      !isSubscribed &&
                      style.name !== "Anime" &&
                      style.name !== "OldSchool" &&
                      style.name &&
                      style.name !== "Lego"
                    ) {
                      showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK)
                      return
                    }
                    setSelectedStyle(style.id)
                  }}
                >
                  <View style={{ position: "relative" }}>
                    <Image
                      style={screenStyles.styleImage}
                      source={{ uri: style.src }}
                    />
                    {!isSubscribed &&
                      style.name !== "Anime" &&
                      style.name !== "OldSchool" &&
                      style.name &&
                      style.name !== "Lego" && (
                        <View
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Ionicons
                            name="lock-closed"
                            size={20}
                            color="white"
                          />
                        </View>
                      )}
                  </View>
                  <Text style={screenStyles.styleName}>
                    {style.DisplayName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={handleGenerateImage}
              disabled={!image || !selectedStyle || loading}
              style={screenStyles.generateButtonContainer}>
              <LinearGradient
                colors={[ACCENT_COLOR, "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[screenStyles.generateButton, (!image || !selectedStyle || loading) && screenStyles.disabledButton,]}>
                <View style={screenStyles.generateButtonContent}>
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="sparkles" size={20} color="white" />
                  )}
                  <Text style={screenStyles.generateText}>
                    {loading ? "Processing..." : "Generate Image"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 40,
    marginBottom: 20,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  changeImageButtonsContainer: {
    flexDirection: "row",

    width: "100%",
    marginTop: 16,
    paddingHorizontal: 10,
  },
  changeImageButton: {
    backgroundColor: "#2563EB",
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "32%",
    marginLeft: 10,
  },
  changeImageText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  settingsButton: {
    padding: 5,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "80%",
  },
  uploadOptionsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  uploadButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  bottomContainer: {
    marginBottom: 24,
  },
  styleTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  styleTitle: {
    color: "white",
    fontSize: 16,
    marginLeft: 6,
  },
  styleItem: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    width: 80,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedStyle: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderColor: ACCENT_COLOR,
  },
  styleImage: {
    width: 69,
    height: 69,
    borderRadius: 8,
    backgroundColor: "#333",
    marginBottom: 4,
  },
  styleName: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  generateButtonContainer: {
    width: "100%",
  },
  generateButton: {
    borderRadius: 100,
    marginTop: 20,
    width: "100%",
  },
  disabledButton: {
    opacity: 0.6,
  },
  generateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#2563EB",
    borderRadius: 200,
  },
  generateText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,

    marginLeft: 8,
  },
  imagePreviewContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  imagePreview: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 10,
    resizeMode: "contain",
  },
  testButtonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  testButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#555",
  },
  testButtonText: {
    color: "red",
    fontSize: 13,
    fontWeight: "bold",
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
    borderRadius: 10,
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
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
})
