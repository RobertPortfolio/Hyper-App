import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import Spinner from '../spinner';
import { muscleGroups } from '../../assets/assets';
import { addExercise } from '../../redux/slices/mesocycles-slice';
import TooltipExplanation from '../tooltip-explanation';

const ModalAddExercise = ( {isOpenNewExerciseForm, setIsOpenNewExerciseForm }) => {

    const dispatch = useDispatch();

    const { exercises, status } = useSelector((state) => state.exercises);

    const [ muscleGroup, setMuscleGroup ] = useState(null);

    const handleAddExercise = (exerciseId) => {
        dispatch(addExercise({
            targetMuscleGroupId: String(muscleGroup),
            exerciseId: exerciseId,
            notes: exercises.find((exerciseItem) => exerciseItem._id === exerciseId)?.notes ?? '',
        }));
        setIsOpenNewExerciseForm(false);
    }

    if(status === 'loading' || status === 'idle') {
        return <Spinner />
    }

    return(
        <Modal 
            show={isOpenNewExerciseForm}
            onHide={() => setIsOpenNewExerciseForm(false)}
        >
            <Modal.Header closeButton closeVariant="white" className="bg-component border-0">
                <div>
                    <h5>Добавить упражнение <TooltipExplanation label='' explanation='Если в списке не будет необходимого упражнения, то вы можете добавить его в Меню -> Пользовательские упражнения -> Добавить'/></h5>
                </div>
            </Modal.Header>
            <Modal.Body className='bg-component'>
                {!muscleGroup && <div className='mb-3'>
                    <div className='mb-3'>Выберите группу мышц</div>
                    <div className="row row-cols-2 g-3">
                        {muscleGroups.map((group) => (
                            <div key={group.id} className="col d-flex">
                                <button
                                    className="btn-main w-100 text-center"
                                    onClick={() => setMuscleGroup(group.id)}
                                >
                                    {group.ruName}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>}
                {muscleGroup && 
                    <div>
                        <div className='text-secondary mb-3'>Выберите упражнение для {muscleGroups.find((group) => group.id === Number(muscleGroup))?.ruName || "Unknown Muscle Group"}</div>
                        {exercises
                            .filter((exerciseItem) => Number(exerciseItem.targetMuscleGroupId) === muscleGroup)
                            .map((filteredExercise) => (
                                <div key={filteredExercise._id} className='mb-2'>
                                    <button className='text-primary text-decoration-underline' onClick={()=>handleAddExercise(filteredExercise._id)}>
                                        {filteredExercise.name}
                                    </button>
                                </div>
                        ))}
                    </div>
                }
                <div className='d-flex justify-content-end mt-4'>
                    {muscleGroup && <button
                        className="btn-secondary font-size-secondary me-2"
                        onClick={() => setMuscleGroup(null)}
                    >
                        <i className="fa fa-arrow-left me-2"/>Назад
                    </button>}
                    <button 
                        className='btn-secondary'
                        onClick={() => setIsOpenNewExerciseForm(false)}
                    >
                        Закрыть
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalAddExercise;