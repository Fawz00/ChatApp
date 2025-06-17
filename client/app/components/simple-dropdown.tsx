import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SimpleDropdownProps {
  displayText: string;
  dropdownOptions: string[];
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  selected: string;
  setSelected: (value: string) => void;
  onSelectionChanged?: () => void;
}

const SimpleDropdownProps: React.FC<SimpleDropdownProps> = ({
  displayText,
  dropdownOptions,
  visibility,
  setVisibility,
  selected,
  setSelected,
  onSelectionChanged,
}) => {

  return (
    <View style={styles.settingsOptionWrap}>
      <View style={styles.settingsOption}>
        <Text style={styles.settingsOptionText}>{displayText}</Text>
        <TouchableOpacity style={styles.selectButton}
          onPress={() => setVisibility(!visibility)}
        >
          <Text style={styles.selectButtonText}>{selected ? selected : "Select"}</Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      {visibility && (
          <View style={styles.dropdownOptions}>
            {dropdownOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelected(option);
                  setVisibility(false);
                  
                  if (onSelectionChanged) {
                    onSelectionChanged();
                  }
                }}
                style={styles.dropdownOption}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  settingsOptionWrap: {
    marginBottom: 20,
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
  dropdownOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

export default SimpleDropdownProps;