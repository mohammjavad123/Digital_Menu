import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

// ✅ Fixed image map with valid paths
const imageMap: Record<string, any> = {
  'download.jpeg': require('../assets/images/download.jpeg'),
  'istockphoto-1400194993-612x612.jpg': require('../assets/images/istockphoto-1400194993-612x612.jpg'),
  'restaurant-bg.jpg': require('../assets/images/istockphoto-1400194993-612x612.jpg'), // background image
};

// ✅ Menu items with image keys only
const menuTypes = [
  {
    id: '1',
    name: 'Lunch',
    subtitle: 'Served until 4PM',
    image: 'download.jpeg',
  },
  {
    id: '2',
    name: 'Dinner',
    subtitle: 'Evening specials',
    image: 'istockphoto-1400194993-612x612.jpg',
  },
  {
    id: '3',
    name: 'Coffee',
    subtitle: 'Hot & Cold drinks',
    image: 'download.jpeg',
  },
  {
    id: '4',
    name: 'Breakfast',
    subtitle: 'Start your day right',
    image: 'download.jpeg', // Reusing download.jpeg
  },
];

const MenuTypeScreen = () => {
  const navigation = useNavigation<any>();

  const handleSelect = (category: string) => {
    navigation.navigate('MenuList', { category });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleSelect(item.name)} style={styles.cardWrapper}>
      <ImageBackground
        source={imageMap[item.image]}
        style={styles.card}
        imageStyle={styles.cardImage}
        blurRadius={1}
      >
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={imageMap['restaurant-bg.jpg']}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Choose a Menu</Text>
        <FlatList
          data={menuTypes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
        />
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
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // moderate fade
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2c2c2c',
  },
  content: {
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImage: {
    borderRadius: 16,
  },
  cardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#f0f0f0',
    fontSize: 13,
  },
});

export default MenuTypeScreen;
