import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuTypeScreen from '../screens/MenuTypeScreen';
import MenuListScreen from '../screens/MenuListScreen';

const Stack = createNativeStackNavigator();

const MenuStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="MenuType" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuType" component={MenuTypeScreen} />
      <Stack.Screen name="MenuList" component={MenuListScreen} />
    </Stack.Navigator>
  );
};

export default MenuStackNavigator;
