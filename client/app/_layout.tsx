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

const AuthStack = createNativeStackNavigator();
const AppDrawer = createDrawerNavigator();

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
      <MainNavigator/>
    )
  } else {
    return (
      <AuthNavigator/>
    )
  }
};

const MainNavigator = () => (
    <AppDrawer.Navigator
      initialRouteName="chat"
      screenOptions={({navigation}) => {
        return {
          drawerStyle: {
            width: 400,
          },
        };
      }}
    >
      <AppDrawer.Screen name="chat" component={ChatScreen} />
    </AppDrawer.Navigator>
);

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