// components/SettingsPanel.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SimpleDropdownProps from '../simple-dropdown';

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

  //=====================//
  // State for dropdowns //
  //=====================//

  // Account visibility dropdown
  const [accountVisibilityOpen, setAccountVisibilityOpen] = React.useState(false);
  const [selectedAccountVisibility, setSelectedAccountVisibility] = React.useState("Everyone");
  const accountVisibilityOptions = ["Everyone", "My Contacts", "Nobody"];
  
  // Last seen dropdown
  const [lastSeenOpen, setLastSeenOpen] = React.useState(false);
  const [selectedLastSeen, setSelectedLastSeen] = React.useState("Everyone");
  const lastSeenOptions = ["Everyone", "My Contacts", "Nobody"];

  // Profile photo dropdown
  const [photoProfileOpen, setPhotoProfileOpen] = React.useState(false);
  const [selectedPhotoProfile, setSelectedPhotoProfile] = React.useState("Everyone");
  const photoProfileOptions = ["Everyone", "My Contacts", "Nobody"];
  
  // about me dropdown
  const [AboutMeOpen, setAboutMeOpen] = React.useState(false);
  const [selectedAboutMe, setSelectedAboutMe] = React.useState("Everyone");
  const AboutMeOptions = ["Everyone", "My Contacts", "Nobody"];

  // download media dropdown
  const [downloadMediaOpen, setDownloadMediaOpen] = React.useState(false);
  const [selectedDownloadMedia, setSelectedDownloadMedia] = React.useState("Everyone");
  const downloadMediaOptions = ["Never", "Ask", "Always"];

  //====================//
  // useEffect listener //
  //====================//

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
            <Text style={styles.settingsTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#1f1f1f" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.contentScrollView}
          >
            <View>
              <Text style={styles.settingsSubtitle}>Privacy</Text>
              <SimpleDropdownProps
                displayText="Account visibility"
                dropdownOptions={accountVisibilityOptions}
                visibility={accountVisibilityOpen}
                setVisibility={setAccountVisibilityOpen}
                selected={selectedAccountVisibility}
                setSelected={setSelectedAccountVisibility} />
              <SimpleDropdownProps
                displayText="Show last seen"
                dropdownOptions={lastSeenOptions}
                visibility={lastSeenOpen}
                setVisibility={setLastSeenOpen}
                selected={selectedLastSeen}
                setSelected={setSelectedLastSeen} />
              <SimpleDropdownProps
                displayText="Show profile photo"
                dropdownOptions={photoProfileOptions}
                visibility={photoProfileOpen}
                setVisibility={setPhotoProfileOpen}
                selected={selectedPhotoProfile}
                setSelected={setSelectedPhotoProfile} />
              <SimpleDropdownProps
                displayText="About me"
                dropdownOptions={AboutMeOptions}
                visibility={AboutMeOpen}
                setVisibility={setAboutMeOpen}
                selected={selectedAboutMe}
                setSelected={setSelectedAboutMe}/>
            </View>
            <View>
              <Text style={styles.settingsSubtitle}>Storage</Text>
              <SimpleDropdownProps
                displayText="Download media"
                dropdownOptions={downloadMediaOptions}
                visibility={downloadMediaOpen}
                setVisibility={setDownloadMediaOpen}
                selected={selectedDownloadMedia}
                setSelected={setSelectedDownloadMedia}/>
            </View>
          </ScrollView>

        </View>en
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
  settingsOptionWrap: {
    marginBottom: 20,
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

  dropdownOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default SettingsPanel;