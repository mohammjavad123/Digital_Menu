import React, { useState } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import MenuStack from './navigation/MenuStack';
import CartScreen from './screens/CartScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import LoginScreen from './screens/LoginScreen';
import ManageScreen from './screens/ManageScreen';
import MenuItemModal from './components/MenuItemModal';

import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

const BottomTab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const RootStack = createNativeStackNavigator();

const renderTabs = ({ user, setUser }: any) => {
  const Tab = Platform.OS === 'android' ? TopTab : BottomTab;

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? 24 : 0 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: Platform.OS === 'ios'
            ? ({ color, size }) => {
                let iconName: any = 'heart';

                if (route.name === 'Menu') iconName = 'restaurant';
                else if (route.name === 'Cart') iconName = 'cart';
                else if (route.name === 'Favorites') iconName = 'heart';
                else if (route.name === 'Login') iconName = 'log-in';
                else if (route.name === 'Manage') iconName = 'settings';

                return <Ionicons name={iconName} size={size} color={color} />;
              }
            : undefined,
          tabBarActiveTintColor: '#e74c3c',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
          tabBarShowIcon: Platform.OS === 'ios',

          // ✅ Prevent text from wrapping
          tabBarLabelStyle: {
            fontSize: 13,
            textTransform: 'none',
          },
        })}
      >
        <Tab.Screen name="Menu" component={MenuStack} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{ tabBarLabel: 'Favs' }} // ✅ shortened label
        />
        <Tab.Screen name="Login">
          {() => <LoginScreen setUser={setUser} user={user} />}
        </Tab.Screen>
        {user && (
          <Tab.Screen
            name="Manage"
            options={{ tabBarLabel: 'Manage' }} // ✅ optional: change to 'Admin' if preferred
          >
            {() => <ManageScreen user={user} />}
          </Tab.Screen>
        )}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <CartProvider>
      <FavoritesProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootStack.Navigator>
              <RootStack.Screen
                name="MainTabs"
                options={{ headerShown: false }}
              >
                {() => renderTabs({ user, setUser })}
              </RootStack.Screen>

              <RootStack.Screen
                name="ItemDetail"
                component={MenuItemModal}
                options={({ route }: any) => ({
                  title: route.params?.item?.name || 'Item Detail',
                })}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}
