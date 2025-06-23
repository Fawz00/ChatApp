import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AddMemberModal } from './AddMemberModal';
import { API_URL, API_URL_BASE, ChatScheme, useAuth, UserScheme } from '@/app/api/AuthProvider';
import mime from 'mime';
import { useDrawerContext } from '../drawer/app-drawer-navigation';

interface GroupInfoModalProps {
  getModal: {
    message: string;
    isLoading: boolean;
    visible: boolean;
  };
  setModal: (modal: {
    message: string;
    isLoading: boolean;
    visible: boolean;
  }) => void;
  visibility: boolean;
  groupData: ChatScheme;
  currentUser: UserScheme | undefined;
  onClose: () => void;
}

export const GroupInfoModal: React.FC<GroupInfoModalProps> = ({
  getModal,
  setModal,
  visibility,
  groupData,
  currentUser,
  onClose,
}) => {
  const { token, logout } = useAuth();
  const { setRefreshMessages, refreshMessages, setRefreshSidebar, refreshSidebar, base64ToBlob } = useDrawerContext();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  // const [localGroupData, setLocalGroupData] = useState<ChatScheme>(groupData);

  const isCurrentUserAdmin = groupData.admins.some(a => a.id === currentUser?.id);

  function refresh() {
    setRefreshMessages(!refreshMessages);
    setRefreshSidebar(!refreshSidebar);  
  }

  const handlePromoteAdmin = async (user: UserScheme) => {
    try {
      setModal({ ...getModal, isLoading: true, visible: true });

      const formData = new FormData();
      formData.append('addAdmins', JSON.stringify([user.id]));

      const response = await fetch(`${API_URL}/chat/${groupData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (response.ok) {
        refresh();
        setModal({
          ...getModal,
          isLoading: false,
          visible: false,
        })
      } else if (response.status === 401) {
        logout();
      } else {
        setModal({
          ...getModal,
          visible: true,
          isLoading: false,
          message: responseJson.message || 'Promote admin failed',
        });
        console.error("Promote admin error:", responseJson.message);
      }
    } catch (error) {
      setModal({
        ...getModal,
        visible: true,
        isLoading: false,
        message: `Failed to send media.\n${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.error("Send media error:", error);
    }
  };

  const handleDemoteAdmin = async (user: UserScheme) => {
    try {
      setModal({ ...getModal, isLoading: true, visible: true });

      const formData = new FormData();
      formData.append('removeAdmins', JSON.stringify([user.id]));

      const response = await fetch(`${API_URL}/chat/${groupData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (response.ok) {
        refresh();
        setModal({
          ...getModal,
          isLoading: false,
          visible: false,
        })
      } else if (response.status === 401) {
        logout();
      } else {
        setModal({
          ...getModal,
          visible: true,
          isLoading: false,
          message: responseJson.message || 'Demote admin failed',
        });
        console.error("Demote admin error:", responseJson.message);
      }
    } catch (error) {
      console.error("Send media error:", error);
      setModal({
        ...getModal,
        visible: true,
        isLoading: false,
        message: `Failed to send media.\n${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const handleAddParticipant = async (users: UserScheme[]) => {
    try {
      setModal({ ...getModal, isLoading: true, visible: true });

      const formData = new FormData();
      formData.append('addParticipants', JSON.stringify(users.map(u => u.id)));

      const response = await fetch(`${API_URL}/chat/${groupData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (response.ok) {
        refresh();
        setModal({
          ...getModal,
          isLoading: false,
          visible: false,
        })
      } else if (response.status === 401) {
        logout();
      } else {
        setModal({
          ...getModal,
          visible: true,
          isLoading: false,
          message: responseJson.message || 'Remove participant failed',
        });
        console.error("Send media error:", responseJson.message);
      }
    } catch (error) {
      console.error("Send media error:", error);
      setModal({
        ...getModal,
        visible: true,
        isLoading: false,
        message: `Failed to send media.\n${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const handleRemoveParticipant = async (user: UserScheme) => {
    try {
      setModal({ ...getModal, isLoading: true, visible: true });

      const formData = new FormData();
      formData.append('removeParticipants', JSON.stringify([user.id]));

      const response = await fetch(`${API_URL}/chat/${groupData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (response.ok) {
        refresh();
        setModal({
          ...getModal,
          isLoading: false,
          visible: false,
        })
      } else if (response.status === 401) {
        logout();
      } else {
        setModal({
          ...getModal,
          visible: true,
          isLoading: false,
          message: responseJson.message || 'Remove participant failed',
        });
        console.error("Send media error:", responseJson.message);
      }
    } catch (error) {
      console.error("Send media error:", error);
      setModal({
        ...getModal,
        visible: true,
        isLoading: false,
        message: `Failed to send media.\n${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setModal({ ...getModal, isLoading: true, visible: true });

      const response = await fetch(`${API_URL}/chat/leave/${groupData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseJson = await response.json();
      if (response.ok) {
        refresh();
        setModal({
          ...getModal,
          isLoading: false,
          visible: false,
        })
        onClose();
      } else if (response.status === 401) {
        logout();
      } else {
        setModal({
          ...getModal,
          visible: true,
          isLoading: false,
          message: responseJson.message || 'Remove participant failed',
        });
        console.error("Send media error:", responseJson.message);
      }
    } catch (error) {
      console.error("Send media error:", error);
      setModal({
        ...getModal,
        visible: true,
        isLoading: false,
        message: `Failed to send media.\n${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }

  const renderParticipant = ({ item }: { item: UserScheme }) => {
    const isItemAdmin = groupData.admins.some(a => a.id === item.id);
    const isCurrentUser = item.id === currentUser?.id;

    return (
      <View style={styles.participantItem}>
        {/* Avatar */}
        {item.profilePhoto ? (
          <Image
            source={{ uri: `${API_URL_BASE}/${item.profilePhoto}`.replace(/\\/g, "/") }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.teamText}>{item.username?.charAt(0).toUpperCase() || ''}</Text>
          </View>
        )}

        {/* Nama Pengguna */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.participantName}>
             {item.username || 'Unknown User'}
          </Text>
          {isItemAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#10b981" />
              <Text style={styles.adminLabel}>Admin</Text>
            </View>
          )}
        </View>

        {/* Aksi Admin */}
        {isCurrentUserAdmin && !isCurrentUser && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => {
                isItemAdmin ? handleDemoteAdmin(item) : handlePromoteAdmin(item);
              }}
              style={styles.promoteButton}
            >
              <Ionicons
                name={isItemAdmin ? 'remove-circle-outline' : 'star-outline'}
                size={20}
                color={isItemAdmin ? '#f59e0b' : '#10b981'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleRemoveParticipant(item)}
              style={styles.removeButton}
            >
              <Ionicons name="person-remove-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visibility} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Modal */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Group Info</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Foto Grup */}
          <View style={styles.groupHeader}>
            {groupData.groupPhoto ? (
              <Image
                source={{ uri: `${API_URL_BASE}/${groupData.groupPhoto}`.replace(/\\/g, "/") }}
                style={styles.groupAvatar}
              />
            ) : (
              <View style={styles.groupAvatarPlaceholder}>
                <Text style={styles.groupInitial}>
                  {groupData.name?.charAt(0)?.toUpperCase() || ""}
                </Text>
              </View>
            )}
            <Text style={styles.groupName}>{groupData.name}</Text>
          </View>

          {/* Daftar Partisipant */}
          <FlatList
            data={groupData.participants || []}
            keyExtractor={(item) => item.id}
            renderItem={renderParticipant}
            contentContainerStyle={styles.participantsList}
          />

          {/* Tombol Add Member (jika admin) */}
          {isCurrentUserAdmin && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddMemberModal(true)}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Member</Text>
            </TouchableOpacity>
          )}

          {/* Tombol Leave Group */}
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Tambah Anggota */}
      <AddMemberModal
        visible={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMembers={(newMembers) => {
          handleAddParticipant(newMembers);
          setShowAddMemberModal(false);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  groupHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  groupAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupInitial: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  groupName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  participantsList: {
    width: '100%',
    paddingHorizontal: 10,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  participantName: {
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 10,
  },
  promoteButton: {
    padding: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  removeButton: {
    padding: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  leaveButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#ef4444',
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },
  leaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#4f46e5',
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adminBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 8,
  paddingHorizontal: 6,
  paddingVertical: 2,
  backgroundColor: '#d1fae5',
  borderRadius: 12,
},
adminLabel: {
  marginLeft: 4,
  fontSize: 12,
  color: '#065f46',
  fontWeight: '600',
},
});