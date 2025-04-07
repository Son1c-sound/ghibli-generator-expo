import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Alert, ActivityIndicator, Dimensions, ScrollView, Platform } from "react-native"
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
import { processSelectedImage, generateImage as generateStyledImage, handleDownload as saveImage, handleShare as shareImage, StyleItem } from "./utils/imageUtils"
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
      <SafeAreaView style={[screenStyles.container, {justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={ACCENT_COLOR} />
      </SafeAreaView>
    )
  }

  const styles: StyleItem[] = stylesList
  
  const handleStyleSelect = (styleId) => {
    // Find the selected style
    const style = styles.find(s => s.id === styleId)
    
    if (!isSubscribed && 
        style && 
        style.name !== "Anime" && 
        style.name !== "OldSchool" && 
        style.name && 
        style.name !== "Lego") {
      showPaywall(SUPERWALL_TRIGGERS.FEATURE_UNLOCK)
      return
    }
    
    setSelectedStyle(styleId)
    // Navigate to upload/camera screen
    // You would implement this navigation logic later
    router.push({
      pathname: "/upload",
      params: { styleId }
    })
  }

  // Find the Ghibli style for featured card
  const ghibliStyle = styles.find(style => style.name === "Ghibli") || styles[0]
  
  // All other styles for the grid
  const otherStyles = styles.filter(style => style.id !== ghibliStyle.id)

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
        </View>
        
        <ScrollView style={screenStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Featured Style Card */}
          <View style={screenStyles.featuredContainer}>
            <Text style={screenStyles.sectionTitle}>Featured Style</Text>
            <TouchableOpacity
              style={screenStyles.featuredCard}
              onPress={() => handleStyleSelect(ghibliStyle.id)}
            >
              <Image 
                source={{ uri: ghibliStyle.src }} 
                style={screenStyles.featuredImage} 
              />
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={screenStyles.featuredGradient}
              >
                <View style={screenStyles.featuredTextContainer}>
                  <Text style={screenStyles.featuredTitle}>{ghibliStyle.DisplayName}</Text>
                  <Text style={screenStyles.featuredDescription}>
                    Transform your photos into magical Ghibli-inspired art
                  </Text>
                  
                  {!isSubscribed && 
                    ghibliStyle.name !== "Anime" && 
                    ghibliStyle.name !== "OldSchool" && 
                    ghibliStyle.name !== "Lego" && (
                    <View style={screenStyles.lockIconContainer}>
                      <Ionicons name="lock-closed" size={16} color="white" />
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Other Styles Grid */}
          <View style={screenStyles.stylesGridContainer}>
            <Text style={screenStyles.sectionTitle}>More Styles</Text>
            <View style={screenStyles.stylesGrid}>
              {otherStyles.map((style, index) => (
                <TouchableOpacity
                  key={style.id}
                  style={screenStyles.styleCard}
                  onPress={() => handleStyleSelect(style.id)}
                >
                  <View style={screenStyles.styleImageContainer}>
                    <Image source={{ uri: style.src }} style={screenStyles.styleImage} />
                    
                    {!isSubscribed && 
                      style.name !== "Anime" && 
                      style.name !== "OldSchool" && 
                      style.name !== "Lego" && (
                      <View style={screenStyles.styleLockOverlay}>
                        <Ionicons name="lock-closed" size={20} color="white" />
                      </View>
                    )}
                  </View>
                  
                  <View style={screenStyles.styleTextContainer}>
                    <Text style={screenStyles.styleName}>{style.DisplayName}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        
        {/* Bottom Navigation Bar */}
        <View style={screenStyles.bottomNavBar}>
          <TouchableOpacity 
            style={screenStyles.bottomNavButton}
          >
            <Ionicons name="grid-outline" size={24} color="white" />
            <Text style={screenStyles.bottomNavText}>Styles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={screenStyles.cameraButton}
            onPress={() => router.push("/camera")}
          >
            <View style={screenStyles.cameraIconContainer}>
              <Ionicons name="camera-outline" size={28} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={screenStyles.bottomNavButton}
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
            <Text style={screenStyles.bottomNavText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 40,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  
  // Section titles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
    marginLeft: 4,
  },
  
  // Featured style card
  featuredContainer: {
    marginBottom: 24,
  },
  featuredCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 220,
    width: "100%",
    backgroundColor: "#1E1D22",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    justifyContent: "flex-end",
  },
  featuredTextContainer: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
  },
  featuredDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  lockIconContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
  },
  
  // Styles grid
  stylesGridContainer: {
    marginBottom: 100, // Extra space for bottom nav
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  styleCard: {
    width: (width - 48) / 2, // 2 columns with spacing
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  styleImageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  styleImage: {
    width: "100%",
    height: "100%",
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
  styleTextContainer: {
    padding: 12,
  },
  styleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  
  // Bottom navigation
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
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
  cameraButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ACCENT_COLOR,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});