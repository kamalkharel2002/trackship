import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import RoleChoice from '../screens/auth/RoleChoice';
import TermsCustomer from '../screens/auth/TermsCustomer';
import TermsDriver from '../screens/auth/TermsDriver';
import SignupCustomer from '../screens/auth/SignupCustomer';
import Verify from '../screens/auth/Verify';
import Login from '../screens/auth/Login';
import ForgotPassword from '../screens/auth/ForgotPassword';
import Home from '../screens/home/Home';
import ShipmentDetails from '../screens/home/ShipmentDetails';
import PlaceShipment from '../screens/home/PlaceShipment';
import Notifications from '../screens/home/Notifications';
import LiveTrack from '../screens/home/LiveTrack';
import CheckDriver from '../screens/home/CheckDriver';
import Profile from '../screens/home/Profile';
import TopBar from '../components/TopBar';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <TopBar />,  // ✅ Global top bar
      }}
    >
      {/* Entry */}
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="RoleChoice" component={RoleChoice} />
      <Stack.Screen name="TermsCustomer" component={TermsCustomer} />
      <Stack.Screen name="TermsDriver" component={TermsDriver} />
      <Stack.Screen name="SignupCustomer" component={SignupCustomer} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      {/* Main */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ShipmentDetails" component={ShipmentDetails} />
      <Stack.Screen name="PlaceShipment" component={PlaceShipment} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="LiveTrack" component={LiveTrack} />
      <Stack.Screen name="CheckDriver" component={CheckDriver} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}
