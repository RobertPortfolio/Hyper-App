import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyNotesToExercisesInCurrentMesocycle } from '../../redux/slices/mesocycles-slice';
import TooltipExplanation from '../tooltip-explanation';

const NotesExerciseForm = ({ exerciseId, prevNotes, handleCancel }) => {

    const [ notes, setNotes ] = useState(prevNotes || '');

    const { exercises } = useSelector((state) => state.exercises);

    const dispatch = useDispatch();

    const handleChangeNotes = (e) => {
        const { value } = e.target;

        setNotes(value);
    }

    const handleSaveNotes = () => {
        dispatch(applyNotesToExercisesInCurrentMesocycle({
            exerciseId, notes
        }))
    }

    return (    
        <div>
            <div>
                Новая заметка 
                <TooltipExplanation label='' explanation='Данная заметка применится к этому упражнению для всего мезоцикла'/>
            </div>
            <div className='font-size-secondary text-secondary mb-2'>
                Для упражнения {exercises.find((exercise) => exercise._id === exerciseId).name}
            </div>

            <textarea
                type="text"
                id="notes"
                name='notes'
                value={notes}
                onChange={handleChangeNotes}
                className='form-control input-custom text-light text-center rounded-0 mb-3'
                placeholder=''
                required
            >
            </textarea>
            <div className='d-flex justify-content-end'>
                <button 
                    className='btn-secondary me-2'
                    onClick={handleCancel}
                >
                    Закрыть
                </button>
                <button 
                    className='btn-main'
                    onClick={handleSaveNotes}
                >
                    Сохранить
                </button>
            </div>
            
        </div>
    )
}

export default NotesExerciseForm;