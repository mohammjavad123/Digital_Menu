import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const menuTypes = [
//   {
//     id: '1',
//     name: 'Lunch',
//     subtitle: 'Served until 4PM',
//     image: require('../assets/images/downl/oad.jpeg'),
//   },
  {
    id: '2',
    name: 'Dinner',
    subtitle: 'Evening specials',
    image: 'assets/images/istockphoto-1400194993-612x612.jpg',
  },
  {
    id: '3',
    name: 'Coffee',
    subtitle: 'Hot & Cold drinks',
    image: 'assets/images/download.jpeg',
  },
];

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

const MenuTypeScreen = () => {
  const navigation = useNavigation<any>();

  const handleSelect = (category: string) => {
    navigation.navigate('MenuList', { category });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleSelect(item.name)} style={styles.cardWrapper}>
      <ImageBackground
        source={{ uri: item.image }}
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
      source={{ uri: 'assets/images/download.jpeg' }}
      style={styles.background}
      blurRadius={3}
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
  },
  overlay: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
