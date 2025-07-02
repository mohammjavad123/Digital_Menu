import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ImageBackground,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import MenuItemCard from '../components/MenuItemCard';
import { useFavorites } from '../contexts/FavoritesContext';

// ✅ Use background image if you want
const backgroundImage = require('../assets/images/istockphoto-1400194993-612x612.jpg');

// 🟨 Replace this with your machine's local IP if testing on device
const API_URL = 'http://10.70.67.45:1337/api/menus?populate=image';

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
        const imageUrl = imageData?.attributes?.formats?.small?.url || imageData?.attributes?.url;

        return {
          id: item.id.toString(),
          name: attrs.name,
          description: attrs.description || '',
          price: `€${parseFloat(attrs.price).toFixed(2)}`,
          category: attrs.category,
          image: imageUrl
            ? { uri: `http://10.70.67.45:1337${imageUrl}` }
            : null,
        };
      })
      .filter((item: any) => item.category === category || item.category === category?.trim());

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
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <MenuItemCard
            item={item}
            onPress={() => navigation.navigate('ItemDetail', { item })}
          />
        </View>
        <Pressable onPress={() => toggleFavorite(item)} style={styles.heart}>
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={24}
            color={favorite ? '#e74c3c' : '#444'}
          />
        </Pressable>
      </View>
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
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    marginBottom: 14,
    paddingRight: 10,
    paddingVertical: 6,
  },
  cardContent: {
    flex: 1,
  },
  heart: {
    padding: 10,
  },
});

export default MenuListScreen;
