import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { muscleGroups, equipment, getName } from '../../assets/assets';
import { addSetThunk, deleteExerciseThunk, replaceExerciseThunk, moveExerciseThunk, selectCurrentMesocycle, selectCurrentDay } from '../../redux/slices/mesocycles-slice';
import { selectExerciseById } from '../../redux/slices/exercises-slice';
import OptionsMenu from '../options-menu';
import NotesExerciseForm from '../notes-exercise-form/notes-exercise-form';
import CurrentDayExerciseSetItem from './current-day-exercise-set-item';
import ModalExerciseHistory from './modal-exercise-history';
import './current-day-exercise-item.css';
import ConfirmModal from '../confirm-modal';
import SpinnerSmall from '../spinner-small';

const CurrentDayExerciseItem = ({ exercise, previousExerciseTargetMuscleGroupId }) => {

    const { exercises } = useSelector((state) => state.exercises);
    const { deleteExerciseLoading, replaceExerciseLoading, moveExerciseLoading, addSetLoading } = useSelector((state) => state.mesocycles.loadingElements);
    const currentMesocycle = useSelector(selectCurrentMesocycle);
    const currentDay = useSelector(selectCurrentDay);

    const dispatch = useDispatch();

    const exerciseData = useSelector(selectExerciseById(exercise.exerciseId));

    const [ isNotesFormOpen, setIsNotesFormOpen ] = useState(false);

    const [ isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [ isOpenExerciseList, setIsOpenExerciseList ] = useState(false);

    const [ isExerciseHistoryOpen, setIsExerciseHistoryOpen ] = useState(false);

    const compareExerciseTargetMuscleGroupId = () => {
        return previousExerciseTargetMuscleGroupId === exercise.targetMuscleGroupId
    }

    const handleAddSet = () => {
        dispatch(addSetThunk({ 
            id: currentMesocycle._id,
            exerciseId: exercise._id, 
            setId: null,
        }));
    }

    const handleDeleteExercise = () => {
        dispatch(deleteExerciseThunk({id: currentMesocycle._id, exerciseId: exercise._id}));
    }

    const handleReplaceExercise = (newExerciseId) => {
        dispatch(replaceExerciseThunk({ 
            id: currentMesocycle._id,
            exerciseId: exercise._id, 
            targetMuscleGroupId: exercise.targetMuscleGroupId,
            newExerciseId, 
            notes: exercises.find((exerciseItem) => exerciseItem._id === newExerciseId)?.notes ?? '',
        }))
        setIsOpenExerciseList(false);
    }

    const handleMoveExercise = (direction) => {
        const index = currentDay.exercises.findIndex(ex => ex._id === exercise._id);
        if (direction === 'up' && index > 0) {
            // Если перемещаем вверх и упражнение не на первой позиции 
            dispatch(moveExerciseThunk({id: currentMesocycle._id, exerciseId: exercise._id, direction }));
        } else if (direction === 'down' && index < currentDay.exercises.length - 1) {
            // Если перемещаем вниз и упражнение не на последней позиции
            dispatch(moveExerciseThunk({id: currentMesocycle._id, exerciseId: exercise._id, direction }));
        } else {
            return
        }
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
                        <span>{exerciseData.name} </span> : 
                        <span>Unknown exercise </span>
                    }
                    {(deleteExerciseLoading === exercise._id || 
                        replaceExerciseLoading===exercise._id ||
                        moveExerciseLoading===exercise._id ||
                        addSetLoading===exercise._id) 
                        && <SpinnerSmall />
                    }
                </div>
                <div className='me-2'>
                    {(deleteExerciseLoading !== exercise._id && 
                      replaceExerciseLoading !== exercise._id && 
                      moveExerciseLoading !== exercise._id
                    ) && <OptionsMenu
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
                                action: ()=>handleMoveExercise('up'),
                                className: 'text-light',
                                icon: 'fa fa-arrow-up',
                            },
                            {
                                label: 'Переместить ниже',
                                action: ()=>handleMoveExercise('down'),
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
                                action: ()=>setIsConfirmModalOpen(true),
                                className: 'text-danger',
                                icon: 'fa fa-trash',
                            },
                        ]}
                        direction='right'
                        header='Упражнение'
                    />}
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

            <ConfirmModal
                show={isConfirmModalOpen} 
                onClose={()=>setIsConfirmModalOpen(false)} 
                onConfirm={handleDeleteExercise}
                title='Подтвердите действие' 
                message={`Удалить упражнение ${exerciseData && exerciseData.name}?`}/>

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