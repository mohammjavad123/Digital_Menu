import React, { useEffect, useState } from 'react';
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
import StarRating from 'react-native-star-rating-widget';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

const SERVER_URL = 'http://10.70.67.45:1337';

const MenuItemModal = ({ route, navigation }: any) => {
  const item = route?.params?.item;
  if (!item) return <Text>Item not found</Text>;

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(1);
  const [userComment, setUserComment] = useState('');
  const [userRating, setUserRating] = useState(4);
  const [reviews, setReviews] = useState<any[]>([]);

  const favorite = isFavorite(item.id);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/reviews?filters[menu][id][$eq]=${item.id}&populate=*`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched reviews:', data?.data);
        setReviews(data?.data || []);
      })
      .catch(err => console.error('Failed to fetch reviews:', err));
  }, [item.id]);

  const handleAddToCart = () => {
    addToCart({ ...item, quantity });
    navigation.goBack();
  };

  const handleCommentSubmit = async () => {
    if (!userComment.trim()) return;

    const menuId = item?.id || item?.menu?.id;
    if (!menuId) {
      console.error('❌ Cannot submit review: Menu ID is missing.');
      return;
    }

    const payload = {
      data: {
        text: userComment.trim(),
        rating: Math.round(userRating),
        menu: {
          connect: [menuId],
        },
      },
    };

    try {
      const res = await fetch(`${SERVER_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log('✅ Submit response:', json);

      const newReviewData = json?.data;
      if (newReviewData?.id && newReviewData?.attributes) {
        setReviews(prev => [newReviewData, ...prev]);
        setUserComment('');
      } else {
        console.warn('⚠️ Unexpected response from Strapi:', json);
      }
    } catch (error) {
      console.error('❌ Failed to submit review:', error);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r?.attributes?.rating ?? 0), 0) /
          reviews.length
        ).toFixed(1)
      : 'N/A';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `${SERVER_URL}${item?.image?.url}` }}
        style={styles.image}
      />

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

        <Text style={styles.price}>
          Total: €{(+item.price * quantity).toFixed(2)}
        </Text>

        <Pressable style={styles.orderButton} onPress={handleAddToCart}>
          <Text style={styles.orderButtonText}>Add to Cart</Text>
        </Pressable>

        <View style={styles.section}>
          <Text style={styles.subheading}>Your Rating</Text>
          <StarRating
            rating={userRating}
            onChange={setUserRating}
            starSize={32}
            color="#f1c40f"
          />
          <Text style={styles.ratingAverage}>Avg rating: {averageRating}/5</Text>
        </View>

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
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Recent Comments</Text>
          {reviews.length === 0 && (
            <Text style={styles.comment}>No comments yet.</Text>
          )}
          {reviews.slice(0, 10).map((entry, index) => {
            const review = entry?.attributes;
            if (!review) return null;

            return (
              <View key={index} style={styles.commentBox}>
                <StarRating
                  rating={review.rating ?? 0}
                  onChange={() => {}}
                  starSize={18}
                  enableSwiping={false}
                  enableHalfStar={false}
                  color="#f1c40f"
                />
                <Text style={styles.comment}>
                  {review.text || 'No comment provided.'}
                </Text>
              </View>
            );
          })}
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
    color: '#333',
    fontSize: 15,
  },
  commentBox: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
  },
  ratingAverage: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default MenuItemModal;
