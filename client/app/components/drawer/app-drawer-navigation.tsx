import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createContext, useContext, useState } from 'react';

import AppDrawerContent from './app-drawer-content';
import ChatScreen from "../../AppScreen/Chat";
import SettingsPanel from '../modals/settings-panel';
import { SimpleModal } from '../modals/simple-modal';
import NewChatPanel from '../modals/new-chat';

interface DrawerContextType {
  openSettings: boolean;
  setOpenSettings: (value: boolean) => void;
  createChat: boolean;
  setCreateChat: (value: boolean) => void;
}

type RootDrawerParamList = {
  App: undefined;
};

type AppStackParamList = {
  Chats: undefined;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);
const AppDrawerNav = createDrawerNavigator<RootDrawerParamList>();
const AppStackNav = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <AppStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AppStackNav.Screen name="Chats" component={ChatScreen} />
    </AppStackNav.Navigator>
  );
}

export const AppDrawerNavigator = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [createChat, setCreateChat] = useState(false);

  return (
    <DrawerContext.Provider value={{ openSettings, setOpenSettings, createChat, setCreateChat }}>

      {/* Create New Chat */}
      <NewChatPanel isVisible={createChat} onClose={() => setCreateChat(false)} />

      {/* Settings */}
      <SettingsPanel isVisible={openSettings} onClose={() => setOpenSettings(false)} />

      <AppDrawerNav.Navigator
        initialRouteName="App"
        screenOptions={({navigation}) => {
          return {
            drawerStyle: {
              width: 400,
            },
            headerShown: false,
          };
        }}
        drawerContent={(props) => <AppDrawerContent {...props} />}
      >
        <AppDrawerNav.Screen name="App" component={AppStack} />
      </AppDrawerNav.Navigator>

    </DrawerContext.Provider>
  );
};

export const useDrawerContext = () => {
    const context = useContext(DrawerContext);
    if (!context) {
        throw new Error('useDrawerContext must be used within an DrawerContext');
    }
    return context;
};