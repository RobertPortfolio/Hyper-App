import React from 'react';

const InputSetType = ({ label }) => {
    return (
        <span
            style={{
                position: 'absolute',
                top: '-10px', // Сдвигаем надпись вверх
                right: '-10px', // Сдвигаем надпись вправо
                fontSize: '12px',
                color: '#fff', // Белый текст
                background: '#000', // Черный фон для контраста
                padding: '2px 4px',
                borderRadius: '4px',
            }}
        >
            {label}
        </span>
    )
}

export default InputSetType;