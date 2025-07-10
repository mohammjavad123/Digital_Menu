import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SERVER_URL } from '../config'; // adjust path if needed

// const SERVER_URL = 'http://10.70.138.175:1337';

const ManageScreen = ({ user }: any) => {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable media library access in settings.');
      }
    })();

    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/menus?populate=*&publicationState=preview`);
      const json = await response.json();

      const data = (json.data || []).map((item: any) => {
        const attr = item.attributes || item;

        return {
          id: item.id,
          name: attr.name,
          price: attr.price,
          category: attr.category,
          description: attr.description,
          createdAt: attr.createdAt,
          updatedAt: attr.updatedAt,
          image: attr.image?.data?.attributes?.url
            ? `${SERVER_URL}${attr.image.data.attributes.url}`
            : null,
          reviews:
            attr.reviews?.data?.map((r: any) => ({
              id: r.id,
              ...r.attributes,
            })) || [],
        };
      });

      setItems(data);
    } catch (error) {
      console.error('❌ Error fetching items:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('❌ Error picking image:', err);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setImageUri(null);
    setEditingItem(null);
  };

  const handleAddOrUpdate = async () => {
    if (!name || !price || !category) {
      Alert.alert('Missing Information', 'Please fill in name, price, and category.');
      return;
    }

    if (!user?.jwt) {
      Alert.alert('Authentication Error', 'You must be logged in.');
      return;
    }

    try {
      let imageId = null;

      if (imageUri) {
        const formData = new FormData();
        formData.append('files', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'menu-image.jpg',
        } as any);

        const uploadResponse = await fetch(`${SERVER_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        imageId = uploadResult[0]?.id || null;
      }

      const payload = {
        data: {
          name,
          price,
          category,
          description: 'Updated via app',
          ...(imageId ? { image: imageId } : {}),
        },
      };

      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem
        ? `${SERVER_URL}/api/menus/${editingItem.id}`
        : `${SERVER_URL}/api/menus`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchItems();
        resetForm();
        setModalVisible(false);
      } else {
        Alert.alert('Save Failed', result?.error?.message || 'Check your data and try again.');
      }
    } catch (error) {
      console.error('❌ Error saving item:', error);
      Alert.alert('Error', 'Could not connect to the server.');
    }
  };

  const handleDelete = async (itemId: number) => {
    if (!user?.jwt) {
      Alert.alert('Not authorized');
      return;
    }

    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${SERVER_URL}/api/menus/${itemId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${user.jwt}`,
              },
            });

            if (response.ok) {
              await fetchItems();
              Alert.alert('Deleted', 'Item successfully deleted.');
            } else {
              Alert.alert('Delete Failed', 'Server returned error.');
            }
          } catch (error) {
            console.error('❌ Error deleting item:', error);
            Alert.alert('Error', 'Could not delete item.');
          }
        },
      },
    ]);
  };

  const handleDeleteReview = async (reviewId: number, menuId: number) => {
    if (!user?.jwt) {
      Alert.alert('Not authorized');
      return;
    }

    Alert.alert('Delete Review', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${SERVER_URL}/api/reviews/${reviewId}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${user.jwt}`,
              },
            });

            if (res.ok) {
              const response = await fetch(`${SERVER_URL}/api/menus?populate=*&publicationState=preview`);
              const json = await response.json();
              const updatedData = (json.data || []).map((item: any) => {
                const attr = item.attributes || item;

                return {
                  id: item.id,
                  name: attr.name,
                  price: attr.price,
                  category: attr.category,
                  description: attr.description,
                  createdAt: attr.createdAt,
                  updatedAt: attr.updatedAt,
                  image: attr.image?.data?.attributes?.url
                    ? `${SERVER_URL}${attr.image.data.attributes.url}`
                    : null,
                  reviews:
                    attr.reviews?.data?.map((r: any) => ({
                      id: r.id,
                      ...r.attributes,
                    })) || [],
                };
              });

              setItems(updatedData);
              const updatedItem = updatedData.find((item) => item.id === menuId);
              setEditingItem(updatedItem || null);

              Alert.alert('Deleted', 'Comment deleted');
            } else {
              Alert.alert('Failed', 'Could not delete comment');
            }
          } catch (err) {
            console.error('❌ Error deleting review:', err);
            Alert.alert('Error', 'Could not delete comment');
          }
        },
      },
    ]);
  };

  const openEditModal = async (item: any) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/menus/${item.id}?populate=reviews,image`);
    const json = await response.json();
    const attr = json.data.attributes;

    const updatedItem = {
      id: json.data.id,
      name: attr.name,
      price: attr.price,
      category: attr.category,
      description: attr.description,
      image: attr.image?.data?.attributes?.url
        ? `${SERVER_URL}${attr.image.data.attributes.url}`
        : null,
      reviews:
        attr.reviews?.data?.map((r: any) => ({
          id: r.id,
          ...r.attributes,
        })) || [],
    };

    setEditingItem(updatedItem);
    setName(updatedItem.name);
    setPrice(updatedItem.price.toString());
    setCategory(updatedItem.category);
    setImageUri(null);
    setModalVisible(true);
  } catch (err) {
    console.error('❌ Failed to fetch item details:', err);
    Alert.alert('Error', 'Could not load item details.');
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Manage Menu Items</Text>

      <Button title="➕ Add New Item" onPress={() => { resetForm(); setModalVisible(true); }} />
      {/* <View style={{ marginVertical: 8 }}>
        <Button title="🔁 Reload Items" onPress={fetchItems} color="#555" />
      </View> */}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id?.toString() || ''}
        extraData={items}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => {
          const imageUrl = item.image
            ? item.image.startsWith('http')
              ? item.image
              : `${SERVER_URL}${item.image}`
            : null;
          return (
            <View style={styles.itemCard}>
              {imageUrl && <Image source={{ uri: imageUrl }} style={styles.itemImage} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.subText}>€{item.price} | {item.category}</Text>
              </View>
              <TouchableOpacity onPress={() => openEditModal(item)}>
                <Text style={styles.edit}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>🗑</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Modal visible={modalVisible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
            <Ionicons name="close-outline" size={28} color="#333" />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
            <Text style={styles.modalHeading}>{editingItem ? 'Edit Item' : 'Add New Item'}</Text>

            <TextInput style={styles.input} placeholder="Item Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <Picker selectedValue={category} onValueChange={setCategory} style={styles.input}>
              <Picker.Item label="Select Category..." value="" />
              <Picker.Item label="Lunch" value="Lunch" />
              <Picker.Item label="Dinner" value="Dinner" />
              <Picker.Item label="Coffee" value="Coffee" />
              <Picker.Item label="Breakfast" value="Breakfast" />
            </Picker>

            <Button title="Pick New Image" onPress={pickImage} />
            {imageUri && <Image source={{ uri: imageUri }} style={{ height: 150, marginVertical: 10, borderRadius: 8 }} />}

            {editingItem?.reviews?.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Comments</Text>
                {editingItem.reviews.map((review: any) => (
                  <View
                    key={review.id}
                    style={{
                      padding: 10,
                      backgroundColor: '#f9f9f9',
                      borderRadius: 8,
                      marginBottom: 10,
                      elevation: 2,
                    }}
                  >
                    <Text style={{ fontSize: 14, marginBottom: 6 }}>{review.text}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, color: '#777' }}>⭐ {review.rating}</Text>
                      <TouchableOpacity onPress={() => handleDeleteReview(review.id, editingItem.id)}>
                        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={{ marginTop: 10 }}>
              <Button title={editingItem ? 'Save Changes' : 'Add Item'} onPress={handleAddOrUpdate} />
              <View style={{ height: 10 }} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageScreen;

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemImage: { width: 60, height: 60, marginRight: 10, borderRadius: 6, backgroundColor: '#eee' },
  itemText: { fontSize: 18, fontWeight: '500' },
  subText: { fontSize: 14, color: '#555' },
  delete: { color: '#e74c3c', fontSize: 20, marginLeft: 10 },
  edit: { color: '#2980b9', fontSize: 20, marginLeft: 10 },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 12 },
  modalContainer: { padding: 16, paddingTop: 40 },
  modalHeading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  closeIcon: { position: 'absolute', top: 10, right: 16, zIndex: 1 },
});
