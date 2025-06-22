// components/SettingsPanel.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, useWindowDimensions, TextInput, FlatList, Image, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { API_URL, API_URL_BASE, useAuth, UserScheme } from '@/app/api/AuthProvider';
import { SimpleCheckbox } from '../simple-checkbox';
import { SimpleModal } from './simple-modal';
import * as ImagePicker from 'expo-image-picker';
import { useDrawerContext } from '../drawer/app-drawer-navigation';
import mime from 'mime';

interface NewChatPanel {
  onClose: () => void;
  isVisible: boolean;
}

const isWeb = Platform.OS === "web";

const NewChatPanel: React.FC<NewChatPanel> = ({ onClose, isVisible }) => {
  const { token, logout } = useAuth();
  const { currentUserData, base64ToBlob } = useDrawerContext();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserScheme[]>([]);

  const [getModal, setModal] = useState({
    message: '',
    isLoading: false,
    visible: false,
  });

  const [createGroupState, setCreateGroupState] = useState(0);
  const [addedUserId, setAddedUserId] = useState<UserScheme[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupPhoto, setGroupPhoto] = useState<string | null>(null);

  const window = useWindowDimensions();
  let screenWidth = Dimensions.get("window").width;
  let screenHeight = Dimensions.get("window").height;
  const isLargeScreen = screenWidth > 720;
  const isSmallHeight = screenHeight <= 530;

  // On window resize, update the screen width
  useEffect(() => {
    screenWidth = window.width;
    screenHeight = window.height;
  }, [window.width, window.height]);

  // Fetch users based on search input
  useEffect(() => {
    const fetchUsers = async () => {
      if (search.length > 0) {
        try {
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Request timed out'));
            }, 7000);
          });

          const response = await Promise.race(
            [
              fetch(`${API_URL}/user/find/${search}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                }
              })
            , timeoutPromise]
          );
          
          if (response instanceof Response) {
            if (response.ok) {
              const responseJson = await response.json();
              setUsers(responseJson);
            } else if (response.status === 401) {
              logout();
            }
          }

        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setUsers([]);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce 300ms

    return () => clearTimeout(debounceFetch); // Cleanup on unmount
  }, [search]);

  // ============================================
  // Functions
  // ============================================

  const handleClose = () => {
    setSearch("");
    setUsers([]);
    setAddedUserId([]);
    setGroupName("");
    setGroupDescription("");
    setGroupPhoto(null);
    setCreateGroupState(0);
    setModal({ ...getModal, visible: false });
    onClose();
  }

  const pickGroupProfile = async () => {
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
      setGroupPhoto(result.assets[0].uri);
    }
  };

  // ============================================
  // API Calls
  // ============================================

  // Fungsi untuk membuat chat baru
  const handleCreateChat = async (addedId: string) => {
    try {
      const formData = new FormData();
      formData.append("userIds", JSON.stringify([addedId]));
      formData.append("isGroup", "false");

      const response = await fetch(`${API_URL}/chat/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseJson = await response.json();
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

  // Fungsi untuk membuat grup baru
  const handleCreateGroup = async () => {
    if (!groupName.trim() || addedUserId.length === 0) {
      setModal({
        visible: true,
        message: "Form is incomplete. Please fill in the group name and add at least one user.",
        isLoading: false,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("userIds", JSON.stringify(addedUserId.map(user => user.id)));
      formData.append("isGroup", "true");
      formData.append("name", groupName);
      
      if (groupDescription) {
        formData.append("description", groupDescription);
      }
      if (groupPhoto) {
        if (groupPhoto.startsWith("data:image")) {
          const blob = base64ToBlob(groupPhoto);
          const file = new File([blob], "group_photo." + blob.type.split("/")[1], { type: blob.type });
          formData.append("groupPhoto", `${API_URL_BASE}/${file}`.replace(/\\/g, "/"));
        } else {
          const imageName = groupPhoto ? groupPhoto.split('/').pop() : 'group_photo.jpg';
          const mimeType = mime.getType(groupPhoto);
          formData.append("groupPhoto", {
            uri: groupPhoto,
            name: imageName,
            type: mimeType || 'image/jpeg',
          } as any);
        }
      }

      const response = await fetch(`${API_URL}/chat/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        handleClose();
      } else {
        const errorData = await response.json();
        setModal({
          visible: true,
          message: errorData.message || 'An error occurred on the server.',
          isLoading: false,
        });
        console.error("Error creating group:", errorData.message);
      }
    } catch (error) {
      setModal({
        visible: true,
        message: `An error occurred, unable to connect the server.\n${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false,
      });
      console.error("Error creating group:", error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      {/* Modal Popup for Error Messages */}
      <SimpleModal
        visible={getModal.visible}
        message={getModal.message}
        isLoading={getModal.isLoading}
        onClose={() => setModal({ ...getModal, visible: false })}
      />

      <View style={styles.modalView}>
        <View style={(isLargeScreen && !isSmallHeight) ? styles.settingsPanel : styles.settingsPanelMobile}>
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsTitle}>New Chat</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#1f1f1f" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScrollView}>
            {/* Create Chat */}
            { createGroupState === 0 && (
                <View>
                <Text style={styles.settingsSubtitle}>Search Username</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="search" size={20} color="#666" style={styles.icon} />
                  <TextInput
                    placeholder="Search"
                    style={styles.input}
                    placeholderTextColor="#666"
                    onChangeText={(text) => setSearch(text)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.createGroupButton}
                  onPress={() => setCreateGroupState(1)}
                >
                  <Text style={styles.createGroupButtonText}>Create Group</Text>
                </TouchableOpacity>

                <View style={styles.line} />

                <FlatList
                  data={users}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) =>
                    item.id !== currentUserData?.id ? (
                      <TouchableOpacity
                      style={styles.settingsOption}
                      onPress={() => handleCreateChat(item.id)}
                      >
                      <Text style={styles.settingsOptionText}>{item.username} ({item.email})</Text>
                      </TouchableOpacity>
                    ) : null
                  }
                  ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
                />
                </View>
            )}

            {/* Create Group */}
            { createGroupState === 1 && (
              <View>
                <Text style={styles.settingsSubtitle}>Create Group</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="search" size={20} color="#666" style={styles.icon} />
                  <TextInput
                    placeholder="Search"
                    style={styles.input}
                    placeholderTextColor="#666"
                    onChangeText={(text) => setSearch(text)}
                  />
                </View>
                { addedUserId.length > 0 &&
                  <TouchableOpacity
                    style={styles.createGroupButton}
                    onPress={() => setCreateGroupState(2)}
                  >
                    <Text style={styles.createGroupButtonText}>Continue</Text>
                  </TouchableOpacity>
                }

                <View style={styles.line} />

                { addedUserId.length > 0 &&
                  <View>
                    <FlatList
                      data={addedUserId}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.settingsOption}
                        onPress={() => setAddedUserId(addedUserId.filter(user => user.id !== item.id))}
                      >
                          <Text style={styles.settingsOptionText}>{item.username} ({item.email})</Text>
                          <SimpleCheckbox
                            label=""
                            checked={true}
                            onChange={() => {}}
                          />
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={<Text style={styles.noResultsText}>Add users to the group</Text>}
                    />

                    <View style={styles.line} />
                  </View>
                }

                <FlatList
                  data={users}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => ((!addedUserId.some(user => user.id === item.id)) && (item.id !== currentUserData?.id)) && (
                    <TouchableOpacity
                      style={styles.settingsOption}
                      onPress={() => setAddedUserId([...addedUserId, item])}
                    >
                      <Text style={styles.settingsOptionText}>{item.username} ({item.email})</Text>
                      <SimpleCheckbox
                        label=""
                        checked={false}
                        onChange={() => {}}
                      />
                    </TouchableOpacity>
                  ) || (
                    <></>
                  ) }
                  ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
                />
              </View>
            )}

            {/* Create Group Information */}
            { createGroupState === 2 && (
              <View>
                <Text style={styles.settingsSubtitle}>Create Group</Text>

                <TouchableOpacity
                  style={styles.profileImageWrapper}
                  onPress={pickGroupProfile}
                >
                  {groupPhoto ? (
                    <Image source={{ uri: groupPhoto }} style={styles.profileImage} />
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
                  placeholder="Group Name"
                  style={styles.input}
                  placeholderTextColor="#666"
                  onChangeText={(text) => setGroupName(text)}
                />

                <TextInput
                  placeholder="Group Description"
                  style={styles.input}
                  placeholderTextColor="#666"
                  onChangeText={(text) => setGroupDescription(text)}
                />

                <View style={styles.line} />

                <TouchableOpacity
                  style={styles.createGroupButton}
                  onPress={() => handleCreateGroup()}
                >
                  <Text style={styles.createGroupButtonText}>Create Group</Text>
                </TouchableOpacity>
              </View>
            )}
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
    marginBottom: 16,
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
    marginBottom: 10,
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  settingsOptionText: {
    fontSize: 16,
    color: '#000',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
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
  icon: {
    marginRight: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 6,
  },
  line: {
    paddingTop: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // Light gray background
    marginBottom: 8,
  },
  groupCreationSection: {
    marginTop: 20,
  },
  createGroupButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  createGroupButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
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

export default NewChatPanel;
