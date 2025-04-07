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
const ACCENT_COLOR = "#f5f5f5";

export default function ResultScreen() {
  const { resultImage, styleId, prompt = "" } = useLocalSearchParams();
  const numericStyleId = styleId ? parseInt(styleId.toString(), 10) : null;
  
  const selectedStyle = stylesList.find(style => style.id === numericStyleId) || stylesList[0];

  const handleShare = async () => {
    try {
      await Share.share({
        url: Array.isArray(resultImage) ? resultImage[0] : resultImage,
        message: `Check out my ${selectedStyle?.DisplayName || "GoToon"} style image!`
      });
    } catch (error) {
      console.log("Error sharing image:", error);
      Toast.error("Failed to share image");
    }
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== "granted") {
        Toast.error("Permission needed to save image");
        return;
      }
      
      const filename = FileSystem.documentDirectory + `gotoon_${Date.now()}.jpg`;
      
      if (typeof resultImage === 'string' && resultImage.startsWith('data:image')) {
        const base64Data = resultImage.split('base64,')[1];
        await FileSystem.writeAsStringAsync(filename, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const asset = await MediaLibrary.createAssetAsync(filename);
        await MediaLibrary.createAlbumAsync("GoToon", asset, false);
        
        Toast.success("Image saved to gallery");
      } else {
        const result = await FileSystem.downloadAsync(
          Array.isArray(resultImage) ? resultImage[0] : resultImage,
          filename
        );
        
        const asset = await MediaLibrary.createAssetAsync(result.uri);
        await MediaLibrary.createAlbumAsync("GoToon", asset, false);
        
        Toast.success("Image saved to gallery");
      }
    } catch (error) {
      console.log("Error downloading image:", error);
      Toast.error("Failed to save image");
    }
  };

  const handleGenerateNew = () => {
    router.replace("/");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: Array.isArray(resultImage) ? resultImage[0] : resultImage }} style={styles.resultImage} />
          </View>
          
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
          
          <TouchableOpacity 
            style={styles.editorButton}
            onPress={handleGenerateNew}
          >
            <Text style={styles.editorButtonText}>Generate New</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 16,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,

  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    color: "white",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 30,
    marginTop: 30,
  },
  imageContainer: {
    width: "100%",
    height: height * 0.6,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  resultImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    backgroundColor: "#f5f5f5",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  editorButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});