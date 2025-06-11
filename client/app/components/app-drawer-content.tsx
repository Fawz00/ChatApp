import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useAuth, UserScheme, SidebarContent } from "../api/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import React from "react";

export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const { state, ...rest } = props;
  const { logout, validate, setSidebarContent } = useAuth();
  const [profile, setProfile] = useState<UserScheme | undefined>(undefined);

  const hiddenScreens = ['Hidden'];

  // On load, validate the token
    React.useEffect(() => {
      const validateToken = async () => {
        const user = await validate();
        setProfile(user);
      }
      validateToken();
    }, []);

  // Handle log out
  const handleLogout = async () => {
    props.navigation.closeDrawer();
    logout();
  }

  // Handle open settings
  const handleOpenSettings = async () => {
    props.navigation.closeDrawer();
    setSidebarContent(SidebarContent.SETTINGS);
  }

  return (
    <View style={styles.mainView}>
      <DrawerContentScrollView
        {...rest}
          contentContainerStyle={{
          backgroundColor: "#fff",
          padding: 0,
        }}
      >
        <View
          style={styles.titleBackground}
        >
          <Text style={styles.titleUsername} >
            {profile?.username || profile?.email || "User"}
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          {state.routeNames.map((routeName, index) => {
            if (hiddenScreens.includes(routeName)) {
              return null;
            }
            const isRouteFocused = state.index === index;

            return (
              <DrawerItem
                key={index}
                label={routeName}
                onPress={() => props.navigation.navigate(routeName)}
                style={{ backgroundColor: isRouteFocused ? '#f5e2d7' : 'white' }}
                labelStyle={{ color: isRouteFocused ? 'black' : 'gray' }}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View style={styles.navigationButtonPanel}>
        <TouchableOpacity onPress={handleOpenSettings} >
          <View style={[styles.navigationButton, {paddingBottom: 15}]}>
            <Ionicons name="settings-outline" size={24} color="#1f1f1f" />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              Settings
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} >
          <View style={styles.navigationButton}>
            <Ionicons name="log-out-outline" size={24} color="#1f1f1f" />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  titleBackground: {
    backgroundColor: '#f66d22',
    padding: 20,
    paddingVertical: 40,
    borderTopEndRadius: 50,
  },
  titleUsername: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  navigationButtonPanel: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc"
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center"
  }
});