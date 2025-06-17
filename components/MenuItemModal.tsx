import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-ratings';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

const MenuItemModal = ({ route, navigation }: any) => {
  const { item } = route.params;
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(1);
  const [userComment, setUserComment] = useState('');
  const [submittedComments, setSubmittedComments] = useState<string[]>([]);
  const [userRating, setUserRating] = useState(4);

  const favorite = isFavorite(item.id);

  const handleAddToCart = () => {
    addToCart({ ...item, quantity });
    navigation.goBack();
  };

  const handleCommentSubmit = () => {
    if (userComment.trim()) {
      setSubmittedComments(prev => [userComment.trim(), ...prev.slice(0, 9)]);
      setUserComment('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Pressable onPress={() => toggleFavorite(item)}>
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={28}
              color={favorite ? '#e74c3c' : '#555'}
            />
          </Pressable>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.tagsRow}>
          {item.tags?.map((tag: string, idx: number) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Ingredients</Text>
          <Text style={{ color: '#444' }}>{item.ingredients?.join(', ') || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Rating</Text>
          <AirbnbRating
            defaultRating={userRating}
            size={20}
            showRating={false}
            onFinishRating={setUserRating}
            starContainerStyle={{ alignSelf: 'flex-start' }}
          />
          <Text style={{ marginTop: 6, color: '#555' }}>Your rating: {userRating}/5</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Quantity</Text>
          <View style={styles.quantityRow}>
            <Pressable
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.quantityBtn}
            >
              <Text style={styles.quantityText}>-</Text>
            </Pressable>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity(quantity + 1)}
              style={styles.quantityBtn}
            >
              <Text style={styles.quantityText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.price}>Total: €{(parseFloat(item.price.replace('€', '')) * quantity).toFixed(2)}</Text>

        <Pressable style={styles.orderButton} onPress={handleAddToCart}>
          <Text style={styles.orderButtonText}>Add to Cart</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.subheading}>Leave a Comment</Text>
          <TextInput
            value={userComment}
            onChangeText={setUserComment}
            placeholder="Type your comment here..."
            style={styles.commentInput}
            multiline
          />
          <Pressable style={styles.commentButton} onPress={handleCommentSubmit}>
            <Text style={styles.commentButtonText}>Submit</Text>
          </Pressable>
          {submittedComments.map((comment, index) => (
            <Text key={index} style={styles.comment}>{comment}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
    marginVertical: 12,
    fontSize: 16,
  },
  section: {
    marginTop: 18,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityBtn: {
    backgroundColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '500',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  orderButton: {
    marginTop: 16,
    backgroundColor: '#e67e22',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fefefe',
  },
  commentButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  comment: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
    color: '#333',
  },
  tag: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#444',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
});

export default MenuItemModal;
