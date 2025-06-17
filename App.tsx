import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import MenuStack from './navigation/MenuStack';
import CartScreen from './screens/CartScreen';
import FavoritesScreen from './screens/FavoritesScreen'; // ✅ import FavoritesScreen

import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let iconName = 'heart';

                if (route.name === 'Menu') iconName = 'restaurant';
                else if (route.name === 'Cart') iconName = 'cart';
                else if (route.name === 'Favorites') iconName = 'heart';

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#e74c3c',
              tabBarInactiveTintColor: '#999',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Menu" component={MenuStack} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </CartProvider>
  );
}
