import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import RoleChoice from './screens/auth/RoleChoice';
import Terms from './screens/auth/Terms';
import Register from './screens/auth/Register';
import Login from './screens/auth/Login';
import Tabs from './navigation/Tabs';
import { AuthProvider } from './store/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="RoleChoice" component={RoleChoice} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="MainTabs" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
