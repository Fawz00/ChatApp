import React, { useState } from "react";
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
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL, useAuth } from "../api/AuthProvider";
import { SimpleModal } from "../components/modals/simple-modal";
type AuthScreenNavigationProp = NativeStackNavigationProp<any>;
interface IndexProps {
  navigation: AuthScreenNavigationProp;
}

const isWeb = Platform.OS === "web";

export default function ForgotPassword({ navigation }: IndexProps) {
  const [form, setForm] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    repeatNewPassword: '',
  });
  const [getModal, setModal] = useState({
    message: '',
    isLoading: false,
    visible: false,
  });
  const [secureText, setSecureText] = useState(true);
  const [repeatSecureText, setRepeatSecureText] = useState(true);
  const [currentStep, setStep] = useState(0);

  let screenWidth = Dimensions.get("window").width;
  const window = useWindowDimensions();
  const isLargeScreen = screenWidth >= 768;

  React.useEffect(() => {
    screenWidth = window.width;
  }, [window.width, window.height]);

  const handleConfirm = (state: number) => {
    switch (state) {
      case 0: {
        handleForgotPassword();
        break;
      }
      case 1: {
        handleInputToken();
        break;
      }
      case 2: {
        handleResetPassword();
        break;
      }
    
      default:
        break;
    }
  };

  const handleForgotPassword = async () => {
    if(form.email === '') {
      setModal({...getModal, visible: true, message: 'Please fill your email correctly.'});
    } else try {
      setModal({...getModal, visible: true, message: 'Connecting...', isLoading: true});
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 12000);
      });

      const response = await Promise.race(
        [
          fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              {
                email: form.email
              }
          ),
          })
        ,
          timeoutPromise
        ]
      );

      if (response instanceof Response) {
        const responseJson = await response.json();
        const responseStatus = await response.status;
        if (responseStatus === 200) {
          setModal({...getModal, visible: true, message: 'Check your email for the reset code.', isLoading: false});
          setStep(1);
        } else {
          setModal({...getModal, visible: true, isLoading: false, message: responseJson.message || 'An error occurred on the server.'});
        }
      } else {
        setModal({...getModal, visible: true, isLoading: false, message: 'An error occurred, invalid server response.'});
      }
    } catch (error) {
      setModal({...getModal, visible: true, isLoading: false, message: 'An error occurred, unable to connect the server.'});
      console.error('An error occurred:', error);
    }
  };

  const handleInputToken = ()=> {
    setStep(2);
  };

  const handleResetPassword = async () => {
    if(form.email === '') {
      setModal({...getModal, visible: true, message: 'Email is required.'});
    } else if(form.resetCode === '') {
      setModal({...getModal, visible: true, message: 'Reset code is required.'});
    } else if(form.newPassword === '') {
      setModal({...getModal, visible: true, message: 'New password is required.'});
    } else if(form.repeatNewPassword !== form.newPassword) {
      setModal({...getModal, visible: true, message: 'New password and repeat password must match.'});
    } else try {
      setModal({...getModal, visible: true, message: 'Connecting...', isLoading: true});
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 7000);
      });

      const response = await Promise.race(
        [
          fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              {
                email: form.email
              }
          ),
          })
        ,
          timeoutPromise
        ]
      );

      if (response instanceof Response) {
        const responseJson = await response.json();
        const responseStatus = await response.status;
        if (responseStatus === 200) {
          setModal({...getModal, visible: true, message: 'Reset password successfully.', isLoading: false});
          setStep(0);
          navigation.navigate("login");
        } else {
          setModal({...getModal, visible: true, isLoading: false, message: responseJson.message || 'An error occurred on the server.'});
        }
      } else {
        setModal({...getModal, visible: true, isLoading: false, message: 'An error occurred, invalid server response.'});
      }
    } catch (error) {
      setModal({...getModal, visible: true, isLoading: false, message: 'An error occurred, unable to connect the server.'});
      console.error('An error occurred:', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
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

      {/* Modal Popup for Error Messages */}
      <SimpleModal
        visible={getModal.visible}
        message={getModal.message}
        isLoading={getModal.isLoading}
        onClose={() => setModal({ ...getModal, visible: false })}
      />

      {/* Left Section */}
      <LinearGradient
        colors={["#dbeafe", "#fce7f3", "#f3e8ff"]}
        start={[0, 0]}
        end={[1, 1]}
        style={[
          styles.leftContainer,
          isWeb && styles.leftContainerRounded,
        ]}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.signInHeader}>FORGOT PASSWORD</Text>

          {currentStep === 0 && (
            // Email Input
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Email"
                style={styles.input}
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => setForm({...form, email: text})}
              />
            </View>
          )}

          {currentStep === 1 && (
            // Reset Code Input
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color="#666" style={styles.icon} />
              <TextInput
                placeholder="Reset Code"
                style={styles.input}
                placeholderTextColor="#666"
                onChangeText={(text) => setForm({...form, resetCode: text})}
              />
            </View>
          )}

          {currentStep === 2 && (
            <View>
              {/* Email */}
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  placeholderTextColor="#666"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.email}
                  editable={false}
                />
              </View>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  placeholderTextColor="#666"
                  secureTextEntry={secureText}
                  onChangeText={(text) => setForm({...form, newPassword: text})}
                />
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => setSecureText(!secureText)}
                >
                  {secureText ?
                    <Feather name="eye" size={20} color="#666" />
                    :
                    <Feather name="eye-off" size={20} color="#666" />
                  }
                </TouchableOpacity>
              </View>
    
              {/* Repeat Password */}
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Repeat Password"
                  style={styles.input}
                  placeholderTextColor="#666"
                  secureTextEntry={repeatSecureText}
                  onChangeText={(text) => setForm({...form, repeatNewPassword: text})}
                />
                <TouchableOpacity
                  style={{ padding: 8 }}
                  onPress={() => setRepeatSecureText(!repeatSecureText)}
                >
                  {repeatSecureText ?
                    <Feather name="eye" size={20} color="#666" />
                    :
                    <Feather name="eye-off" size={20} color="#666" />
                  }
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Confirm Button with Gradient */}
          <TouchableOpacity style={styles.signInButton}
            onPress={() => handleConfirm(currentStep)}
          >
            <LinearGradient
              colors={["#3b82f6", "#9333ea", "#ec4899"]}
              start={[0, 0]}
              end={[1, 0]}
              style={[styles.signInButton, { width: "100%" }]}
            >
              <Text style={styles.signInText}>CONFIRM</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footerLinks}>
            <TouchableOpacity
              onPress={() => navigation.navigate("login")}
            >
              <Text style={styles.footerLinkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Right Section */}
      {isLargeScreen && (
        <View style={styles.rightContainer}>

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
              <Text style={styles.subheading}>welcome</Text>
              <Text style={styles.description}>
                You are just a few step away to your feed
              </Text>
            </View>
          </View>

          {/* Sign In CTA */}
          <View style={styles.signupSection}>
            <Text style={styles.signupPrompt}>Remember your password?</Text>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => navigation.navigate("login")}
            >
              <Text style={styles.signupButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: Platform.OS === "web" ? "row" : "column",
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  rightContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  leftContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  leftContainerRounded: {
    borderTopRightRadius: 48,
    borderBottomRightRadius: 48,
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
