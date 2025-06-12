import { createDrawerNavigator } from '@react-navigation/drawer';
import { createContext, useContext, useState } from 'react';

import AppDrawerContent from './app-drawer-content';
import ChatScreen from "../../AppScreen/Chat";
import SettingsPanel from '../modals/settings-panel';

interface DrawerContextType {
  openSettings: boolean;
  setOpenSettings: (value: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);
const AppDrawerNav = createDrawerNavigator();

export const AppDrawerNavigator = () => {
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <DrawerContext.Provider value={{ openSettings, setOpenSettings }}>
      {/* Settings */}
      <SettingsPanel isVisible={openSettings} onClose={() => setOpenSettings(false)} />

      <AppDrawerNav.Navigator
        initialRouteName="Chats"
        screenOptions={({navigation}) => {
          return {
            drawerStyle: {
              width: 400,
            },
          };
        }}
        drawerContent={(props) => <AppDrawerContent {...props} />}
      >
        <AppDrawerNav.Screen name="Chats" component={ChatScreen} />
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