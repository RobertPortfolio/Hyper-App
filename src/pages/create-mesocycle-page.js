import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import TemplateDayItem from '../components/template-day-item';
import { postMesocycleThunk } from '../redux/slices/mesocycles-slice';
import { getEmptyDay, handleAddDay } from '../utils/template-functions';
import CustomExerciseForm from '../components/custom-exercise-form';
import OptionsMenu from '../components/options-menu';
import ErrorToast from '../components/error-toast';
import Spinner from '../components/spinner';

const CreateMesocyclePage = () => {
    const { id } = useParams();
    const { templates, status, error } = useSelector((state) => state.templates);
    const { exercises } = useSelector((state) => state.exercises);
    const statusMesocycles = useSelector((state) => state.mesocycles.status);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalSubmit, setModalSubmit] = useState(false); 
    const [isOpenExerciseForm, setIsOpenExerciseForm] = useState(false);

    const durations = [ '3', '4', '5', '6' ];

    // Дефолтное состояние для шаблона
    const defaultTemplate = {
        name: '',
        emphasis: '',
        daysPerWeek: 1,
        isCustom: true,
        authorId: '',
        days: [getEmptyDay()],
    };

    useEffect(() => {
        if (status === 'succeeded') {
            const template = templates.find((t) => t._id === id);
            if (template) {
                setTemplateData(template);
            } else {
                setTemplateData(defaultTemplate);
            }
        }
    }, [id, templates, status]);

    // Локальное состояние шаблона
    const [templateData, setTemplateData] = useState(defaultTemplate);

    // Ошибки относящиеся к дням и упражнениям
    const [errorInfo, setErrorInfo] = useState(null);

    const [mesocycleData, setMesocycleData] = useState({ name: '', duration: '3', error: null });

    const handleChangeMesocycle = (e) => {
        const { name, value } = e.target;
        setMesocycleData(
            {
                ...mesocycleData,
                error: null,
                [name]: value,
            }
        )
    }

    const handleCheckDataAndOpenModal = () => {
        setErrorInfo(null);
        const updatedDays = templateData.days.map((day) => ({
            ...day,
            isValid: !!day.dayId,
            exercises: day.exercises.map((exercise) => ({
                ...exercise,
                isValid: !!exercise.exerciseId, // Проверка валидности
            })),
        }));
        
        setTemplateData({ ...templateData, days: updatedDays });
    
        // Проверяем, что все поля упражнений валидны
        const isAllDaysValid = updatedDays.every((day) =>
            day.isValid
        );

        // Проверяем, что все поля упражнений валидны
        const isAllExerciseValid = updatedDays.every((day) =>
            day.exercises.every((exercise) => exercise.isValid)
        );
        
        if (!isAllDaysValid) {
            setErrorInfo('Не все дни выбраны');
            return;
        }

        if (!isAllExerciseValid) {
            setErrorInfo('Не все упражнения выбраны');
            return;
        }

        if (updatedDays.length < 1) {
            setErrorInfo('Выбрано меньше 1 дня в неделю');
            return;
        }

        setModalSubmit(true);
    }

    const checkNameAndSubmit = () => {
        if (mesocycleData.name === '') {
            setMesocycleData({...mesocycleData, error: 'Введите название мезоцикла'});
            return;
        }
        handleSubmit();
    }

    // создание обьекта мезоцикла
    const createMesocycleObject = () => {
        const defaultSet = { 
            weight: '',
            reps: '',
            type: 'straight',
            isDone: false,
        };
    
        const defaultExerciseRates = {
            pumpRate: '',
            sorenessRate: '',
            jointPainRate: '',
            workloadRate: '',
        };

        const rir =  
            mesocycleData.duration === '3' 
                ? ['2', '1', '0'] 
                : mesocycleData.duration === '4' 
                    ? ['2', '1-2', '1', '0'] 
                    : mesocycleData.duration === '5' 
                        ? ['2', '1-2', '1', '0-1', '0']
                        : [ '2', '1-2', '1', '0-1', '0-1', '0'];

        const weeks = Array.from({ length: mesocycleData.duration }, (_, weekIndex) => ({
            number: weekIndex + 1, // Нумерация недель с 1
            rir: rir[weekIndex], 
            days: templateData.days.map((day) => ({
                dayId: day.dayId,
                isCurrent: false,
                isDone: false,
                exercises: day.exercises.map((exercise) => ({
                    targetMuscleGroupId: exercise.targetMuscleGroupId,
                    exerciseId: exercise.exerciseId,
                    notes: exercises.find((exerciseItem) => exerciseItem._id === exercise.exerciseId)?.notes ?? '',
                    sets: [defaultSet, defaultSet],
                    ...defaultExerciseRates,
                }))
            }))
        }));

        const now = new Date();
        const formattedDate = now.toLocaleDateString('ru-RU', {
            month: 'short', // Короткое название месяца (например, Dec)
            day: 'numeric', // Число
            year: 'numeric' // Год
        });

        const mesocycle = {
            name: mesocycleData.name,
            duration: mesocycleData.duration,
            isCurrent: true,
            isDone: false,
            startDate: formattedDate,
            endDate: '',
            authorId: user._id,
            weeks: weeks,
        };

        mesocycle.weeks[0].days[0].isCurrent = true;

        return mesocycle;
    }

    // отправка на сервер
    const handleSubmit = async () => {
        const mesocycle = createMesocycleObject();
        
        await dispatch(postMesocycleThunk(mesocycle)); 
        if (statusMesocycles === 'succeeded') {
            setModalSubmit(false);
            navigate('/current-workout');
        } 
    }

    if (statusMesocycles === 'idle' || statusMesocycles === 'loading') {
        return <Spinner />
    }

    return (
        <div>
            <div className='p-3'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='text-secondary'>
                        {templateData._id ? `Сгенерировано из ${templateData.name}` : 'Построено с нуля'}
                    </div>
                    <div className='d-flex me-2 align-items-center'>
                        <button 
                            className="btn-main me-3" 
                            onClick={handleCheckDataAndOpenModal}>
                            Создать
                        </button>
                        <OptionsMenu
                            options={[
                                {
                                    label: 'Создать упражнение',
                                    action: ()=>setIsOpenExerciseForm(true),
                                    className: 'text-light',
                                },
                            ]}
                            direction='right'
                        />
                    </div>
                    
                </div>

                <div className='row flex-nowrap overflow-auto gx-3'>
                    {templateData.days.map((day, dayIndex) => (
                        <div key={dayIndex} className='col-auto'>
                            <TemplateDayItem
                                day={day}
                                dayIndex={dayIndex}
                                setTemplateData={setTemplateData}
                            />
                        </div>
                    ))}
                    <div className='col-auto'>
                        <button 
                            className="text-center btn-secondary bg-dark border border-secondary py-3" 
                            onClick={()=>handleAddDay(setTemplateData)}>
                            <i className='fa fa-add me-2'/>
                            Добавить день
                        </button>
                    </div>
                </div>

                <Modal 
                    show={modalSubmit}
                    onHide={()=>setModalSubmit(false)}
                >
                    <Modal.Body className='bg-dark'>
                        <div className="modal-header">
                            <h5 className="modal-title">Mesocycle Data</h5>
                        </div>
                        <div className="modal-body">
                            <label>Введите название мезоцикла</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={mesocycleData.name}
                                onChange={(e)=>handleChangeMesocycle(e)}
                                className={`form-control bg-dark text-light rounded-0 input-custom-exercise mt-1 ${mesocycleData.error && 'is-invalid'}`}
                                placeholder=""
                                required
                            />
                            <label className='mt-3 mb-1'>Сколько недель будет длиться?</label>
                            <div className='btn-group d-flex'>
                            {durations.map((duration) => 
                                <button 
                                    key={duration}
                                    className={`btn ${mesocycleData.duration === duration ? 'btn-primary' : 'btn-outline-light'} rounded-0`}
                                    onClick={()=>setMesocycleData({...mesocycleData, duration: duration})}
                                >
                                    {duration}
                                </button>)
                            }
                                
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={()=>setModalSubmit(false)}
                                disabled={statusMesocycles === 'loading'}
                                >
                                Закрыть
                            </button>
                            <button
                                type="button"
                                className="btn-main"
                                onClick={checkNameAndSubmit}
                                disabled={statusMesocycles === 'loading'}
                                >
                                {statusMesocycles === 'loading' ? 'Создание...' : 'Создать'}
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal 
                    show={isOpenExerciseForm}   
                    onHide={() => setIsOpenExerciseForm(false)}
                >
                    <Modal.Body className='bg-dark'>
                        <CustomExerciseForm handleCancel={() => setIsOpenExerciseForm(false)} />
                    </Modal.Body>
                </Modal>
                
                {errorInfo && <ErrorToast 
                    message={errorInfo}
                    onClose={()=>setErrorInfo(null)}
                />}
            </div>
        </div>
    );
};

export { CreateMesocyclePage };