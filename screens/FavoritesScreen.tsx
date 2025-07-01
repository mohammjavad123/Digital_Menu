import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import MenuItemCard from '../components/MenuItemCard';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../assets/images/istockphoto-1400194993-612x612.jpg');

const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const navigation = useNavigation();

  const handlePress = (item: any) => {
    navigation.navigate('ItemDetail', { item });
  };

  const renderItem = ({ item }: any) => (
    <MenuItemCard item={item} onPress={() => handlePress(item)} />
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>Your Favorites ❤️</Text>
        {favorites.length === 0 ? (
          <Text style={styles.empty}>You haven’t favorited anything yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
        )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c2c2c',
  },
  list: {
    paddingBottom: 40,
  },
  empty: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default FavoritesScreen;
