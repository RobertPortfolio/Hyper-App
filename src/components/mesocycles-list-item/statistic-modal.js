import React from 'react';
import { Modal } from 'react-bootstrap';
import { muscleGroups, getName } from '../../assets/assets';
import TooltipExplanation from '../tooltip-explanation';
import './mesocycles-list-item.css';

const StatisticModal = ({ mesocycle, statisticIsOpen, setStatisticIsOpen }) => {
    const calculateStats = (mesocycle) => {
        const muscleGroups = new Map();

        mesocycle.weeks.forEach(week => {
            week.days.forEach(day => {
                day.exercises.forEach(exercise => {
                    const group = exercise.targetMuscleGroupId;
                    const sets = exercise.sets.filter(set => set.isDone).length;
                    
                    if (!muscleGroups.has(group)) {
                        muscleGroups.set(group, Array(mesocycle.weeks.length).fill(0));
                    }
                    
                    muscleGroups.get(group)[week.number - 1] += sets;
                });
            });
        });

        return Array.from(muscleGroups.entries());
    };

    const stats = calculateStats(mesocycle);

    const getBarStyle = (sets) => {
        let height = sets * 2; // Увеличиваем высоту столбика для лучшей видимости
        let color = '#e0aaff'; // Серый по умолчанию (цвет для 0-4)

        if (sets >= 30) {height = 60; color = '#10002b';} 
        else if (sets >= 25) color = '#240046';
        else if (sets >= 20) color = '#3c096c';
        else if (sets >= 15) color = '#5a189a'; 
        else if (sets >= 10) color = '#7b2cbf';
        else if (sets >= 5) color = '#9d4edd';
        else if (sets > 0) color = '#c77dff';
        
        return {
            display: 'block', // Чтобы столбик не растягивался
            width: '30px', // Устанавливаем фиксированную ширину
            padding: `${height}px 5px 0px`, // Высота зависит от числа подходов
            backgroundColor: color,
        };
    };
    
    return(
        <Modal 
            show={statisticIsOpen}
            onHide={() => setStatisticIsOpen(false)}
        >
            <Modal.Header closeButton closeVariant='white' className="bg-dark border-0">
                <div>
                    <div>
                        Статистика мезоцикла {mesocycle.name}
                        <TooltipExplanation label='' explanation='Статистика отображает количество подходов на определенную группу мышц в неделю.'/>
                    </div>
                    
                        
                    
                </div>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
                <div> 
                    <table className='table table-dark'>
                        <thead>
                            <tr>
                                <th></th>
                                {mesocycle.weeks.map((week, idx) => (
                                    <th key={idx}>Нед. {week.number}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map(([group, sets], idx) => (
                                <tr key={idx}>
                                    <td>{getName(muscleGroups, group)}</td>
                                    {sets.map((set, idx2) => (
                                        <td key={idx2} className=''>
                                            <span style={getBarStyle(set)}>{set}</span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='d-flex justify-content-end mt-4'>
                        <button 
                            className='btn-secondary'
                            onClick={() => setStatisticIsOpen(false)}
                        >
                            Закрыть
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default StatisticModal;