import React, { useState } from 'react';
import RubbishBin from '../rubbish-bin';
import ChooseOption from '../choose-option';
import './create-meso-day-list-item.css';

const CreateMesoDayListItem = () => {
    const [isChooseOptionVisible, setIsChooseOptionVisible] = useState(false); // Состояние для отображения модального окна
    const [selectedOption, setSelectedOption] = useState(""); // Состояние для выбранной опции

    const handleChooseOptionClick = () => {
        setIsChooseOptionVisible(true); // Показываем модальное окно
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option); // Обновляем выбранную опцию
        setIsChooseOptionVisible(false); // Закрываем модальное окно
    };

    return (
        <div className="card bg-card rounded-0 border-custom">
            <div className='card-body'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <span className="create-meso-day-list-item-muscle-group">
                        Квадрицепс
                    </span>
                    <span className='me-2'><RubbishBin action={() => console.log('sus')} /></span>
                </div>
                <div>
                    <div className={`p-2 border-custom ${selectedOption ? `bg-dark-3` : `text-secondary`}`} onClick={handleChooseOptionClick}>
                        <span>{selectedOption || "Choose exercise"}</span>
                    </div>
                </div>
            </div>

            {/* Модальное окно, которое отображается при клике */}
            <ChooseOption 
                show={isChooseOptionVisible}
                options={['Squat', 'Leg press', 'Hack-squat']}
                title='Exercise'
                subtitle='Choose an exercise'
                place='Day 3 Exerc 1'
                onOptionSelect={handleOptionSelect} // Передаем функцию для выбора опции
                onClose={() => setIsChooseOptionVisible(false)} // Функция для закрытия модального окна
            />
        </div>
    );
};

export default CreateMesoDayListItem;