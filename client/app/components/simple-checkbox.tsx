import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export const SimpleCheckbox: React.FC<Props> = ({ label, checked, onChange, disabled }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onChange(!checked)}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <View style={[styles.box, checked && styles.boxChecked, disabled && styles.boxDisabled]}>
        {checked && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
      {label && <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#4b5563',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  boxChecked: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  boxDisabled: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
  },
  label: {
    fontSize: 14,
    color: '#111827',
  },
  labelDisabled: {
    color: '#9ca3af',
  },
});
