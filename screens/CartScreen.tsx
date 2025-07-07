import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { useCart } from '../contexts/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const CartScreen = () => {
  const { cart, updateCart } = useCart();

  const handleIncrease = (itemId: string) => {
    const updated = cart.map(item =>
      item.id === itemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    updateCart(updated);
    showToast('Increased quantity');
  };

  const handleDecrease = (itemId: string) => {
    const updated = cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
        : item
    );
    updateCart(updated);
    showToast('Decreased quantity');
  };

  const handleRemove = (itemId: string, name: string) => {
    Alert.alert('Remove item', `Remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const filtered = cart.filter(item => item.id !== itemId);
          updateCart(filtered);
          showToast(`${name} removed from cart`);
        },
      },
    ]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    showToast('Order placed! 🎉');
    updateCart([]);
  };

  const showToast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      backgroundColor: '#444',
    });
  };

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price.replace('€', '')) * (item.quantity || 1),
    0
  );

  const renderItem = ({ item }: any) => (
  <SafeAreaView style={styles.container}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>€{item.price.replace('€', '')}</Text>
        <View style={styles.quantityRow}>
          <Pressable onPress={() => handleDecrease(item.id)} style={styles.qtyButton}>
            <Text style={styles.qtyButtonText}>-</Text>
          </Pressable>
          <Text style={styles.qty}>{item.quantity || 1}</Text>
          <Pressable onPress={() => handleIncrease(item.id)} style={styles.qtyButton}>
            <Text style={styles.qtyButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
      <Pressable onPress={() => handleRemove(item.id, item.name)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>×</Text>
      </Pressable>
    </SafeAreaView>
  );

  return (
  <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id + item.name}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: €{total.toFixed(2)}</Text>
        <Pressable onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
  price: { color: '#444', marginVertical: 4 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyButton: {
    backgroundColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  qtyButtonText: { fontSize: 18 },
  qty: { marginHorizontal: 10, fontSize: 16 },
  removeButton: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 8,
  },
  removeButtonText: { fontSize: 20, color: '#d63031' },
  totalContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 12,
    marginTop: 'auto',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 12,
  },
  checkoutButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 10,
  },
  checkoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CartScreen;
