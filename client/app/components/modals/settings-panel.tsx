// components/SettingsPanel.tsx
import React from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface SettingsPanel {
  onClose: () => void;
  isVisible: boolean;
}

const SettingsPanel: React.FC<SettingsPanel> = ({ onClose, isVisible }) => {
  const window = useWindowDimensions();
  let screenWidth = Dimensions.get("window").width;
  let screenHeight = Dimensions.get("window").height;
  const isLargeScreen = screenWidth > 720;
  const isSmallHeight = screenHeight <= 530;

  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  React.useEffect(() => {
    screenWidth = window.width;
    screenHeight = window.height;
  }, [window.width, window.height]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
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
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profilePlaceholder}>
                    <Ionicons name="camera" size={30} color="#888" />
                    <Text style={{ color: '#888', marginTop: 6 }}>
                      Upload Profile Photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={[styles.settingsOption, { marginTop: 20 }]}>
                <Text style={styles.settingsOptionText}>Dark Theme</Text>
                <Switch
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  thumbColor={isDarkMode ? "#333" : "#ccc"}
                  trackColor={{ false: "#eee", true: "#999" }}
                />
              </View>
            </View>
          </ScrollView>
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
    marginBottom: 30,
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
});

export default SettingsPanel;
