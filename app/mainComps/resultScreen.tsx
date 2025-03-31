import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

// Define interface for component props
interface ResultScreenProps {
  image: string | null;
  resultImage: string | null;
  loading: boolean;
  selectedStyle: number | null;
  verificationNote: string;
  styles: Array<{id: number; name: string; src: string}>;
  handleRetry: () => void;
  handleDownload: () => Promise<void>;
  handleShare: () => Promise<void>;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  image,
  resultImage,
  loading,
  selectedStyle,
  verificationNote,
  styles,
  handleRetry,
  handleDownload,
  handleShare,
}) => {
  // Add state for progress simulation
  const [progress, setProgress] = useState(0);
  
  // Simulate progress when loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          // Slow down progress as it approaches 90%
          const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
          const newValue = prev + increment;
          return newValue > 90 ? 90 : newValue;
        });
      }, 500);
    } else {
      setProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  return (
    <SafeAreaView style={screenStyles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={screenStyles.resultHeader}>
        <TouchableOpacity onPress={handleRetry} style={screenStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={screenStyles.resultTitle}>Your Styled Image</Text>
        <View style={{width: 24}} />
      </View>
      
      <View style={screenStyles.resultContent}>
        {loading ? (
          <View style={screenStyles.loadingContainer}>
            <View style={screenStyles.blurredImageContainer}>
              <Image 
                source={{ uri: image || '' }} 
                style={screenStyles.blurredImage}
                resizeMode="cover"
                blurRadius={8}
              />
              <View style={screenStyles.loadingOverlay}>
                <View style={screenStyles.loadingContent}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={screenStyles.loadingText}>
                    Applying {styles.find(style => style.id === selectedStyle)?.name} style...
                  </Text>
                  
                  {/* Progress bar */}
                  <View style={screenStyles.progressBarContainer}>
                    <View 
                      style={[
                        screenStyles.progressBar, 
                        { width: `${progress}%` }
                      ]} 
                    />
                  </View>
                  
                  <Text style={screenStyles.loadingSubtext}>{Math.round(progress)}% complete</Text>
                </View>
              </View>
            </View>
          </View>
        ) : resultImage ? (
          <View style={screenStyles.resultImageContainer}>
            <Image 
              source={{ uri: resultImage }} 
              style={screenStyles.fullResultImage}
              resizeMode="contain"
            />
            
            {verificationNote ? (
              <Text style={screenStyles.verificationNote}>{verificationNote}</Text>
            ) : null}
            
            <View style={screenStyles.resultActions}>
              <TouchableOpacity 
                style={screenStyles.resultActionButton}
                onPress={handleDownload}
              >
                <Ionicons name="download-outline" size={22} color="white" />
                <Text style={screenStyles.resultActionText}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={screenStyles.resultActionButton}
                onPress={handleShare}
              >
                <Ionicons name="share-social-outline" size={22} color="white" />
                <Text style={screenStyles.resultActionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={screenStyles.resultActionButton}
                onPress={handleRetry}
              >
                <Ionicons name="refresh-outline" size={22} color="white" />
                <Text style={screenStyles.resultActionText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={screenStyles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#EC4899" />
            <Text style={screenStyles.errorText}>Something went wrong</Text>
            <TouchableOpacity 
              style={screenStyles.retryButton}
              onPress={handleRetry}
            >
              <Text style={screenStyles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  resultContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  blurredImageContainer: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  blurredImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay instead of gradient
  },
  loadingContent: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6', // Blue progress bar
    borderRadius: 3,
  },
  resultImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  fullResultImage: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 12,
  },
  verificationNote: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  resultActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  resultActionText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  retryText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultScreen;