// components/SettingsPanel.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NewChatPanel {
  onClose: () => void;
  isVisible: boolean;
}

const NewChatPanel: React.FC<NewChatPanel> = ({ onClose, isVisible }) => {
  const window = useWindowDimensions();
  let screenWidth = Dimensions.get("window").width;
  let screenHeight = Dimensions.get("window").height;
  const isLargeScreen = screenWidth > 720;
  const isSmallHeight = screenHeight <= 530;

  // On window resize, update the screen width
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
        <View style={(isLargeScreen && !isSmallHeight) ? styles.settingsPanel : styles.settingsPanelMobile}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>New Chat</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1f1f1f" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.contentScrollView}
          >
            <View>
              <Text style={styles.settingsSubtitle}>誰かな</Text>
              
            </View>

            <View>
              <Text style={styles.settingsSubtitle}>Storage</Text>
              <View style={styles.settingsOption}>
                <Text style={styles.settingsOptionText}>Download Media</Text>
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Select</Text>
                  <Ionicons name="chevron-down" size={16} color="#000" />
                </TouchableOpacity>
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
    marginBottom: 20,
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  selectButtonText: {
    marginRight: 5,
    color: '#000',
  },
});

export default NewChatPanel;