import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Share
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { stylesList } from "../mainComps/stylesData";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Toast } from "toastify-react-native";

const { width, height } = Dimensions.get("window");
const ACCENT_COLOR = "#3B82F6";

export default function ResultScreen() {
  const { resultImage, styleId, prompt = "" } = useLocalSearchParams();
  const numericStyleId = styleId ? parseInt(styleId.toString(), 10) : null;
  
  // Find the selected style
  const selectedStyle = stylesList.find(style => style.id === numericStyleId) || stylesList[0];

  // Generate a description if not provided
  const promptDescription = prompt || 
    `A ${selectedStyle?.DisplayName || "styled"} character with detailed features, vibrant colors, and artistic composition.`;

  const handleShare = async () => {
    try {
      await Share.share({
        url: resultImage,
        message: `Check out my ${selectedStyle?.DisplayName || "GoToon"} style image!`
      });
    } catch (error) {
      console.log("Error sharing image:", error);
      Toast.error("Failed to share image");
    }
  };

  const handleDownload = async () => {
    try {
      // Request permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== "granted") {
        Toast.error("Permission needed to save image");
        return;
      }
      
      // Create a unique filename
      const filename = FileSystem.documentDirectory + `gotoon_${Date.now()}.jpg`;
      
      // Handle base64 images
      if (resultImage.startsWith('data:image')) {
        const base64Data = resultImage.split('base64,')[1];
        await FileSystem.writeAsStringAsync(filename, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(filename);
        await MediaLibrary.createAlbumAsync("GoToon", asset, false);
        
        Toast.success("Image saved to gallery");
      } else {
        // Download the file to local filesystem
        const result = await FileSystem.downloadAsync(resultImage, filename);
        
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(result.uri);
        await MediaLibrary.createAlbumAsync("GoToon", asset, false);
        
        Toast.success("Image saved to gallery");
      }
    } catch (error) {
      console.log("Error downloading image:", error);
      Toast.error("Failed to save image");
    }
  };

  const handleOpenEditor = () => {
    // Navigate to editor screen (to be implemented)
    Toast.info("Editor feature coming soon");
  };

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
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Image Container */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: resultImage }} style={styles.resultImage} />
          </View>
          
          {/* Result Info */}
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.titleText}>Prompt Result</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy-outline" size={22} color="white" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.promptText}>
              "{promptDescription}"
            </Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconButton} onPress={handleDownload}>
              <Ionicons name="download-outline" size={24} color="white" />
              <Text style={styles.iconText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={24} color="white" />
              <Text style={styles.iconText}>Share</Text>
            </TouchableOpacity>
          </View>
          
          {/* Editor Button */}
          <TouchableOpacity 
            style={styles.editorButton}
            onPress={handleOpenEditor}
          >
            <Text style={styles.editorButtonText}>Open Editor</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(50, 50, 70, 0.6)",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(50, 50, 70, 0.6)",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  imageContainer: {
    width: "100%",
    height: height * 0.55,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    marginBottom: 16,
  },
  resultImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    backgroundColor: "rgba(30, 30, 40, 0.5)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  copyButton: {
    padding: 4,
  },
  promptText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 90,
  },
  iconText: {
    color: "white",
    marginTop: 8,
    fontSize: 14,
  },
  editorButton: {
    backgroundColor: "white",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  editorButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "600",
  },
});