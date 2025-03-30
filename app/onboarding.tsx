import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import MasonryList from '@react-native-seoul/masonry-list';

const MasonryGridExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743304461/2313_mr9leg.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743308123/download_6_mwv31t.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743307006/o2rxody4sugd6aydrgtl.png',
      'https://res.cloudinary.com/dzvttwdye/image/upload/v1743295995/Screenshot_2025-03-29_191414_cwkvsf.png',
 


    ];
    
    const newData = imageUrls.map((src, i) => ({
      id: i + 1,
      src: src,
      height: Math.floor(Math.random() * 100) + 100,
      width: Math.floor(Math.random() * 500) + 300,
    }));
    
    setData(newData);
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleEndReached = () => {
    if (!loading) {
      const moreData = data.map((item, index) => ({
        ...item,
        id: data.length + index + 1,
      }));
      setData([...data, ...moreData.slice(0, 10)]);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.itemContainer, { height: item.height }]}
      onPress={() => console.log(`Item ${item.id} pressed`)}
    >
      <Image 
        source={{ uri: item.src }}
        style={styles.itemImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MasonryList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const MasonryGrid = ({ 
  data = [], 
  numColumns = 2, 
  renderItem,
  keyExtractor = (item) => item.id?.toString() || Math.random().toString(),
  onEndReached,
  onEndReachedThreshold = 0.5,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
  ListHeaderComponent,
  ListEmptyComponent,
  ListFooterComponent,
  style,
}) => {
  return (
    <MasonryList
      data={data}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      style={style}
    />
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
    padding: 4,
  },
  itemContainer: {
    margin: 2,
    borderRadius: 0,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    borderRadius: 20,
    height: '100%',
  },
});

export default MasonryGridExample;
export { MasonryGrid };