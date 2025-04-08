import React from 'react'

import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Alert, ActivityIndicator, Dimensions, ScrollView, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import useOnboarding from "@/hooks/useOnboarding"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { Share } from "react-native"
import { useSuperwall } from "@/hooks/useSuperwall"

function _layout() {
  return (
    <SafeAreaView>
    <View style={screenStyles.bottomNavBar}>
      <TouchableOpacity 
        style={screenStyles.bottomNavButton}
      >
        <Ionicons name="grid-outline" size={24} color="white" />
        <Text style={screenStyles.bottomNavText}>Styles</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={screenStyles.bottomNavButton}
        onPress={() => router.push("/chat")}
      >
        <Ionicons name="chatbubble-outline" size={24} color="white" />
        <Text style={screenStyles.bottomNavText}>AI Chat</Text>
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
  )
}

export default _layout


const screenStyles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: Platform.OS === "ios" ? 10 : 10,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
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
    marginLeft: 4,
  },
  featuredContainer: {
    marginBottom: 24,
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