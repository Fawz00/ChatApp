import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useAuth, UserScheme } from "../../api/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import React from "react";
import { useDrawerContext } from "./app-drawer-navigation";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppDrawerContent(props: DrawerContentComponentProps) {
  const { state, ...rest } = props;
  const { logout, validate } = useAuth();
  const { openSettings, setOpenSettings, createChat, setCreateChat } = useDrawerContext();
  const [profile, setProfile] = useState<UserScheme | undefined>(undefined);

  const hiddenScreens = ['Hidden'];
  const insets = useSafeAreaInsets();

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
    setOpenSettings(true);
  }

  // Handle create new chat
  const handleNewChat = async () => {
    props.navigation.closeDrawer();
    setCreateChat(true);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={[styles.container, {paddingBottom: insets.bottom}]}>
        <DrawerContentScrollView
          {...rest}
          contentContainerStyle={{
            backgroundColor: "#fff",
            padding: 0,
          }}
          style={{ flex: 1, backgroundColor: "#fff" }}
        >
          <LinearGradient
            colors={["#dbeafe", "#fce7f3", "#f3e8ff"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.titleBackground}
          >
            <Text style={styles.titleUsername} >
              {profile?.username || profile?.email || "User"}
            </Text>
          </LinearGradient>
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
                  style={{ backgroundColor: isRouteFocused ? '#dbeafe' : 'white' }}
                  labelStyle={{ color: isRouteFocused ? 'black' : 'gray' }}
                />
              );
            })}
          </View>
          <View style={styles.navigationButtonPanel}>
            <TouchableOpacity onPress={handleNewChat} >
              <View style={styles.navigationButton}>
                <Ionicons name="create-outline" size={24} color="#1f1f1f" />
                <Text
                  style={{
                    fontSize: 15,
                    marginLeft: 5,
                  }}
                >
                  New Chat
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </DrawerContentScrollView>
        <View style={styles.navigationButtonPanel}>
          <TouchableOpacity onPress={handleOpenSettings} >
            <View style={styles.navigationButton}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleBackground: {
    backgroundColor: '#f66d22',
    padding: 8,
    paddingVertical: 40,
    borderRadius: 20,
  },
  titleUsername: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  navigationButtonPanel: {
    marginTop: 10,
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: "#ccc"
  },
  navigationButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center"
  }
});