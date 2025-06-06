import React from "react";
import { useState } from 'react';
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
import { API_URL, useAuth } from "../api/AuthProvider";
type AuthScreenNavigationProp = NativeStackNavigationProp<any>;
interface IndexProps {
  navigation: AuthScreenNavigationProp;
}

const { width } = Dimensions.get("window");

export default function Login({ navigation }: IndexProps) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const isWeb = Platform.OS === "web";

  const handleLogin = async () => {
    if((form.email === '' || form.password === '')) {
      // setModal({...modalData, visible: true, message: 'Please fill your email and password correctly.'});
      console.warn('Please fill your email and password correctly.');
    } else try {
      // setModal({...modalData, visible: true, message: 'Connecting...', isLoading: true});
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 7000);
      });

      const response = await Promise.race(
        [
          fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              {
                email: form.email,
                password: form.password
              }
          ),
          })
        ,
          timeoutPromise
        ]
      );

      if (response instanceof Response) {
        const responseJson = await response.json();
        if (responseJson.token) {
          login(responseJson.token as string);
          // setModal({...modalData, visible: false, message: 'Success!', isLoading: false});
          console.log('Login successful:', responseJson);
        } else {
          // setModal({...modalData, visible: true, isLoading: false, message: responseJson.message || 'An error occurred on the server.'});
          console.warn(responseJson.message || 'An error occurred on the server.');
        }
      } else {
        // setModal({...modalData, visible: true, isLoading: false, message: 'An error occurred, invalid server response.'});
        console.warn('An error occurred, invalid server response.');
      }
    } catch (error) {
      // setModal({...modalData, visible: true, isLoading: false, message: 'An error occurred, unable to connect the server.'});
      console.error('An error occurred:', error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isWeb && (
        <style type="text/css">
          {`
        input:focus {
          outline: none !important;
        }
          `}
        </style>
      )}

      {/* Left Section */}
      {isLargeScreen && (
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

          {/* Sign Up CTA */}
          <View style={styles.signupSection}>
            <Text style={styles.signupPrompt}>Don’t have an account?</Text>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate("register")}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Right Section */}
      <LinearGradient
        colors={["#dbeafe", "#fce7f3", "#f3e8ff"]}
        start={[0, 0]}
        end={[1, 1]}
        style={[
          styles.rightContainer,
          isWeb && styles.rightContainerRounded,
        ]}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.signInHeader}>SIGN IN</Text>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#666"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Password"
              style={styles.input}
              placeholderTextColor="#666"
              secureTextEntry
              onChangeText={password => setForm({ ...form, password })}
            />
            <TouchableOpacity
              style={{ padding: 8 }}>
              <Feather name="eye" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Sign In Button with Gradient */}
          <TouchableOpacity style={styles.signInButton}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={["#3b82f6", "#9333ea", "#ec4899"]}
              start={[0, 0]}
              end={[1, 0]}
              style={[styles.signInButton, { width: "100%" }]}
            >
              <Text style={styles.signInText}>SIGN IN</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={() => navigation.navigate("register")}
            >
              <Text style={styles.footerLinkText}>Create an account</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLinkText}>Forget Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
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
    width: 1080/5,
    height: 480/5,
    marginBottom: 20,
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
  signInButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
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
