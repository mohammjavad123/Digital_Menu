import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import MenuItemCard from '../components/MenuItemCard';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const backgroundImage = require('../assets/images/istockphoto-1400194993-612x612.jpg');

const FavoritesScreen = () => {
  const { favorites, clearFavorites } = useFavorites();
  const navigation = useNavigation();

  const handlePress = (item: any) => {
    navigation.navigate('ItemDetail', { item });
  };

  const renderItem = ({ item }: { item: any }) => (
    <MenuItemCard item={item} onPress={() => handlePress(item)} />
  );

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Your Favorites ❤️</Text>
          {favorites.length > 0 && (
            <TouchableOpacity onPress={clearFavorites} style={styles.resetButton}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
              <Text style={styles.resetText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {favorites.length === 0 ? (
          <Text style={styles.empty}>You haven’t favorited anything yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c2c2c',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  resetText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
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
