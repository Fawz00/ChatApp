import React from 'react';
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

// Tipe data
interface UserScheme {
  id: string;
  username?: string;
  profilePhoto?: string;
}

interface GroupInfoModalProps {
  visible: boolean;
  groupName: string;
  groupPhoto?: string;
  participants: UserScheme[];
  currentUser: UserScheme | undefined;
  isAdmin: boolean;
  onLeaveGroup: () => void;
  onClose: () => void;
}

export const GroupInfoModal: React.FC<GroupInfoModalProps> = ({
  visible,
  groupName,
  groupPhoto,
  participants,
  currentUser,
  isAdmin,
  onLeaveGroup,
  onClose,
}) => {

  const renderParticipant = ({ item }: { item: UserScheme }) => (
    <View style={styles.participantItem}>
      {/* Avatar Partisipant */}
      <Image
        source={{
        uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.username || 'User')}&background=random`
        }}
        style={styles.avatar}
      />
      {/* Nama Pengguna */}
      <Text style={styles.participantName}>{item.username || 'Unknown User'}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
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
            {groupPhoto ? (
              <Image source={{ uri: groupPhoto }} style={styles.groupAvatar} />
            ) : (
              <View style={styles.groupAvatarPlaceholder}>
                <Text style={styles.groupInitial}>
                  {groupName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.groupName}>{groupName}</Text>
          </View>

          {/* Daftar Partisipant */}
          <FlatList
            data={participants}
            keyExtractor={(item) => item.id}
            renderItem={renderParticipant}
            contentContainerStyle={styles.participantsList}
          />

          {/* Tombol Leave Group */}
          <TouchableOpacity style={styles.leaveButton} onPress={onLeaveGroup}>
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </TouchableOpacity>
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
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
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
  },
  participantsList: {
    width: '100%',
    paddingHorizontal: 10,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
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
  participantName: {
    fontSize: 16,
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
});