import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
type AuthScreenNavigationProp = NativeStackNavigationProp<any>;
interface IndexProps {
  navigation: AuthScreenNavigationProp;
}

const isWeb = Platform.OS === "web";

export default function Login({ navigation }: IndexProps) {
  let screenWidth = Dimensions.get("window").width;
  const window = useWindowDimensions();
  const isLargeScreen = screenWidth >= 768;

  React.useEffect(() => {
    screenWidth = window.width;
  }, [window.width, window.height]);

  return (
    <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.leftContainer}>
          <View
            style={[{
              flex: 1,
              justifyContent: "center",
            }]}>
              
            {/* Welcome Message */}
            <View style={styles.welcomeSection}>
              <Image
                alt=""
                style={styles.logoImage}
                source={require('../../assets/images/logo_hd.png')}
              />
              <Text style={styles.heading}>
                <Text style={styles.textBlue}>Hey </Text>
                <Text style={styles.textPink}>There!</Text>
              </Text>
              <Text style={styles.subheading}>welcome back</Text>
              <Text style={styles.description}>
                You are just one step away to your feed
              </Text>
            </View>
          </View>

          <View style={styles.formWrapper}>
            {/* Sign Up Button */}
            <TouchableOpacity style={styles.registerButton}
              onPress={() => navigation.navigate("register")}
            >
                <Text style={styles.signInText}>SIGN UP</Text>
            </TouchableOpacity>

            {/* Sign In Button with Gradient */}
            <TouchableOpacity style={styles.colorButton}
              onPress={() => navigation.navigate("login")}
            >
              <LinearGradient
                colors={["#3b82f6", "#9333ea", "#ec4899"]}
                start={[0, 0]}
                end={[1, 0]}
                style={[styles.colorButton, { width: "100%" }]}
              >
                <Text style={styles.signInText}>SIGN IN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  leftContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainerRounded: {
    borderTopLeftRadius: 48,
    borderBottomLeftRadius: 48,
  },
  logoImage: {
    marginTop: 24,
    alignSelf: 'center',
    width: 1080/4,
    height: 480/4,
    marginBottom: 40,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoOuter: {
    width: 32,
    height: 32,
    backgroundColor: "#9ca3af",
    borderRadius: 16,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoCircle1: {
    width: 12,
    height: 12,
    backgroundColor: "#4b5563",
    borderRadius: 6,
    position: "absolute",
    top: 4,
    left: 4,
  },
  logoCircle2: {
    width: 8,
    height: 8,
    backgroundColor: "#4b5563",
    borderRadius: 4,
    position: "absolute",
    bottom: 4,
    right: 4,
  },
  logoText: {
    flexDirection: "column",
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: 2,
  },
  logoSubtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  welcomeSection: {
    marginVertical: 24,
    alignItems: "center",
  },
  heading: {
    fontSize: 52,
    fontWeight: 400,
  },
  textBlue: {
    color: "#1e3a8a",
  },
  textPink: {
    color: "#ec4899",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginTop: 8,
  },
  description: {
    color: "#6b7280",
    marginTop: 8,
  },
  signupSection: {
    alignItems: "center",
    marginTop: 24,
  },
  signupPrompt: {
    color: "#6b7280",
    marginBottom: 12,
  },
  signupButton: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  formWrapper: {
    width: "100%",
    maxWidth: 500,
  },
  signInHeader: {
    fontSize: 42,
    fontWeight: "light",
    color: "#3b0764",
    textAlign: "center",
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#9ca3af",
    marginBottom: 20,
    paddingBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  colorButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#323232",
  },
  signInText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
  footerLinkText: {
    color: "#111827",
    fontWeight: "600",
  },
});
