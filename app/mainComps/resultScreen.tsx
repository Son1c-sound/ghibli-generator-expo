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
import { Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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

  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
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


  const handleSaveImage = async () => {
    if (isSaving || isSaved) return;
    
    setIsSaving(true);
    try {
      await handleDownload();
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save image to gallery.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f172a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
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
              
              <TouchableOpacity 
                  style={[
                    screenStyles.saveButton,
                    (isSaving || isSaved) && screenStyles.saveButtonDisabled
                  ]}
                  onPress={handleSaveImage}
                  disabled={isSaving || isSaved}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="black" />
                  ) : isSaved ? (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="black" />
                      <Text style={screenStyles.saveButtonText}>Saved to Gallery</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={20} color="black" />
                      <Text style={screenStyles.saveButtonText}>Save Image</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                <View style={screenStyles.secondaryButtonsContainer}>
                  <TouchableOpacity 
                    style={screenStyles.tryAgainButton}
                    onPress={handleRetry}
                  >
                    <Ionicons name="refresh-outline" size={18} color="white" />
                    <Text style={screenStyles.tryAgainButtonText}>Try Again</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={screenStyles.shareButton}
                    onPress={handleShare}
                  >
                    <Ionicons name="share-social-outline" size={18} color="white" />
                    <Text style={screenStyles.shareButtonText}>Share</Text>
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
    </LinearGradient>
  );
};

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
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
    marginTop: -90,
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  resultImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  fullResultImage: {
    width: width * 1,
    height: width * 1,
  },
  aiWarningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    maxWidth: width * 0.9,
    marginBottom: 22,
  },
  aiWarningText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
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
  saveButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 100,
    width: '90%',
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 12,
  },
  tryAgainButton: {
    backgroundColor: '#2563EB', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 100,
    width: '48%',
  },
  tryAgainButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  shareButton: {
    backgroundColor: '#10B981', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 100,
    width: '48%',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
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