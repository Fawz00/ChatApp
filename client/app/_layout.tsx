import {Dimensions} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./api/AuthProvider";

import Dashboard from "./AppScreen/dashboard";
import Index from "./AuthScreen/index";
import Login from "./AuthScreen/login";
import Register from './AuthScreen/register';
import ForgotPassword from './AuthScreen/forgot_password';

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
  console.log("BaseNavigator");
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
      initialRouteName="dashboard"
      screenOptions={({navigation}) => {
        return {
          drawerStyle: {
            width: Dimensions.get('window').width * 0.75,
          },
        };
      }}
    >
      <AppDrawer.Screen name="dashboard" component={Dashboard} />
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