import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import ToastManager, { Toast } from "toastify-react-native";

export interface StyleItem {
  id: number;
  name: string;
  src: string;
  DisplayName: string
  category?: string;
}

interface ImageGenerationRequest {
  imageBase64: string;
  style: string;
}

interface ImageGenerationResponse {
  imageBase64?: string;
  error?: string;
}

export const processSelectedImage = async (
  selectedImage: string, 
  setImage: (image: string) => void,
  setImageSize?: (size: number) => void,
  setResultImage?: (image: string | null) => void,
  setShowResultScreen?: (show: boolean) => void
): Promise<void> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(selectedImage);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }
    const fileSizeInMB = fileInfo.size! / 1024 / 1024;
    
    if (setImageSize) {
      setImageSize(fileSizeInMB);
    }
    
    if (fileSizeInMB > 5) {
      Alert.alert(
        'Image Too Large', 
        `The selected image is ${fileSizeInMB.toFixed(2)}MB. Images larger than 5MB may cause issues. Do you want to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Continue', onPress: () => {
            setImage(selectedImage);
            if (setResultImage) setResultImage(null);
            if (setShowResultScreen) setShowResultScreen(false);
          }}
        ]
      );
    } else {
      setImage(selectedImage);
      if (setResultImage) setResultImage(null);
      if (setShowResultScreen) setShowResultScreen(false);
    }
  } catch (error) {
    console.error('Error processing selected image:', error);
    Alert.alert('Error', 'Failed to process your image');
  }
};

export const generateStyledImage = async (
  image: string | null,
  selectedStyle: number | null,
  styles: StyleItem[],
  setLoading: (loading: boolean) => void,
  setShowResultScreen?: ((show: boolean) => void) | null,
  setResultImage?: ((image: string | null) => void) | null
): Promise<string | void> => {
  if (!image) {
    Alert.alert('No Image', 'Please select an image first');
    return;
  }
  
  if (!selectedStyle) {
    Alert.alert('No Style', 'Please select a style first');
    return;
  }
  
  try {
    setLoading(true);
    // Only set showResultScreen if the callback exists (old UI flow)
    if (setShowResultScreen) {
      setShowResultScreen(true);
    }
    
    let imageBase64;
    try {
      imageBase64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log(`Image Base64 length: ${imageBase64.length}`);
      
      if (!imageBase64 || imageBase64.length < 100) {
        throw new Error('Failed to properly encode image');
      }
    } catch (readError) {
      console.error('Error reading image:', readError);
      Alert.alert('Error', 'Failed to process your image. Please try again or select a different image.');
      setLoading(false);
      if (setShowResultScreen) setShowResultScreen(false);
      return;
    }
    
    const selectedStyleObj = styles.find(style => style.id === selectedStyle);
    const apiStyle = selectedStyleObj ? selectedStyleObj.name : 'anime';
    
    const requestData: ImageGenerationRequest = {
      imageBase64: imageBase64,
      style: apiStyle
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      console.log('Sending request to server...');
      const response = await fetch('https://ghibil-studio-server-production.up.railway.app/api/generate-image', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', response.status, errorText);
        throw new Error(`Server error: ${response.status}. ${errorText || ''}`);
      }
      
      let data: ImageGenerationResponse;
      try {
        const responseText = await response.text();
        console.log('Response received, length:', responseText.length);
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Failed to parse server response');
      }
      
      if (data.imageBase64) {
        console.log('Received image base64, length:', data.imageBase64.length);
        const resultImageUri = `data:image/jpeg;base64,${data.imageBase64}`;
        
        // For old UI flow
        if (setResultImage) {
          setResultImage(resultImageUri);
        }
        
        // Return the result image URI for the new UI flow
        return resultImageUri;
      } else {
        console.error('No image in response:', data);
        throw new Error('No image received from server');
      }
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out. The server took too long to respond.');
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate the styled image';
    Alert.alert('Error', errorMessage);
    if (setShowResultScreen) setShowResultScreen(false);
    throw error;
  } finally {
    setLoading(false);
  }
};

// Alias for backward compatibility
export const generateImage = generateStyledImage;

export const handleDownload = async (
  resultImage: string | null,
  handleShare?: () => Promise<void>
): Promise<void> => {
  try {
    if (!resultImage) {
      Alert.alert('Error', 'No image available to save');
      return;
    }
    
    const base64Data = resultImage.includes('base64,') 
      ? resultImage.split('base64,')[1] 
      : resultImage;
    
    const fileName = `anime_convert_${Date.now()}.jpg`;
    const fileUri = FileSystem.cacheDirectory + fileName;
    
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status === 'granted') {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      Toast.success("Image Saved");
    } else {
      Toast.success('Permission needed');
    }
  } catch (error) {
    console.error('Error saving image:', error);
    Toast.success('Failed to save the image');
  }
};

export const handleShare = async (
  resultImage: string | null,
  Share: any
): Promise<void> => {
  try {
    if (!resultImage) return;
    
    const base64Data = resultImage.includes('base64,') 
      ? resultImage.split('base64,')[1] 
      : resultImage;
      
    const fileName = `anime_convert_${Date.now()}.jpg`;
    const fileUri = FileSystem.cacheDirectory + fileName;
    
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    await Share.share({
      url: fileUri,
      message: 'Check out my anime-styled image!'
    });
  } catch (error) {
    console.error('Error sharing image:', error);
    Alert.alert('Error', 'Failed to share the image');
  }
};