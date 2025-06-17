import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MenuListScreen = ({ route }: any) => {
  const { category } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You selected: {category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default MenuListScreen;
