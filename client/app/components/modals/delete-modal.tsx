// components/modals/DeleteChatModal.tsx
import React from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface DeleteChatModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteChatModal: React.FC<DeleteChatModalProps> = ({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Chat Room</Text>
          <Text style={styles.modalText}>
            Are you sure you want to delete this chat room? This action cannot be undone.
          </Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#ef4444" />
          ) : (
            <>
              <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
                <Text style={styles.btnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={onConfirm}>
                <Text style={styles.btnTextDelete}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    minWidth: 280,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  btnCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  btnDelete: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: '#ef4444',
    minWidth: 120,
    alignItems: 'center',
  },
  btnTextCancel: {
    fontWeight: '500',
    color: '#333',
  },
  btnTextDelete: {
    fontWeight: '500',
    color: '#fff',
  },
});