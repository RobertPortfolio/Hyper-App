import React from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { days as daysList, getName } from '../../assets/assets';
import Spinner from '../spinner';

const ModalExerciseHistory = ({ exercise, isExerciseHistoryOpen, setIsExerciseHistoryOpen }) => {

    const { mesocycles } = useSelector((state) => state.mesocycles);
    const { exercises, status } = useSelector((state) => state.exercises);
    const exerciseData = exercises.find((exerciseItem) => exerciseItem._id === exercise.exerciseId);

    if(status === 'loading' || status === 'idle') {
        return <Spinner />
    }

    return(
        <Modal 
            show={isExerciseHistoryOpen}
            onHide={() => setIsExerciseHistoryOpen(false)}
            
        >
            <Modal.Header closeButton className="bg-dark">
                <div>
                    <div>История упражнения</div>
                    <div className="font-size-secondary text-secondary">{exerciseData.name}</div>
                </div>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
            <div>
                {mesocycles
                    .slice()
                    .reverse()
                    .flatMap(mesocycle =>
                        mesocycle.weeks.slice().reverse().flatMap(week =>
                            week.days
                                .slice()
                                .reverse()
                                .filter(day => day.isDone) // Проверка на day.isDone
                                .flatMap(day =>
                                    day.exercises
                                        .filter(exerciseItem => exerciseItem.exerciseId === exercise.exerciseId)
                                        .map(exerciseItem => ({
                                            exerciseItem,
                                            mesocycleName: mesocycle.name,
                                            weekNumber: week.number,
                                            dayId: day.dayId,
                                        }))
                                )
                        )
                    )
                    .map(({ exerciseItem, mesocycleName, weekNumber, dayId }, index) => (
                        <div key={index} className='mb-2 border p-2'>

                            <div className="font-size-secondary text-secondary">
                                {mesocycleName} 
                            </div>
                            <div className='mb-1'>
                                Неделя {weekNumber} {getName(daysList, dayId)}
                            </div>

                            
                            {exerciseItem.sets.map((set) => (
                                <div key={set._id}>
                                    {set.weight} кг - {set.reps} повторения {set.type === 'myoreps' && '(M)'} {set.type === 'myorepsMatch' && '(MM)'}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className='d-flex justify-content-end'>
                        <button 
                            className='btn-secondary'
                            onClick={() => setIsExerciseHistoryOpen(false)}
                        >
                            Закрыть
                        </button>
                    </div>
            </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalExerciseHistory;