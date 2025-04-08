// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   Image
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { FontAwesome } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';

// const STORAGE_KEY = 'header_banner_dismissed';

// const HeaderBanner = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const checkDismissalStatus = async () => {
//       try {
//         const value = await AsyncStorage.getItem(STORAGE_KEY);
//         setIsVisible(value === null);
//       } catch (error) {
//         console.error('Error reading from AsyncStorage:', error);
//         setIsVisible(true);
//       }
//     };

//     checkDismissalStatus();
//   }, []);

//   const handleDismiss = async () => {
//     try {
//       await AsyncStorage.setItem(STORAGE_KEY, 'dismissed');
//       setIsVisible(false);
//     } catch (error) {
//       console.error('Error saving to AsyncStorage:', error);
//     }
//   };

//   if (!isVisible) {
//     return null;
//   }

//   return (
//     <SafeAreaView>
//       <LinearGradient
//         colors={['#4c669f', '#3b5998', '#192f6a']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradient}
//       >
//         <View style={styles.container}>
//           <View style={styles.iconContainer}>
//             <FontAwesome name="magic" size={24} color="#FFD700" />
//           </View>
//           <View style={styles.textContainer}>
//             <Text style={styles.headingText}>NEW UPDATE</Text>
//             <Text style={styles.message}>
//               New 13 gorgeous styles & AI text-to-image transformation
//             </Text>
//           </View>
//           <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
//             <FontAwesome name="times" size={20} color="white" />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     borderRadius: 15,

//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     width: '100%',
//     height: 70,
//     borderRadius: 15,
//   },
//   iconContainer: {
//     marginRight: 10,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   headingText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#FFD700',
//     letterSpacing: 1,
//   },
//   message: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: 'white',
//     lineHeight: 20,
//   },
//   closeButton: {
//     padding: 8,
//   },
// });

// export const resetBannerDismissal = async () => {
//   try {
//     await AsyncStorage.removeItem(STORAGE_KEY);
//     console.log('Banner dismissal state reset');
//     return true;
//   } catch (error) {
//     console.error('Error resetting banner dismissal state:', error);
//     return false;
//   }
// };

// export default HeaderBanner;