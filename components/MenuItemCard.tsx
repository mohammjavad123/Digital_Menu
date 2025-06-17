// MenuItemCard.tsx
import React from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';

const MenuItemCard = ({ item, onPress }: any) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: { width: 100, height: 100 },
  info: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: '600' },
  description: { color: '#555', marginTop: 4 },
  price: { marginTop: 8, fontWeight: 'bold', color: '#222' },
});

export default MenuItemCard;
