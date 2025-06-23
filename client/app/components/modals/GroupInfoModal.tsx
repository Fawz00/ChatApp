import React, { useState } from 'react';
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
import { API_URL_BASE, ChatScheme, UserScheme } from '@/app/api/AuthProvider';

interface GroupInfoModalProps {
  visible: boolean;
  groupData: ChatScheme;
  currentUser: UserScheme | undefined;
  onLeaveGroup: () => void;
  onAddMembers: (newMembers: UserScheme[]) => void; // Callback saat anggota ditambahkan
  onClose: () => void;
}

export const GroupInfoModal: React.FC<GroupInfoModalProps> = ({
  visible,
  groupData,
  currentUser,
  onLeaveGroup,
  onAddMembers,
  onClose,
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  React.useEffect(() => {
    console.log(groupData.groupPhoto);
  }, []);

  const renderParticipant = ({ item }: { item: UserScheme }) => (
    <View style={styles.participantItem}>
      { item?.profilePhoto ? (
        <Image source={{ uri: `${API_URL_BASE}/${item.profilePhoto}`.replace(/\\/g, "/") }}
          style={styles.avatarPlaceholder}
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.teamText}>{item?.username?.charAt(0).toUpperCase() || ""}</Text>
        </View>
      )}
      <Text style={styles.participantName}>{item.username || 'Unknown User'}</Text>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          {/* Header Modal */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" /> 
            </TouchableOpacity>
            <Text style={styles.title}>Group Info</Text>
            <View style={{ width: 24 }} /> {/* Spacer */}
          </View>

          {/* Foto & Nama Grup */}
          <View style={styles.groupHeader}>
            {groupData.groupPhoto ? (
              <Image source={{ uri: `${API_URL_BASE}/${groupData.groupPhoto}`.replace(/\\/g, "/") }} style={styles.groupAvatar} />
            ) : (
              <View style={styles.groupAvatarPlaceholder}>
                <Text style={styles.groupInitial}>
                  {(groupData.name?.charAt(0)?.toUpperCase()) || ""}
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

          {/* Tombol Add Member (hanya muncul jika admin) */}
          {(groupData?.admins.some(a => a.id === currentUser?.id) || false) && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddMemberModal(true)}
            >
              <Ionicons name="person-add-outline" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Member</Text>
            </TouchableOpacity>
          )}

          {/* Tombol Leave Group */}
          <TouchableOpacity style={styles.leaveButton} onPress={onLeaveGroup}>
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Tambah Anggota */}
      <AddMemberModal
        visible={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMembers={(newMembers) => {
          onAddMembers(newMembers);
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
    color: '#fff',
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
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1d5db',
    marginBottom: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  participantName: {
    fontSize: 16,
    color: '#333',
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
});

