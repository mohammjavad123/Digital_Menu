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

const SERVER_URL = 'http://192.168.235.150:1337';

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
      const response = await fetch(`${SERVER_URL}/api/menus?populate=*`);
      const json = await response.json();
      const data = (json.data || []).map((item: any) => {
        const attr = item.attributes || item;
        return {
          id: item.id,
          ...attr,
          image: attr.image?.data?.attributes?.url || null,
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

  const uploadImage = async (): Promise<number | null> => {
    if (!imageUri) return null;

    const formData = new FormData();
    formData.append('files', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'menu-item.jpg',
    } as any);

    const res = await fetch(`${SERVER_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.jwt}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const json = await res.json();
    return json[0]?.id || null;
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
          name: 'menu-item.jpg',
        } as any);

        const uploadRes = await fetch(`${SERVER_URL}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.jwt}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const uploadJson = await uploadRes.json();
        imageId = uploadJson?.[0]?.id || null;
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

      const response = await fetch(`${SERVER_URL}/api/menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (editingItem?.id && response.ok) {
        try {
          const delRes = await fetch(`${SERVER_URL}/api/menus/${editingItem.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${user.jwt}` },
          });

          if (delRes.status !== 204) {
            const fallbackRes = await fetch(`${SERVER_URL}/api/menus?filters[name][$eq]=${editingItem.name}`, {
              headers: { Authorization: `Bearer ${user.jwt}` },
            });
            const fallbackJson = await fallbackRes.json();
            const oldId = fallbackJson.data?.[0]?.id;
            if (oldId) {
              await fetch(`${SERVER_URL}/api/menus/${oldId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.jwt}` },
              });
            }
          }
        } catch (err) {
          console.error('❌ Error deleting old item:', err);
        }
      }

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
    if (!user?.jwt) return;

    try {
      const response = await fetch(`${SERVER_URL}/api/menus/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      });

      if (response.status === 204) {
        await fetchItems();
      } else {
        const err = await response.text();
        console.warn('⚠️ Delete failed:', err);
      }
    } catch (error) {
      console.error('❌ Error deleting item:', error);
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setImageUri(null);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Manage Menu Items</Text>

      <Button title="➕ Add New Item" onPress={() => {
        resetForm();
        setModalVisible(true);
      }} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id?.toString() || ''}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => {
          const imageUrl = item.image ? (item.image.startsWith('http') ? item.image : `${SERVER_URL}${item.image}`) : null;
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

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
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

          <View style={{ marginTop: 10 }}>
            <Button title={editingItem ? 'Save Changes' : 'Add Item'} onPress={handleAddOrUpdate} />
            <View style={{ height: 10 }} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default ManageScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
  },
  subText: {
    fontSize: 14,
    color: '#555',
  },
  delete: {
    color: '#e74c3c',
    fontSize: 20,
    marginLeft: 10,
  },
  edit: {
    color: '#2980b9',
    fontSize: 20,
    marginLeft: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  modalContainer: {
    padding: 16,
    paddingTop: 40,
  },
  modalHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});