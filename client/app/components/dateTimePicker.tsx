import { createElement } from "react";

export default function WebDateTimePicker({ value, onChange }: any) {
  
  return createElement('input', {
    type: 'date',
    value: value,
    onInput: onChange,
  })
}