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
import { SUPERWALL_TRIGGERS } from "../config/superwall"
import { generateImage, StyleItem } from "../utils/imageUtils"
import { stylesList } from "../mainComps/stylesData"
import { BlurView } from 'expo-blur'
import Svg, { Path } from 'react-native-svg'
const { width } = Dimensions.get("window")
const ACCENT_COLOR = "#3B82F6"

const CameraIcon = (props:any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z"
      stroke={props.color || "#000000"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 16.8V9.2C3 8.0799 3 7.51984 3.21799 7.09202C3.40973 6.71569 3.71569 6.40973 4.09202 6.21799C4.51984 6 5.0799 6 6.2 6H7.25464C7.37758 6 7.43905 6 7.49576 5.9935C7.79166 5.95961 8.05705 5.79559 8.21969 5.54609C8.25086 5.49827 8.27836 5.44328 8.33333 5.33333C8.44329 5.11342 8.49827 5.00346 8.56062 4.90782C8.8859 4.40882 9.41668 4.08078 10.0085 4.01299C10.1219 4 10.2448 4 10.4907 4H13.5093C13.7552 4 13.8781 4 13.9915 4.01299C14.5833 4.08078 15.1141 4.40882 15.4394 4.90782C15.5017 5.00345 15.5567 5.11345 15.6667 5.33333C15.7216 5.44329 15.7491 5.49827 15.7803 5.54609C15.943 5.79559 16.2083 5.95961 16.5042 5.9935C16.561 6 16.6224 6 16.7454 6H17.8C18.9201 6 19.4802 6 19.908 6.21799C20.2843 6.40973 20.5903 6.71569 20.782 7.09202C21 7.51984 21 8.0799 21 9.2V16.8C21 17.9201 21 18.4802 20.782 18.908C20.5903 19.2843 20.2843 19.5903 19.908 19.782C19.4802 20 18.9201 20 17.8 20H6.2C5.0799 20 4.51984 20 4.09202 19.782C3.71569 19.5903 3.40973 19.2843 3.21799 18.908C3 18.4802 3 17.9201 3 16.8Z"
      stroke={props.color || "#000000"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

const GalleryIcon = (props:any) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 12.5001L3.75159 10.9675C4.66286 10.1702 6.03628 10.2159 6.89249 11.0721L11.1822 15.3618C11.8694 16.0491 12.9512 16.1428 13.7464 15.5839L14.0446 15.3744C15.1888 14.5702 16.7369 14.6634 17.7765 15.599L21 18.5001"
      stroke={props.color || "#1C274C"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M15 5.5H18.5M18.5 5.5H22M18.5 5.5V9M18.5 5.5V2"
      stroke={props.color || "#1C274C"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 10.8717 2 9.87835 2.02008 9M12 2C7.28595 2 4.92893 2 3.46447 3.46447C3.03965 3.88929 2.73806 4.38921 2.52396 5"
      stroke={props.color || "#1C274C"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
)

export default function UploadScreen() {
  const { styleId } = useLocalSearchParams()
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [imageSize, setImageSize] = useState(0)


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

  const handleSelectedImage = async (selectedImage:any) => {
    setImage(selectedImage)
  }

  const handleStyleChange = (style:any) => {
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
                  <Text style={styles.emptyImageText}>
                    Select or capture an image
                  </Text>

                  <View style={styles.uploadButtonsContainer}>
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleImagePicker}
                    >
                      <View style={[styles.uploadButtonGradient, styles.enhancedButton]}>
                        <GalleryIcon color="black" width={24} height={24} />
                        <Text style={styles.uploadButtonText}>Gallery</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleCameraCapture}
                    >
                      <View style={[styles.uploadButtonGradient, styles.enhancedButton]}>
                        <CameraIcon color="black" width={24} height={24} />
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
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
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
    paddingBottom: 20,
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
    marginBottom: 2,
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
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  emptyImageText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  uploadButtonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  uploadButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
    width: "90%",
  },
  uploadButtonGradient: {
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  enhancedButton: {
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "black",
    marginLeft: 12,
    fontWeight: "700",
    fontSize: 16,
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
    backgroundColor: "#9370DB",
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 16,
  },
  generateButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#9370DB",

    borderRadius: 30,
    width: "90%",
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
    marginLeft: 14,
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