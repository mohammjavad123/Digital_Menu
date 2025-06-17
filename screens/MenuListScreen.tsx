import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ImageBackground,
  Pressable,
} from 'react-native';
import Toast from 'react-native-root-toast';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

const sharedImage = require('../assets/images/download.jpeg');
const backgroundImage = require('../assets/images/istockphoto-1400194993-612x612.jpg');

const mockData: Record<string, any[]> = {
  Breakfast: [
    { id: '1', name: 'Pancakes', description: 'Fluffy pancakes with maple syrup and fruit.', price: '€5.99', image: sharedImage },
    { id: '2', name: 'Omelette', description: 'Cheese omelette with herbs and toast.', price: '€4.50', image: sharedImage },
    { id: '3', name: 'French Toast', description: 'Cinnamon toast topped with strawberries.', price: '€6.25', image: sharedImage },
    { id: '4', name: 'Breakfast Bowl', description: 'Granola, yogurt, and seasonal fruit.', price: '€5.00', image: sharedImage },
  ],
  Lunch: [
    { id: '1', name: 'Grilled Chicken Sandwich', description: 'With fries and coleslaw.', price: '€8.99', image: sharedImage },
    { id: '2', name: 'Caesar Salad', description: 'Romaine, croutons, parmesan.', price: '€7.50', image: sharedImage },
    { id: '3', name: 'Club Sandwich', description: 'Triple-layered with chicken and bacon.', price: '€9.25', image: sharedImage },
    { id: '4', name: 'Tomato Soup', description: 'With garlic bread.', price: '€6.75', image: sharedImage },
  ],
  Dinner: [
    { id: '1', name: 'Steak & Potatoes', description: 'Grilled steak with roasted potatoes.', price: '€14.99', image: sharedImage },
    { id: '2', name: 'Spaghetti Bolognese', description: 'Pasta with meat sauce.', price: '€11.50', image: sharedImage },
    { id: '3', name: 'Grilled Salmon', description: 'With lemon butter sauce.', price: '€13.25', image: sharedImage },
    { id: '4', name: 'Veggie Stir-Fry', description: 'Mixed vegetables in soy glaze.', price: '€10.00', image: sharedImage },
  ],
  Coffee: [
    { id: '1', name: 'Espresso', description: 'Strong and bold shot of coffee.', price: '€2.00', image: sharedImage },
    { id: '2', name: 'Cappuccino', description: 'Espresso with steamed milk and foam.', price: '€2.75', image: sharedImage },
    { id: '3', name: 'Iced Latte', description: 'Chilled espresso with milk and ice.', price: '€3.50', image: sharedImage },
    { id: '4', name: 'Mocha', description: 'Coffee with chocolate and whipped cream.', price: '€3.75', image: sharedImage },
  ],
};

const MenuListScreen = ({ route, navigation }: any) => {
  const category = route?.params?.category;
  const items = mockData[category] || [];

  const { toggleFavorite, isFavorite } = useFavorites();

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
