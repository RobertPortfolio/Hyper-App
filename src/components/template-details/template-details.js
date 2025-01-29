import React, { useState } from 'react';
import { days, muscleGroups, getName } from '../../assets/assets';

const TemplateDetails = ({ template, handleNavigateToCreateMesocycle, handleCancel }) => {

    const [ selectedDay, setSelectedDay ] = useState(template.days[0]);

    const getShortName = (list, Id) => {
        const item = list.find(item => item.id === Number(Id));
        return item ? item.ruShortName : 'Unknown';
    };
    
    return(
        <div>
            <h5 className='mb-4'>{template.name}</h5>
            <div className='bg-black d-flex justify-content-around p-1 rounded-3 mb-3'>
                {template.days.map((day) => 
                    <button 
                        key={day._id} 
                        className={`w-100 btn ${day===selectedDay ? 'btn-light' : 'text-light'}`}
                        onClick={()=>setSelectedDay(day)}
                        >
                        {getShortName(days, day.dayId)}
                    </button>
                )}
            </div>

            <div className='mb-5'>
                {selectedDay.exercises.map((exercise) => 
                    <div key={exercise._id} className='mb-2'>
                        {getName(muscleGroups, exercise.targetMuscleGroupId)}
                    </div>
                )}
            </div>
            

            <div className='d-flex justify-content-end'>
                <button 
                    className='btn-secondary me-2'
                    onClick={handleCancel}>
                    Закрыть
                </button>
                <button 
                    className='btn-main'
                    onClick={handleNavigateToCreateMesocycle}>
                    Составить мезоцикл
                </button>
            </div>
        </div>
    )
}

export default TemplateDetails;