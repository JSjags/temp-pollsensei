import React from "react";

interface SwitchProps {
  isChecked: boolean;
  onClick: () => void;
}

const Switch: React.FC<SwitchProps> = ({ isChecked, onClick }) => {
  return (
    <div
      className={`toggle-icon-container relative flex items-center ${
        isChecked ? "is-checked" : ""
      }`}
      onClick={onClick}
      role="button"
    >
      <div
        className={`toggle-button absolute rounded-full ${
          isChecked ? "translate-x-6" : ""
        }`}
      ></div>
    </div>
  );
};

export default Switch;
