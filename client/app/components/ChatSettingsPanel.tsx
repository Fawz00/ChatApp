// components/ChatSettingsPanel.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatSettingsPanelProps {
  onClose: () => void;
  isVisible: boolean;
  onArchiveAllChats: () => void;
  onClearAllMessages: () => void;
  onDeleteAllChats: () => void;
}

const ChatSettingsPanel: React.FC<ChatSettingsPanelProps> = ({
  onClose,
  isVisible,
  onArchiveAllChats,
  onClearAllMessages,
  onDeleteAllChats,
}) => {
  if (!isVisible) {
    return null; // Jangan render apa pun jika tidak terlihat
  }

  return (
    <View style={styles.settingsPanel}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>Chats</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Archive all chats */}
      <TouchableOpacity style={styles.actionButton} onPress={onArchiveAllChats}>
        <Text style={styles.actionButtonText}>Archive all chats</Text>
        <Text style={styles.actionButtonDescription}>
          Delete all messages and clear the chats from your history
        </Text>
      </TouchableOpacity>

      {/* Clear all messages */}
      <TouchableOpacity style={styles.actionButton} onPress={onClearAllMessages}>
        <Text style={styles.actionButtonText}>Clear all messages</Text>
        <Text style={styles.actionButtonDescription}>
          Delete all messages from chats and groups
        </Text>
      </TouchableOpacity>

      {/* Delete all chats */}
      <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDeleteAllChats}>
        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete all chats</Text>
        <Text style={[styles.actionButtonDescription, styles.deleteButtonDescription]}>
          Delete all messages and clear the chats form your history
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsPanel: {
    position: 'absolute',
    top: 0,
    left: 0, // Menggunakan 'left' agar muncul dari kiri seperti gambar
    width: 280, // Sesuaikan lebar sesuai kebutuhan
    height: '100%',
    backgroundColor: '#8A2BE2', // Warna ungu dari gambar
    padding: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
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
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#AD88C6', // Warna background tombol
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  actionButtonDescription: {
    fontSize: 12,
    color: '#eee',
  },
  deleteButton: {
    backgroundColor: '#F56565', // Warna merah untuk tombol delete
  },
  deleteButtonText: {
    color: '#fff',
  },
  deleteButtonDescription: {
    color: '#fee2e2',
  },
});

export default ChatSettingsPanel;