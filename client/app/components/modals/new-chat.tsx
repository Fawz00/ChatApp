// components/SettingsPanel.tsx
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, useWindowDimensions, TextInput, FlatList } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { API_URL, useAuth, UserScheme } from '@/app/api/AuthProvider';

interface NewChatPanel {
  onClose: () => void;
  isVisible: boolean;
}

const NewChatPanel: React.FC<NewChatPanel> = ({ onClose, isVisible }) => {
  const { token, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserScheme[]>([]);
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
            const responseJson = await response.json();
            if (response.ok) {
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
              <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.settingsOption}>
                    <Text style={styles.settingsOptionText}>{item.username} ({item.email})</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noResultsText}>No results found</Text>}
              />
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
});

export default NewChatPanel;
