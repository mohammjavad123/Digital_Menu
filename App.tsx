import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuTypeScreen from './screens/MenuTypeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MenuType">
        <Stack.Screen
          name="MenuType"
          component={MenuTypeScreen}
          options={{ title: 'Select Menu Type' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
