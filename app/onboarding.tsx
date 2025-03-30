import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Dimensions, 
  ActivityIndicator, 
  TouchableOpacity, 
  Animated, 
  Text
} from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';
import useOnboarding from '@/hooks/useOnboarding';
import { useRouter } from 'expo-router';


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.3;

const MasonryGridWithBottomSheet = () => {
  const [leftColumnData, setLeftColumnData] = useState([]);
  const [rightColumnData, setRightColumnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  
  const { isOnboarded, isLoading: onboardingLoading, completeOnboarding } = useOnboarding();
  const router = useRouter();
  
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  const welcomeTextOpacity = useRef(new Animated.Value(0)).current;
  const imageAnimations = useRef({}).current;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isOnboarded && !onboardingLoading) {
      router.push('/');
    }
  }, [isOnboarded, onboardingLoading, router]);

  useEffect(() => {
    if ((leftColumnData.length > 0 && rightColumnData.length > 0) && !loading) {
      [...leftColumnData, ...rightColumnData].forEach(item => {
        imageAnimations[item.id] = new Animated.Value(0);
      });
      
      openBottomSheet();
    }
  }, [leftColumnData, rightColumnData, loading]);

  const fetchData = () => {
    setLoading(true);
    
    const imageUrls = [
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743311725/7b4328da-7486-4298-9ef6-29c38a433342_ybwbsk.jpg',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743311677/download_13_yna1rl.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743311677/download_14_vyfk4m.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743295994/anime_yfap6y.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743295994/main-2_w8ldom.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743295995/main-1_ogj0zg.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743313392/download_18_o1ak1c.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743315220/IMG_2693_wfsyno.jpg',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743304461/2313_mr9leg.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743308123/download_6_mwv31t.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743307006/o2rxody4sugd6aydrgtl.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743295995/Screenshot_2025-03-29_191414_cwkvsf.png',
    ];
    
    const leftData = imageUrls.filter((_, i) => i % 2 === 0).map((src, i) => ({
      id: `left-${i}`,
      src: src,
      height: Math.floor(Math.random() * 100) + 100,
      index: i * 2,
    }));
    
    const rightData = imageUrls.filter((_, i) => i % 2 === 1).map((src, i) => ({
      id: `right-${i}`,
      src: src,
      height: Math.floor(Math.random() * 100) + 100,
      index: i * 2 + 1,
    }));
    
    setLeftColumnData(leftData);
    setRightColumnData(rightData);
    setLoading(false);
  };

  const animateImagesSequentially = () => {
    const allItems = [...leftColumnData, ...rightColumnData].sort((a, b) => {
      return a.index - b.index;
    });
    
    const animations = allItems.map((item, i) => {
      return Animated.timing(imageAnimations[item.id], {
        toValue: 1,
        duration: 300,
        delay: i * 120,
        useNativeDriver: true,
      });
    });
    
    Animated.sequence([
      Animated.stagger(120, animations),
      
      Animated.timing(welcomeTextOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 300,
      })
    ]).start(() => {
      setShowWelcomeText(true);
    });
  };

  const openBottomSheet = () => {
    setBottomSheetOpen(true);
    
    Animated.timing(bottomSheetAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      animateImagesSequentially();
    });
  };

  const closeBottomSheet = () => {
    Animated.timing(welcomeTextOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    const resetAnimations = Object.values(imageAnimations).map(anim => {
      return Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      });
    });
    
    Animated.parallel(resetAnimations).start();
    
    Animated.timing(bottomSheetAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setBottomSheetOpen(false);
      setShowWelcomeText(false);
    });
  };

  const renderItem = (item, isLeft) => {
    const animValue = imageAnimations[item.id] || new Animated.Value(0);
    
    const opacity = animValue;
    const scale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.7, 1],
    });
    
    const top = isLeft
      ? item.index * (item.height + 4)
      : item.index * (item.height + 4);
    
    return (
      <Animated.View 
        key={item.id}
        style={[
          styles.itemContainer,
          { 
            height: item.height,
            top,
            opacity,
            transform: [{ scale }]
          }
        ]}
      >
        <Image 
          source={{ uri: item.src }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </Animated.View>
    );
  };

  const bottomSheetTranslateY = bottomSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_SHEET_HEIGHT, 0],
  });

  const handleContinue = async () => {
    await completeOnboarding();
    router.push('/');
  };

  if (loading || onboardingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <MasonryList
          data={[...leftColumnData, ...rightColumnData].sort((a, b) => a.index - b.index)}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const animValue = imageAnimations[item.id] || new Animated.Value(0);
            
            const opacity = animValue;
            const scale = animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.7, 1],
            });
            
            return (
              <Animated.View 
                style={[
                  styles.itemContainer,
                  { 
                    height: item.height,
                    opacity,
                    transform: [{ scale }]
                  }
                ]}
              >
                <Image 
                  source={{ uri: item.src }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              </Animated.View>
            );
          }}
          contentContainerStyle={styles.listContentContainer}
        />
        
        <Animated.View style={[
          styles.welcomeTextContainer,
          { opacity: welcomeTextOpacity }
        ]}>
          <Text style={styles.welcomeText}>Welcome to PixarAI</Text>
          <Text style={styles.welcomeSubtext}>All Images are generated by PixarAi</Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
  },
  listContentContainer: {
    padding: 2,
    paddingBottom: BOTTOM_SHEET_HEIGHT,
  },
  itemContainer: {
    margin: 2,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    borderRadius: 20,
    height: '100%',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: '#222222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  welcomeTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtext: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  continueButton: {
    backgroundColor: '#ffffff',
    width: '80%',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MasonryGridWithBottomSheet;