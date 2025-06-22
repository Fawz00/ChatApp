// components/WebCompatibleDateTimePicker.tsx
import React from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Untuk Web
interface WebDateTimePickerProps {
  value: Date;
  mode: 'date' | 'time' | 'datetime';
  onChange: (date: Date | undefined) => void;
}

const WebDateTimePicker: React.FC<WebDateTimePickerProps> = ({ value, mode, onChange }) => {
  const [date, setDate] = React.useState<string>(value.toISOString().slice(0, 16));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    const newDate = new Date(newDateStr);
    setDate(newDateStr);
    onChange(newDate);
  };

  return (
    <input
      type={mode === 'date' ? 'date' : mode === 'time' ? 'time' : 'datetime-local'}
      value={date}
      onChange={handleChange}
      style={{
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
      }}
    />
  );
};

// Komponen Universal
interface UniversalDateTimePickerProps {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  display?: string;
  onChange: (event: any, date?: Date) => void;
}

export default function UniversalDateTimePicker({
  value,
  mode = 'datetime',
  display = 'default',
  onChange,
}: UniversalDateTimePickerProps) {
  if (Platform.OS === 'web') {
    return (
      <WebDateTimePicker
        value={value}
        mode={mode}
        onChange={(date) => onChange(null, date)}
      />
    );
  }

  // Mobile menggunakan DateTimePicker original
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display={display as any}
      onChange={(event, date) => onChange(event, date || undefined)}
    />
  );
}