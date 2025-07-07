import React from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';

const MenuItemCard = ({ item, onPress }: any) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.card,
      pressed && { opacity: 0.8 }
    ]}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
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
});

export default MenuItemCard;
