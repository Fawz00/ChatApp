import {Dimensions} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./api/AuthProvider";

import ChatScreen from "./AppScreen/Chat";
import Index from "./AuthScreen/index";
import Login from "./AuthScreen/login";
import Register from './AuthScreen/register';
import ForgotPassword from './AuthScreen/forgot_password';
import NotFoundScreen from './+not-found';

import { AppDrawerNavigator } from './components/drawer/app-drawer-navigation';
import AppDrawerContent from './components/drawer/app-drawer-content';

const AuthStack = createNativeStackNavigator();
const AppDrawerNav = createDrawerNavigator();

export default function RootLayout() {
  return (
    <AuthProvider>
      <BaseNavigator/>
    </AuthProvider>
  );
}

const BaseNavigator = () => {
  const { token } = useAuth();
  if(token) {
    return (
      <AppDrawerNavigator/>
    )
  } else {
    return (
      <AuthNavigator/>
    )
  }
};

const AuthNavigator = () => (
  <AuthStack.Navigator
    initialRouteName="index"
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="index" component={Index}/>
    <AuthStack.Screen name="login" component={Login}/>
    <AuthStack.Screen name="register" component={Register}/>
    <AuthStack.Screen name="forgot_password" component={ForgotPassword}/>
  </AuthStack.Navigator>
);