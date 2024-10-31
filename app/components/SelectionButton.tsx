import React from 'react';

interface SelectionButtonProps {
  option: string;
  isSelected: boolean;
  onSelect: (option: string) => void;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({ option, isSelected, onSelect }) => {
  return (
    <button
      className={`m-2 p-2 border-2 rounded-full ${
        isSelected ? 'bg-custom-orange text-white' : 'bg-white text-custom-orange border-custom-orange'
      }`}
      onClick={() => onSelect(option)}
    >
      {option}
    </button>
  );
};

export default SelectionButton;
