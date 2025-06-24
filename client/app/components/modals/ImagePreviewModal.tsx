import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ImagePreviewModalProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onDownload?: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  imageUrl,
  onClose,
  onDownload,
}) => {
  if (!visible || !imageUrl) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = imageUrl.split('/').pop() || 'image';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        {/* Background Overlay */}
        <TouchableOpacity style={styles.background} onPress={onClose} activeOpacity={1} />

        {/* Container Gambar */}
        <Image source={{ uri: imageUrl }} style={styles.fullscreenImage} />

        {/* Tombol Close */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close-circle" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Tombol Download */}
        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  fullscreenImage: {
    width: '95%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
  },
  downloadButton: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  downloadButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});