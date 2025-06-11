// components/SettingsPanel.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsPanel {
  onClose: () => void;
  isVisible: boolean;
}

const SettingsPanel: React.FC<SettingsPanel> = ({ onClose, isVisible }) => {
  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  return (
    <View style={styles.settingsPanel}>
      <View style={styles.settingsHeader}>
        <Text style={styles.settingsTitle}>Account</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#1f1f1f" />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsOption}>
        <Text style={styles.settingsOptionText}>Privacy</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsOption}>
        <Text style={styles.settingsOptionText}>Last seen</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsOption}>
        <Text style={styles.settingsOptionText}>Profile photo</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsOption}>
        <Text style={styles.settingsOptionText}>About me</Text>
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Select</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingsPanel: {
    padding: 20,
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  selectButtonText: {
    marginRight: 5,
    color: '#000',
  },
});

export default SettingsPanel;