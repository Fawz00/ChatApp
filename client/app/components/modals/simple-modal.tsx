import { Text, View, Modal, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

interface ModalPopupProps {
  visible: boolean;
  message: string;
  isLoading?: boolean;
  onClose: () => void;
}

export const SimpleModal: React.FC<ModalPopupProps> = ({
  visible,
  message,
  isLoading = false,
  onClose,
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalView}>
      <View style={styles.modalContent}>
        <Text style={styles.modalText}>{message}</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#1e3a8a" />
        ) : (
          <TouchableOpacity style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 15,
    maxWidth: 800,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#323232",
  },
  btnText: {
    fontWeight: '500',
    color: '#fff',
  },
});