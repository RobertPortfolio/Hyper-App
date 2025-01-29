import React, { useState, useEffect, useRef } from 'react';
import './options-menu.css';

const OptionsMenu = ({ options, direction, header }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const style = direction === 'left' ? { left: 0 } : { right: 0 };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Очистка обработчика при размонтировании
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="options-menu position-relative width-20 text-center" ref={menuRef}>
      <button className="w-100" onClick={toggleMenu}>
        <i className="fa-solid fa-ellipsis-v"></i>
      </button>
      {isOpen && (
        <ul
          className="dropdown-menu show bg-dark text-light font-size-secondary rounded-0"
          style={style}
        >
          {header && <li className="dropdown-header">{header}</li>}
          {options.map((option, index) => (
            <li key={index}>
              <button
                className={`dropdown-item w-100 ${option.className || ''}`}
                onClick={() => {
                  option.action();
                  toggleMenu();
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OptionsMenu;