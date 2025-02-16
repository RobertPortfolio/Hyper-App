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
            <Modal.Header closeButton closeVariant='white' className="bg-component border-0">
                <div>
                    <div>История упражнения</div>
                    <div className="font-size-secondary text-secondary">{exerciseData.name}</div>
                </div>
            </Modal.Header>
            <Modal.Body className='bg-component'>
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
                        <div key={index} className='mb-2 border p-2 bg-custom-secondary rounded'>

                            <div className="font-size-secondary text-secondary">
                                {mesocycleName} 
                            </div>
                            <div className='mb-1 text-secondary'>
                                Неделя {weekNumber} • {getName(daysList, dayId)}
                            </div>

                            
                            <div className="d-flex flex-column gap-1">
                                {exerciseItem.sets.map((set) => (
                                    <div key={set._id} className="d-flex justify-content-between align-items-center">
                                        <span>
                                            <strong>{set.weight} кг</strong> — {set.reps} повторения
                                        </span>
                                        <span className="">
                                            {set.type === 'myoreps' && '(M)'}
                                            {set.type === 'myorepsMatch' && '(MM)'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className='d-flex justify-content-end mt-4'>
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