import React from 'react';
import Switch from 'react-switch';
import './toggle.css';

interface IToggleSwitchProps {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<IToggleSwitchProps> = ({ name, label, checked, onChange }) => {
  return (
    <div className="toggle-switch">
      <label>
        {label}
      </label>
      <Switch
        onChange={onChange}
        checked={checked}
        name={name}
        onHandleColor="#ffffff" // Белый цвет для ручки
        offColor="#ccc" // Серый цвет для выключенного состояния
        offHandleColor="#ffffff" // Белый цвет для ручки
        handleDiameter={12} // Диаметр ручки
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        height={20} // Высота переключателя
        width={40} // Ширина переключателя
        className={`react-switch ${checked ? 'checked' : 'unchecked'}`} // Добавляем классы для стилизации
      />
    </div>
  );
};

export default ToggleSwitch;
