// components/SettingsPanel.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, useWindowDimensions, TextInput, FlatList } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { API_URL, useAuth, UserScheme } from '@/app/api/AuthProvider';
import CheckBox from '@react-native-community/checkbox';

interface NewChatPanel {
  onClose: () => void;
  isVisible: boolean;
}

const NewChatPanel: React.FC<NewChatPanel> = ({ onClose, isVisible }) => {
  const { token, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserScheme[]>([]);

  const [createGroupState, setCreateGroupState] = useState(0);
  const [addedUserId, setAddedUserId] = useState<string[]>([]);
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
  // API Calls
  // ============================================

  // Fungsi untuk membuat chat baru
  const handleCreateChat = async (addedId: string) => {
    try {
      console.log("Creating chat with user ID:", addedId);
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

        setGroupName("");
        setGroupDescription("");
        setGroupPhoto(null);
        setUsers([]);
        setAddedUserId([]);
        setCreateGroupState(0);
      } else {
        const errorData = await response.json();
        console.error("Error creating group:", errorData.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  }

  // Fungsi untuk membuat grup baru
  const handleCreateGroup = async () => {
    if (!groupName.trim() || addedUserId.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("userIds", JSON.stringify(addedUserId));
      formData.append("isGroup", "true");
      formData.append("name", groupName);
      
      if (groupDescription) {
        formData.append("description", groupDescription);
      }
      if (groupPhoto) {
        formData.append("groupPhoto", new Blob([], {
          type: 'image/jpeg',
        }));
      }

      const response = await fetch(`${API_URL}/chat/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseJson = await response.json();

        setGroupName("");
        setGroupDescription("");
        setGroupPhoto(null);
        setUsers([]);
        setAddedUserId([]);
        setCreateGroupState(0);
      } else {
        const errorData = await response.json();
        console.error("Error creating group:", errorData.message);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

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
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.settingsOption}
                    onPress={() => handleCreateChat(item.id)}
                  >
                      <Text style={styles.settingsOptionText}>{item.username} ({item.email})</Text>
                    </TouchableOpacity>
                  )}
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
                  <TouchableOpacity
                    style={styles.createGroupButton}
                    onPress={handleCreateGroup}
                  >
                    <Text style={styles.createGroupButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.settingsOption}>
                      <Text style={styles.settingsOptionText}>{item.username} ({item.email})</Text>
                      <CheckBox
                        disabled={false}
                        onValueChange={(val) => {
                          if (val) {
                            setAddedUserId([...addedUserId, item.id]);
                          } else {
                            setAddedUserId(addedUserId.filter(id => id !== item.id));
                          }
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
                />
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
    borderBottomWidth: 2,
    borderBottomColor: "#e0e0e0",
    marginBottom: 24,
    paddingBottom: 6,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // Light gray background
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
});

export default NewChatPanel;
