import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { muscleGroups, equipment, getName } from '../../assets/assets';
import { addSet, deleteExercise, replaceExercise, moveUpExercise, moveDownExercise } from '../../redux/slices/mesocycles-slice';
import OptionsMenu from '../options-menu';
import NotesExerciseForm from '../notes-exercise-form/notes-exercise-form';
import CurrentDayExerciseSetItem from './current-day-exercise-set-item';
import ModalExerciseHistory from './modal-exercise-history';
import './current-day-exercise-item.css';

const CurrentDayExerciseItem = ({ exercise, previousExerciseTargetMuscleGroupId }) => {

    const { exercises } = useSelector((state) => state.exercises);

    const dispatch = useDispatch();

    const exerciseData = exercises.find((exerciseItem) => exerciseItem._id === exercise.exerciseId);

    const [ isNotesFormOpen, setIsNotesFormOpen ] = useState(false);

    const [ isOpenExerciseList, setIsOpenExerciseList ] = useState(false);

    const [ isExerciseHistoryOpen, setIsExerciseHistoryOpen ] = useState(false);

    const compareExerciseTargetMuscleGroupId = () => {
        return previousExerciseTargetMuscleGroupId === exercise.targetMuscleGroupId
    }

    const handleAddSet = () => {
        dispatch(addSet({ 
            exerciseId: exercise._id, 
        }));
    }

    const handleDeleteExercise = () => {
        dispatch(deleteExercise({exerciseId: exercise._id}))
    }

    const handleReplaceExercise = (newExerciseId) => {
        dispatch(replaceExercise({ 
            exerciseId: exercise._id, 
            newExerciseId, 
            exercisesList: exercises
        }))
        setIsOpenExerciseList(false);
    }

    const handleMoveUpExercise = () => {
        dispatch(moveUpExercise({exerciseId: exercise._id}))
    }

    const handleMoveDownExercise = () => {
        dispatch(moveDownExercise({exerciseId: exercise._id}))
    }

    return(
        <div className={`position-relative bg-component p-3 ${!compareExerciseTargetMuscleGroupId() ? 'mt-45' : 'border-top border-secondary'}`}>
            {!compareExerciseTargetMuscleGroupId() &&
                <span className='create-meso-day-list-item-muscle-group muscle-group-position'>
                    {getName(muscleGroups, exercise.targetMuscleGroupId)}
                </span>
            }
            <div className='d-flex justify-content-between align-items-center mt-1'>
                <div>
                    {exerciseData ? 
                        <div>{exerciseData.name}</div> : 
                        <div>Unknown exercise</div>
                    }
                </div>
                <div className='me-2'>
                    <OptionsMenu
                        options={[
                            {
                                label: 'Добавить подход',
                                action: handleAddSet,
                                className: 'text-light',
                                icon: 'fa fa-add',
                            },
                            {
                                label: 'История',
                                action: () => setIsExerciseHistoryOpen(true),
                                className: 'text-light',
                                icon: 'fa fa-clipboard-list',
                            },
                            {
                                label: 'Заменить упражнение',
                                action: ()=>setIsOpenExerciseList(true),
                                className: 'text-light',
                                icon: 'fa fa-sync-alt',
                            },
                            {
                                label: 'Переместить выше',
                                action: handleMoveUpExercise,
                                className: 'text-light',
                                icon: 'fa fa-arrow-up',
                            },
                            {
                                label: 'Переместить ниже',
                                action: handleMoveDownExercise,
                                className: 'text-light',
                                icon: 'fa fa-arrow-down',
                            },
                            {
                                label: 'Новая заметка',
                                action: ()=>setIsNotesFormOpen(true),
                                className: 'text-light',
                                icon: 'fa fa-edit',
                            },
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

            {exerciseData && 
                <div className='font-size-secondary text-secondary mt-2'>
                    {getName(equipment, exerciseData.equipmentId)}
                </div>
            }

            {exercise.notes && 
                <div className='notes-container mt-2'>
                    <span className='fa fa-pencil-alt'></span>
                    <span>{exercise.notes}</span>
                    
                </div>
            }

            <div className='row font-size-secondary text-secondary g-0 text-center my-3'>
                <div className='col-1'></div>
                <div className='col-1'></div>
                <div className='col-3'>ВЕС</div>
                <div className='col-1'></div>
                <div className='col-3'>ПОВТОРЫ</div>
                <div className='col-1'></div>
                {/* тут что-то будет (или нет) */}
                <div className='col-1'><i className="fa fa-check-circle"></i></div>
                <div className='col-1'></div>
                
                
            </div>


            {exercise.sets.map((set) => 
                <div key={set._id}>
                    <CurrentDayExerciseSetItem
                        exerciseId={exercise._id}
                        set={set}/>
                </div>
            )}


            <Modal 
                show={isNotesFormOpen}   
                onHide={() => setIsNotesFormOpen(false)}
            >
                <Modal.Body className='bg-component'>
                    <NotesExerciseForm 
                        exerciseId={exercise.exerciseId}
                        prevNotes={exercise.notes}
                        handleCancel={() => setIsNotesFormOpen(false)} 
                    />
                </Modal.Body>
            </Modal>

            <Modal 
                show={isOpenExerciseList}
                onHide={() => setIsOpenExerciseList(false)}
            >
                <Modal.Header closeButton closeVariant="white" className="bg-component border-0">
                    <div>
                        <h5>Замена упражнения</h5>
                        <div className='font-size-secondary text-secondary'>
                            Выберите упражнение из списка
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className='bg-component'>
                    <div>
                        {exercises
                            .filter((exerciseItem) => exerciseItem.targetMuscleGroupId === exercise.targetMuscleGroupId)
                            .map((filteredExercise) => (
                                <div key={filteredExercise._id} className='mb-2'>
                                    <button className='text-primary text-decoration-underline' onClick={()=>handleReplaceExercise(filteredExercise._id)}>
                                        {filteredExercise.name}
                                    </button>
                                </div>
                        ))}
                        <div className='d-flex justify-content-end mt-4'>
                            <button 
                                className='btn-secondary'
                                onClick={() => setIsOpenExerciseList(false)}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                
                </Modal.Body>
            </Modal>

            <ModalExerciseHistory 
                exercise={exercise}
                isExerciseHistoryOpen={isExerciseHistoryOpen}
                setIsExerciseHistoryOpen={setIsExerciseHistoryOpen}
            />
            
        </div>
    )
}

export default CurrentDayExerciseItem;