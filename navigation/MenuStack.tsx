import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuTypeScreen from '../screens/MenuTypeScreen';
import MenuListScreen from '../screens/MenuListScreen';
import MenuItemModal from '../components/MenuItemModal'; // ✅ Import the screen you're using as detail

const Stack = createNativeStackNavigator();

const MenuStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MenuType"
        component={MenuTypeScreen}
        options={{ title: 'Choose a Menu' }}
      />
      <Stack.Screen
        name="MenuList"
        component={MenuListScreen}
        options={({ route }: any) => ({ title: route.params?.category || 'Menu' })}
      />
      <Stack.Screen
        name="ItemDetail"
        component={MenuItemModal}
        options={({ route }: any) => ({ title: route.params?.item?.name || 'Details' })}
      />
    </Stack.Navigator>
  );
};

export default MenuStack;
