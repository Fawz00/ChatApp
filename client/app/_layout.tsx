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
import AppDrawerContent from './components/app-drawer-content';

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
      <MainNavigator/>
    )
  } else {
    return (
      <AuthNavigator/>
    )
  }
};

const MainNavigator = () => (
  <AppDrawerNav.Navigator
    initialRouteName="WeitNah"
    screenOptions={({navigation}) => {
      return {
        drawerStyle: {
          width: 400,
        },
      };
    }}
    drawerContent={(props) => <AppDrawerContent {...props} />}
  >
    <AppDrawerNav.Screen name="WeitNah" component={ChatScreen} />
  </AppDrawerNav.Navigator>
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