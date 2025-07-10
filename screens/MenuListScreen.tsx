import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../contexts/FavoritesContext';
import { SERVER_URL } from '../config'; // adjust path if needed

const backgroundImage = require('../assets/images/istockphoto-1400194993-612x612.jpg');
// const API_URL = 'http://192.168.174.1:1337/api/menus?populate=image';
const API_URL = `${SERVER_URL}/api/menus?populate=image`;
console.log('✅ SERVER_URL:', API_URL);
const MenuListScreen = ({ route, navigation }: any) => {
  const category = route?.params?.category;
  const { toggleFavorite, isFavorite } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(API_URL);
      const allItems = res.data.data;

      const filteredItems = allItems
        .map((item: any) => {
          const attrs = item.attributes;
          const imageData = attrs.image?.data;
          const imageUrl =
            imageData?.attributes?.formats?.small?.url || imageData?.attributes?.url;

          return {
            id: item.id.toString(),
            name: attrs.name,
            description: attrs.description || '',
            price: `€${parseFloat(attrs.price).toFixed(2)}`,
            category: attrs.category,
            image: imageUrl
              ?  { uri: `${SERVER_URL}${imageUrl}` }
              : null,
          };
        })
        .filter(
          (item: any) =>
            item.category === category || item.category === category?.trim()
          );

      setItems(filteredItems);
    } catch (err: any) {
      console.error('Failed to fetch menu items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const renderItem = ({ item }: any) => {
    const favorite = isFavorite(item.id);
    return (
      <Pressable
        onPress={() => navigation.navigate('ItemDetail', { item })}
        style={({ pressed }) => [
          styles.card,
          pressed && { opacity: 0.9 },
        ]}
      >
        {item.image?.uri && (
          <Image
            source={{ uri: item.image.uri }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description || 'No description available'}
          </Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        <Pressable onPress={() => toggleFavorite(item)} style={styles.heart}>
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={24}
            color={favorite ? '#e74c3c' : '#aaa'}
          />
        </Pressable>
      </Pressable>
    );
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#e74c3c" />;

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>{category}</Text>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c2c2c',
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 10,
    gap: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    color: '#e67e22',
    marginTop: 8,
    fontWeight: 'bold',
  },
  heart: {
    padding: 6,
  },
});

export default MenuListScreen;
