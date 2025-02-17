import React from 'react';
import { useSelector } from 'react-redux';
import { muscleGroups } from '../../assets/assets';
import OptionsMenu from '../options-menu';
import { handleDeleteExercise, handleChangeExercise, handleMoveExercise } from '../../utils/template-functions';
import './template-exercise-item.css';

const TemplateExerciseItem = ({ exercise, dayIndex, exerciseIndex, setTemplateData }) => {
    
    const { exercises } = useSelector((state) => state.exercises);

    return(
        <div>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <span className='template-exercise-item-muscle-group'>
                    {muscleGroups.find((group) => group.id === Number(exercise.targetMuscleGroupId))?.ruName || "Unknown Muscle Group"}
                </span>
                <OptionsMenu
                    header='Упражнение'
                    options={[
                        {
                            label: 'Переместить выше',
                            action: ()=>handleMoveExercise(setTemplateData, dayIndex, exerciseIndex, 'up'),
                            className: 'text-light',
                            icon: 'fa fa-arrow-up',
                        },
                        {
                            label: 'Переместить ниже',
                            action: ()=>handleMoveExercise(setTemplateData, dayIndex, exerciseIndex, 'down'),
                            className: 'text-light',
                            icon: 'fa fa-arrow-down',
                        },
                        {
                            label: 'Удалить',
                            action: ()=>handleDeleteExercise(setTemplateData, dayIndex, exerciseIndex),
                            className: 'text-danger',
                            icon: 'fa fa-trash',
                        },
                    ]}
                    direction='right'
                />
            </div>
            <select
                id="exerciseId"
                name="exerciseId"
                value={exercise.exerciseId}
                onChange={(e) => handleChangeExercise(setTemplateData, e, dayIndex, exerciseIndex)}
                className={`form-control input-custom text-light font-size-secondary rounded-0 border-secondary select-with-arrow
                    ${exercise.isValid === false && exercise.exerciseId==='' ? "is-invalid border-danger" : ""}`}
            >
                <option value="">Выберите упражнение</option>
                {exercises  
                    .filter((exerciseItem) => 
                        Number(exerciseItem.targetMuscleGroupId) === Number(exercise.targetMuscleGroupId)
                    )
                    .map((exerciseItem) => (
                        <option key={exerciseItem._id} value={exerciseItem._id}>
                            {exerciseItem.name}
                        </option>
                    ))}
            </select>
        </div>
    )
}

export default TemplateExerciseItem;