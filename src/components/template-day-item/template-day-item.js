import React, { useState } from 'react';
import TemplateExerciseItem from '../template-exercise-item';
import { days as daysOfWeek, muscleGroups } from '../../assets/assets';
import { handleChangeDays, handleDeleteDay, handleAddExercise } from '../../utils/template-functions';
import './template-day-item.css';

const TemplateDayItem = ({ day, dayIndex, setTemplateData }) => {
    
    // Видимость модалки для выбора новой группы мышц в определенном дне
    const [modalData, setModalData] = useState(false);

    const handleModalOpen = () => {
        setModalData(true);
    };

    const handleModalClose = () => {
        setModalData(false);
    };

    const handleMuscleGroupSelect = (muscleGroupId) => {
        handleAddExercise(setTemplateData, dayIndex, muscleGroupId);
        handleModalClose();
    };

    return(
        <div className='border-purple p-2 template-day-width'> 
            <div className='d-flex mb-2'>
                <select
                    id="dayId"
                    name="dayId"
                    value={day.dayId}
                    onChange={(e) => handleChangeDays(setTemplateData, e, dayIndex)} // Передаем индекс
                    className={`form-control input-custom-exercise bg-dark text-light rounded-0 select-with-arrow 
                        ${day.isValid === false && day.dayId==='' ? "is-invalid border-danger" : ""}`}
                >
                    <option value="">Выберите день</option>
                    {daysOfWeek.map((dayOfWeek) => (
                        <option key={dayOfWeek.id} value={dayOfWeek.id}>
                            {dayOfWeek.ruName}
                        </option>
                    ))}
                </select>
                <button 
                    className=''
                    onClick={()=>handleDeleteDay(setTemplateData, dayIndex)}>
                    <i className='ms-3 me-2 fa fa-trash'/>
                </button>
            </div>
            {day.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className='p-3 bg-dark mb-2 border border-secondary'>
                    <TemplateExerciseItem 
                        exercise={exercise}
                        dayIndex={dayIndex}
                        exerciseIndex={exerciseIndex}
                        setTemplateData={setTemplateData}
                    />
                </div>
            ))}
            <div className='d-flex'>
                <button 
                    className='w-100 text-center btn-secondary bg-dark border border-secondary py-3' 
                    onClick={handleModalOpen}>
                    <i className='fa fa-add me-2'/>
                    Добавить группу мышц
                </button>
            </div>

            {/* Модалка для выбора группы мышц */}
            {modalData && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                <div className="modal-dialog">
                    <div className="modal-content bg-dark rounded-0">
                    <div className="modal-header">
                        <h5 className="modal-title">Выберите группу мышц</h5>
                        <div className='font-size-secondary text-secondary'>
                            {`День ${dayIndex+1} Упражнение ${day.exercises.length+1}`}
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="row row-cols-2 g-3">
                        {muscleGroups.map((group) => (
                            <div key={group.id} className="col d-flex">
                                <button
                                    className="btn-main w-100 text-center"
                                    onClick={() => handleMuscleGroupSelect(group.id)}
                                >
                                    {group.ruName}
                                </button>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                        type="button"
                        className="btn-secondary"
                        onClick={handleModalClose}
                        >
                        Закрыть
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}

export default TemplateDayItem;