import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { FaRegCalendarAlt, FaCalendarCheck } from 'react-icons/fa';  
import { days as daysList, getName } from '../../assets/assets';
import CurrentDayExerciseItem from '../current-day-exercise-item';
import { selectCurrentDay, updateMesocycleThunk, selectCurrentMesocycles, selectCurrentWeek, changeCurrentDay } from '../../redux/slices/mesocycles-slice';
import Calendar from '../calendar/calendar';
import OptionsMenu from '../options-menu';
import ModalAddExercise from './modal-add-exercise';
import TooltipExplanation from '../tooltip-explanation';
import ErrorToast from '../error-toast';
import './current-workout-form.css';

const CurrentWorkoutForm = () => {

    const currentDay = useSelector(selectCurrentDay);
    const currentMesocycle = useSelector(selectCurrentMesocycles);
    const currentWeek = useSelector(selectCurrentWeek);

    const dispatch = useDispatch();

    const [ openCalendar, setOpenCalendar ] = useState(false);

    const [ isOpenNewExerciseForm, setIsOpenNewExerciseForm ] = useState(false);

    const [ errorInfo, setErrorInfo ] = useState(false);

    const toggleCalendar = () => {
        setOpenCalendar((prevState) => !prevState);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const findDayIndex = () => {
        const currentDayIndex = currentWeek.days.findIndex(day => day._id === currentDay._id);
        return currentDayIndex;
    }

    const handleToNextDay = () => {
        // Находим текущий день и его индекс в массиве дней недели
        const currentDayIndex = findDayIndex();
    
        // Проверяем, есть ли следующий день в текущей неделе
        if (currentDayIndex < currentWeek.days.length - 1) {
            // Если есть, переходим к следующему дню
            const nextDayId = currentWeek.days[currentDayIndex + 1]._id;
            dispatch(changeCurrentDay(nextDayId));
        } else {
            // Если текущая неделя завершена, проверяем, есть ли следующая неделя
            if (currentWeek.number < currentMesocycle.weeks.length) {
                const nextWeek = currentMesocycle.weeks[currentWeek.number];
                // Переходим на первый день следующей недели
                const nextDayId = nextWeek.days[0]._id;
                dispatch(changeCurrentDay(nextDayId));
            } else {
                // Если недели закончились
                setErrorInfo('Текущий день последний в мезоцикле');
                setOpenCalendar(true);
                
            }
        }
    };

    const handleSave = async () => {
        await dispatch(updateMesocycleThunk({ id: currentMesocycle._id, data: currentMesocycle }));
    }

    if (!currentDay) {
        return (
            <div className='alert alert-primary m-3'>
                <Link to='/plan-mesocycle' className='me-1'>Создайте мезоцикл</Link>
                чтобы вести журнал тренировок!
            </div>
    
        )
    }

    return (
        <div>
            <div className={`sticky-element bg-component p-3 border-bottom ${currentDay.isDone ? 'border-success border-2':'border-secondary'}`}>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div>
                        {currentMesocycle.name && <span className='text-secondary'>
                            {currentMesocycle.name}
                        </span>}
                        {currentMesocycle.isDone && 
                            <span className='fas fa-check-circle text-success ms-1'></span>
                        }
                    </div>
                    <div className='d-flex align-items-center'>
                        <TooltipExplanation 
                            label=''
                            explanation='Сохраняйте данные тренировки по окончанию, чтобы не потерять их'
                        />
                        <button
                            className='btn-main ms-3'
                            onClick={handleSave}>
                            Сохранить
                        </button>
                    </div>
                    
                    
                </div>
                
                <div className='d-flex justify-content-between align-items-center'>
                    <h5 className='m-0'>
                        Неделя {currentWeek.number} День {findDayIndex() + 1} {getName(daysList, currentDay.dayId)}
                    </h5>
                    <div className='d-flex align-items-center'>
                        <div className='me-3'>
                            <button 
                                onClick={toggleCalendar}>
                                {currentDay.isDone ? <FaCalendarCheck size={24} /> : <FaRegCalendarAlt size={24} />}
                            </button>
                        </div>
                        <div className=''>
                            <OptionsMenu
                                options={[
                                    {
                                        label: 'К следующему дню',
                                        action: handleToNextDay,
                                        className: 'text-primary',
                                        icon: 'fa fa-arrow-right',
                                    },
                                    {
                                        label: 'Открыть календарь',
                                        action: () => setOpenCalendar(true),
                                        className: 'text-light',
                                        icon: 'fa fa-calendar',
                                    },
                                    {
                                        label: 'Добавить упражнение',
                                        action: () => setIsOpenNewExerciseForm(true),
                                        className: 'text-light',
                                        icon: 'fa fa-add',
                                    },
                                ]}
                                direction='right'
                                header='День'
                            />
                        </div>
                        
                    </div>
                </div>
            </div>

            <div>  
                <Collapse in={openCalendar} >
                    <div>
                        <Calendar />
                    </div>
                </Collapse>
            </div>
            
            {currentDay.exercises.map((exercise, index) => {
                const previousExerciseTargetMuscleGroupId = index > 0 ? currentDay.exercises[index - 1].targetMuscleGroupId : null;
                return (
                    <div key={exercise._id}>
                        <CurrentDayExerciseItem 
                            exercise={exercise} 
                            previousExerciseTargetMuscleGroupId={previousExerciseTargetMuscleGroupId} 
                        />
                    </div>
                );
            })}

            <div style={{ height: '200px' }}></div>

            <ModalAddExercise
                isOpenNewExerciseForm={isOpenNewExerciseForm}
                setIsOpenNewExerciseForm={setIsOpenNewExerciseForm}
            />
            
            {errorInfo && <ErrorToast 
                message={errorInfo}
                onClose={()=>setErrorInfo(null)}
            />}

        </div>
    );
};

export default CurrentWorkoutForm;