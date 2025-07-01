import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import MenuStack from './navigation/MenuStack';
import CartScreen from './screens/CartScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import LoginScreen from './screens/LoginScreen';
import ManageScreen from './screens/ManageScreen';

import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// Tabs component receives user + setUser
const Tabs = ({ user, setUser }: any) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: any = 'heart';

        if (route.name === 'Menu') iconName = 'restaurant';
        else if (route.name === 'Cart') iconName = 'cart';
        else if (route.name === 'Favorites') iconName = 'heart';
        else if (route.name === 'Login') iconName = 'log-in';
        else if (route.name === 'Manage') iconName = 'settings';

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
    <Tab.Screen name="Login">
      {() => <LoginScreen setUser={setUser} user={user} />}
    </Tab.Screen>
    {user && (
      <Tab.Screen name="Manage">
        {() => <ManageScreen user={user} />}
      </Tab.Screen>
    )}
  </Tab.Navigator>
);

export default function App() {
  const [user, setUser] = useState(null); // 👤 user state

  return (
    <CartProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <RootStack.Navigator>
            <RootStack.Screen
              name="MainTabs"
              options={{ headerShown: false }}
            >
              {() => <Tabs user={user} setUser={setUser} />}
            </RootStack.Screen>
          </RootStack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </CartProvider>
  );
}
