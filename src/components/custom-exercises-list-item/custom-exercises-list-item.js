import React from 'react';
import { useDispatch } from 'react-redux';
import { equipment, muscleGroups, getName } from '../../assets/assets';
import OptionsMenu from '../options-menu';
import { deleteExerciseThunk } from '../../redux/slices/exercises-slice';

const CustomExercisesListItem = ({ exercise }) => {

    const dispatch = useDispatch();

    const handleDeleteExercise = () => {
        dispatch(deleteExerciseThunk(exercise))
    } 

    return (
        <div className="card rounded-0 bg-component">
            <div className="card-body d-flex justify-content-between">
                <div>
                    <div className='text-secondary font-size-secondary'>
                        {getName(muscleGroups, exercise.targetMuscleGroupId)}
                    </div>
                    <div className='text-light'>
                        {exercise.name}
                    </div>
                    <div className='text-secondary font-size-secondary'>
                        {getName(equipment, exercise.equipmentId)}
                    </div>
                    {exercise.notes && 
                    <div className='notes-container mt-1'>
                        <span className='fa fa-pencil-alt'></span>
                        <span>{exercise.notes}</span>
                    </div>
                    }
                </div>
                <div className='text-light'>
                    <OptionsMenu
                        options={[
                            {
                                label: 'Удалить упражнение',
                                action: handleDeleteExercise,
                                className: 'text-danger',
                                icon: 'fa fa-trash',
                            },
                        ]}
                        direction='right'
                        header='Упражнение'
                    />
                </div>
                
            </div>
        </div>
    )
}

export default CustomExercisesListItem;