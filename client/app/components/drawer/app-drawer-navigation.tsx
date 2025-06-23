import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createContext, useContext, useState } from 'react';

import AppDrawerContent from './app-drawer-content';
import ChatScreen from "../../AppScreen/Chat";
import SettingsPanel from '../modals/settings-panel';
import { SimpleModal } from '../modals/simple-modal';
import NewChatPanel from '../modals/new-chat';
import { useAuth, UserScheme } from '@/app/api/AuthProvider';
import React from 'react';

interface DrawerContextType {
  refreshSidebar: boolean;
  setRefreshSidebar: (value: boolean) => void;
  refreshMessages: boolean;
  setRefreshMessages: (value: boolean) => void;

  loadedChat: string;
  setLoadedChat: (chatId: string) => void;

  currentUserData: UserScheme | undefined;
  validateToken: () => Promise<UserScheme | undefined>;

  base64ToBlob: (base64Data: string) => Blob;

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
  const { validate, logout } = useAuth();
  const [currentUserData, setCurrentUserData] = useState<UserScheme | undefined>(undefined);
  const [loadedChat, setLoadedChat] = useState('');

  const [refreshSidebar, setRefreshSidebar] = useState(false);
  const [refreshMessages, setRefreshMessages] = useState(false);

  const [openSettings, setOpenSettings] = useState(false);
  const [createChat, setCreateChat] = useState(false);

  React.useEffect(() => {
    validateToken();
  }, []);

  async function validateToken() {
    try {
      const profile = await validate();
      setCurrentUserData(profile);
      return profile;
    } catch (error) {
      console.error('Token validation failed:', error);
    }
    return undefined;
  };

  function base64ToBlob(dataUrl: string) {
    const matches = dataUrl.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 URI");
    }

    const mime = matches[1];
    const base64Data = matches[2];

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length).fill(0).map((_, j) => slice.charCodeAt(j));
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  return (
    <DrawerContext.Provider value={{ refreshSidebar, setRefreshSidebar, refreshMessages, setRefreshMessages, loadedChat, setLoadedChat, currentUserData, validateToken, base64ToBlob, openSettings, setOpenSettings, createChat, setCreateChat }}>

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