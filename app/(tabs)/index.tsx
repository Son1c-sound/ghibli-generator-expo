import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Alert, ActivityIndicator, Dimensions, ScrollView, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import useOnboarding from "@/hooks/useOnboarding"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import ResultScreen from "../mainComps/resultScreen"
import { useSuperwall } from "@/hooks/useSuperwall"
import { SUPERWALL_TRIGGERS } from "../config/superwall"
import { processSelectedImage, generateImage as generateStyledImage, handleDownload as saveImage, handleShare as shareImage, StyleItem } from "../utils/imageUtils"
import { stylesList } from "../mainComps/stylesData"
import SubscriptionBanner from "../FreePlanHeader"

const { width } = Dimensions.get("window")
const ACCENT_COLOR = "#f5f5f5"

export default function AnimeConverter() {
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showResultScreen, setShowResultScreen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
  
  const categories = [...new Set(styles.map(style => style.category))].filter(Boolean)
  
  const handleStyleSelect = (styleId:any) => {
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
    router.push({
      pathname: "/upload",
      params: { styleId }
    })
  }

  const filteredStyles = selectedCategory 
    ? styles.filter(style => style.category === selectedCategory)
    : styles
  
  const ghibliStyle = styles.find(style => style.name === "Ghibli") || styles[0]
  
  const otherStyles = selectedCategory
    ? filteredStyles.filter(style => style.id !== ghibliStyle.id)
    : styles.filter(style => style.id !== ghibliStyle.id)

  if (showResultScreen) {
    return (
      <ResultScreen
      />
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#000000', '#000000', '#000000']}
        locations={[0, 0.35, 0.7]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={screenStyles.safeAreaContainer}>
          <StatusBar barStyle="light-content" />
          <ScrollView style={screenStyles.scrollContainer} showsVerticalScrollIndicator={false}>  
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
                      Transform your photos into magical Anime-inspired art
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
            <SubscriptionBanner />
            <View style={screenStyles.stylesGridContainer}>
              <View style={screenStyles.categoryFiltersContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={screenStyles.categoryFiltersScroll}
              >
       
                <TouchableOpacity
                  style={[
                    screenStyles.categoryFilterButton,
                    selectedCategory === null && screenStyles.categoryFilterButtonActive
                  ]}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={[
                    screenStyles.categoryFilterText,
                    selectedCategory === null && screenStyles.categoryFilterTextActive
                  ]}>All</Text>
                </TouchableOpacity>
                
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      screenStyles.categoryFilterButton,
                      selectedCategory === category && screenStyles.categoryFilterButtonActive
                    ]}
                    onPress={() => setSelectedCategory(category as any)}
                  >
                    <Text style={[
                      screenStyles.categoryFilterText,
                      selectedCategory === category && screenStyles.categoryFilterTextActive
                    ]}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

            </View>
              <View style={screenStyles.stylesGrid}>
                {otherStyles.map((style, index) => (
                  <TouchableOpacity
                    key={style.id}
                    style={screenStyles.styleCard}
                    onPress={() => handleStyleSelect(style.id)}
                  >
                    <View style={screenStyles.styleImageContainer}>
                      <Image source={{ uri: style.src }} style={screenStyles.styleImage} />
                      
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={screenStyles.styleGradient}
                      >
                        <View style={screenStyles.styleTextContainer}>
                          <Text style={screenStyles.styleName}>{style.DisplayName}</Text>
                        </View>
                      </LinearGradient>
                      
                      {!isSubscribed && 
                        style.name !== "Anime" && 
                        style.name !== "OldSchool" && 
                        style.name !== "Lego" && (
                        <View style={screenStyles.styleLockOverlay}>
                          <Ionicons name="lock-closed" size={20} color="white" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={screenStyles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
              
      
<View style={screenStyles.bottomNavContainer}>

</View>
    </GestureHandlerRootView>
  )
}

const screenStyles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
    marginTop: 30,

  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 40,
    marginBottom: 2,
  },

  categoryFiltersContainer: {
    marginBottom: 16,
  },
  categoryFiltersScroll: {
    paddingHorizontal: 4,
    marginTop: 8,
  },
  categoryFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryFilterButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  categoryFilterText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    fontSize: 14,
  },
  categoryFilterTextActive: {
    color: "white",
    fontWeight: "600",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
    marginTop: 2,
    marginLeft: 4,
  },
  featuredContainer: {
    marginBottom: 6,
  },
  featuredCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 220,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  stylesGridContainer: {
    marginBottom: 20,
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  styleCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
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
  styleGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "flex-end",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  styleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  bottomPadding: {
    height: 90,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    borderTopWidth: 0.3,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
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