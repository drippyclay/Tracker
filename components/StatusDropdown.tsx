
import React from 'react';
import { Status } from '../types';
import { STATUS_OPTIONS, STATUS_COLORS } from '../constants';

interface StatusDropdownProps {
  value: Status;
  onChange: (value: Status) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Status)}
      className={`block w-full text-xs font-semibold px-2 py-1.5 rounded-md border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300 ${STATUS_COLORS[value]}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
};

export default StatusDropdown;
