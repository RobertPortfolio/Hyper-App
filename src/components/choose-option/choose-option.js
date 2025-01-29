import React from 'react';
import './choose-option.css';

const ChooseOption = ({ show, options, title, subtitle, place, onOptionSelect, onClose }) => {
    if (!show) return null;

    return (
        <div className="minimal-modal-overlay">
            <div className="minimal-modal">
                <div className="">
                    <div className="d-flex align-items-end flex-column">
                        <button className="close-button" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="title">{title}</span>
                        <span className="place">{place}</span>
                    </div>
                    <div className="subtitle mb-1">{subtitle}</div>
                </div>
                <div className="modal-body">
                    <ul className="option-list">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="option-item"
                                onClick={() => onOptionSelect(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ChooseOption;