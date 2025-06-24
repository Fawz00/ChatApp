// components/SettingsPanel.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Image,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SimpleModal } from './simple-modal';
import { API_URL, API_URL_BASE, useAuth, UserScheme } from '@/app/api/AuthProvider';
import mime from 'mime';
import { useDrawerContext } from '../drawer/app-drawer-navigation';

interface SettingsPanel {
  onClose: () => void;
  isVisible: boolean;
}

const SettingsPanel: React.FC<SettingsPanel> = ({ onClose, isVisible }) => {
  const { token, logout } = useAuth();
  const { refreshSidebar, setRefreshSidebar, refreshMessages, setRefreshMessages, validateToken, base64ToBlob } = useDrawerContext();

  const [getModal, setModal] = useState({
    message: '',
    isLoading: false,
    visible: false,
  });

  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState("");
  const [userDescription, setUserDescription] = React.useState("");
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const window = useWindowDimensions();
  let screenWidth = Dimensions.get("window").width;
  let screenHeight = Dimensions.get("window").height;
  const isLargeScreen = screenWidth > 720;
  const isSmallHeight = screenHeight <= 530;

  React.useEffect(() => {
    validateToken()
    .then((user) => {
      setProfileImage(user?.profilePhoto ? `${API_URL_BASE}/${user.profilePhoto}`.replace(/\\/g, "/") : null);
      setUsername(user?.username || "");
      setUserDescription(user?.description || "");
    })
  }, [isVisible]);

  React.useEffect(() => {
    screenWidth = window.width;
    screenHeight = window.height;
  }, [window.width, window.height]);

  // ============================================
  // Functions
  // ============================================

  const handleClose = () => {
    setIsDarkMode(false);
    setProfileImage(null);
    setUsername("");
    setUserDescription("");
    setModal({ ...getModal, visible: false });
    onClose();
  }

  const pickImage = async () => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setModal({
          visible: true,
          isLoading: false,
          message: 'Please allow access to storage to select images.',
        });
        return;
      }
    })();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // ============================================
  // API Calls
  // ============================================

  // Function to handle profile update
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      if (username) formData.append("username", username);
      if (userDescription) formData.append("description", userDescription);

      if (profileImage) {
        if (profileImage.startsWith("data:image")) {
          const blob = base64ToBlob(profileImage);
          const file = new File([blob], "profile_photo." + blob.type.split("/")[1], { type: blob.type });
          formData.append("profilePhoto", file);
        } else {
          const imageName = profileImage ? profileImage.split('/').pop() : 'profile_photo.jpg';
          const mimeType = mime.getType(profileImage);
          formData.append("profilePhoto", {
            uri: profileImage,
            name: imageName,
            type: mimeType || 'image/jpeg',
          } as any);
        }
      }

      const response = await fetch(`${API_URL}/user/update`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setRefreshSidebar(!refreshSidebar);
        setRefreshMessages(!refreshMessages);
        handleClose();
      } else if (response.status === 401) {
        logout();
      } else {
        const responseJson = await response.json();
        setModal({...getModal, visible: true, isLoading: false, message: responseJson.message || 'An error occurred on the server.'});
      }
    } catch (error) {
      setModal({...getModal, visible: true, isLoading: false, message: `An error occurred, unable to connect the server.\n${error instanceof Error ? error.message : 'Unknown error'}`});
      console.error('An error occurred:', error);
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >

      {/* Modal Popup for Error Messages */}
      <SimpleModal
        visible={getModal.visible}
        message={getModal.message}
        isLoading={getModal.isLoading}
        onClose={() => setModal({ ...getModal, visible: false })}
      />

      <View style={styles.modalView}>
        <View
          style={
            isLargeScreen && !isSmallHeight
              ? styles.settingsPanel
              : styles.settingsPanelMobile
          }
        >
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1f1f1f" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScrollView}>
            <View style={{ marginBottom: 30 }}>
              <Text style={styles.settingsSubtitle}>Account</Text>

              <TouchableOpacity
                style={styles.profileImageWrapper}
                onPress={pickImage}
              >
                {profileImage ? (
                  <Image source={{ uri: `${profileImage}` }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Ionicons name="camera" size={30} color="#888" />
                    <Text style={{ color: '#888', marginTop: 4, paddingBottom: 8 }}>
                      Upload Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                placeholderTextColor="#666"
                onChangeText={(text) => setUsername(text)}
              />

              <TextInput
                placeholder="Description"
                style={styles.input}
                value={userDescription}
                placeholderTextColor="#666"
                onChangeText={(text) => setUserDescription(text)}
              />
            </View>

            {/* <View style={{ marginBottom: 30 }}>
              <Text style={styles.settingsSubtitle}>Theme</Text>

              <View style={styles.settingsOption}>
                <Text style={styles.settingsOptionText}>Dark Theme</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  thumbColor={isDarkMode ? "#333" : "#ccc"}
                  trackColor={{ false: "#eee", true: "#999" }}
                />
              </View>
            </View> */}

          </ScrollView>

          <View style={styles.settingsFooter}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleUpdateProfile()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  settingsPanel: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 1000,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: 420,
    height: 480,
    borderTopRightRadius: 20,
  },
  settingsPanelMobile: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsSubtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  settingsOptionText: {
    fontSize: 16,
    color: '#000',
  },
  contentScrollView: {
    flex: 1,
    paddingRight: 20,
  },
  profileImageWrapper: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // Light gray background
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SettingsPanel;
