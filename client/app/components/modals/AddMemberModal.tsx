import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL, API_URL_BASE, useAuth, UserScheme } from '@/app/api/AuthProvider';

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMembers: (members: UserScheme[]) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  visible,
  onClose,
  onAddMembers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserScheme[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { token } = useAuth(); // Ambil token dari context

  // Debounce search
  useEffect(() => {
    if (!token) return;

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Request timed out'));
          }, 7000);
        });

        const response = await Promise.race([
          fetch(`${API_URL}/user/search?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          }),
          timeoutPromise,
        ]);

        if (response instanceof Response) {
          if (response.ok) {
            const responseJson = await response.json();
            // Pastikan respons memiliki data array user
            setSearchResults(responseJson.data || []);
          } else if (response.status === 401) {
            logout();
          } else {
            const errorData = await response.json();
            console.warn(errorData.message || 'Search failed');
            setSearchResults([]);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setSearchResults([]);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [searchQuery, token]);

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = () => {
    const newMembers = searchResults.filter(u => selectedUsers.includes(u.id));
    onAddMembers(newMembers);
    onClose();
  };

  const renderUser = ({ item }: { item: UserScheme }) => {
    const isSelected = selectedUsers.includes(item.id);
    return (
      <TouchableOpacity style={styles.userItem} onPress={() => toggleSelectUser(item.id)}>
        <Image
          source={{
            uri: item.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || 'User')}&background=random`,
          }}
          style={styles.userAvatar}
        />
        <Text style={styles.userName}>{item.username}</Text>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color="#4f46e5" />} 
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Members</Text>

          {/* Input pencarian */}
          <TextInput
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />

          {/* Hasil pencarian */}
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderUser}
            contentContainerStyle={styles.userList}
          />

          {/* Tombol aksi */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
              <Text style={styles.btnCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAdd} onPress={handleSubmit}>
              <Text style={styles.btnAddText}>Add Selected</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  userList: {
    maxHeight: 200,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userName: {
    flex: 1,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btnCancel: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
  },
  btnCancelText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  btnAdd: {
    padding: 10,
    flex: 1,
    backgroundColor: '#4f44e5',
    borderRadius: 8,
    alignItems: 'center',
  },
  btnAddText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

function logout() {
    throw new Error('Function not implemented.');
}
