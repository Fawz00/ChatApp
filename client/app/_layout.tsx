import {Dimensions} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./api/AuthProvider";

import Dashboard from "./AppScreen/dashboard";
import Index from "./AuthScreen/index";
import Login from "./AuthScreen/login";
import Register from './AuthScreen/register';

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
      initialRouteName="Dashboard"
      screenOptions={({navigation}) => {
        return {
          drawerStyle: {
            width: Dimensions.get('window').width * 0.75,
          },
        };
      }}
    >
      <AppDrawer.Screen name="Dashboard" component={Dashboard} />
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
  </AuthStack.Navigator>
);