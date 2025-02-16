import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { postTemplateThunk } from '../../redux/slices/templates-slice';
import TemplateDayItem from '../template-day-item';
import { getEmptyDay, handleChangeTemplate, handleAddDay } from '../../utils/template-functions';
import ErrorToast from '../error-toast';

const CustomTemplateForm = () => {

    const { user } = useSelector((state) => state.user);
    const { status } = useSelector((state) => state.templates);

    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    
    // Данные формы 
    const [ templateData, setTemplateData ] = useState({
        name: '',
        emphasis: '',
        daysPerWeek: 1,
        sex: '',
        isCustom: false,
        authorId: '',
        days: [ getEmptyDay() ],
    });

    // Видимость модалки для установки последних данных и сохранения
    const [modalSubmit, setModalSubmit] = useState(false);

    // Ошибки относящиеся к дням и упражнениям
    const [errorInfo, setErrorInfo] = useState(null);

    const handleCheckDataAndOpenModal = () => {
        setErrorInfo(null);
        const updatedDays = templateData.days.map((day) => ({
            ...day,
            isValid: !!day.dayId,
        }));
        
        setTemplateData({ ...templateData, days: updatedDays });
    
        // Проверяем, что все поля дней валидны
        const isAllDaysValid = updatedDays.every((day) =>
            day.isValid
        );
        
        if (!isAllDaysValid) {
            setErrorInfo('Не все дни выбраны');
            return;
        }

        if (updatedDays.length < 1) {
            setErrorInfo('Выбрано меньше 1 дня в неделю');
            return;
        }

        setModalSubmit(true);
    }

    const handleCheckNameAndSubmit = () => {
        if (templateData.name === '') {
            setTemplateData({
                ...templateData,
                nameError: true,
            });
            return;
        }
        handleSubmit();
    }

    // Сохранение
    // !!! authorID
    const handleSubmit = async () => {
        const updatedTemplateData = {
            ...templateData,
            //authorId: user._id,
            authorId: '1',
        };
        
        console.log(updatedTemplateData);
        await dispatch(postTemplateThunk(updatedTemplateData));
        if (status === 'succeeded') {
            setModalSubmit(false);
            navigate('/templates');
        } 
    }

    return (
        <div className='p-3'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                Пользовательский шаблон
                <button 
                    className="btn-main" 
                    onClick={handleCheckDataAndOpenModal}>
                    Создать
                </button>
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
                        className="text-center btn-add border border-secondary py-3" 
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
                <Modal.Body className='bg-component'>
                    <div className="modal-body">
                        <label>Введите название шаблона *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={templateData.name}
                            onChange={(e)=>handleChangeTemplate(setTemplateData, e)}
                            className={`form-control input-custom text-light rounded-0 mt-1 ${templateData.nameError && 'is-invalid'}`}
                            placeholder=""
                            required
                        />
                        <label className='mt-3'>На что делается акцент? (не обязательно)</label>
                        <input
                            type="text"
                            id="emphasis"
                            name="emphasis"
                            value={templateData.emphasis}
                            onChange={(e)=>handleChangeTemplate(setTemplateData, e)}
                            className={`form-control input-custom text-light rounded-0 mt-1`}
                            placeholder=""
                        />
                        <label className='mt-3 mb-1'>Пол</label>
                        <div className='btn-group d-flex'>
                        
                            <button 
                                className={`flex-grow-1 py-3 ${templateData.sex === 'female' ? 'btn-main text-center border' : 'btn btn-outline-light'} rounded-0`}
                                onClick={()=>setTemplateData({ ...templateData, sex: 'female' })}
                            >
                                Female
                            </button>
                            <button 
                                className={`flex-grow-1 py-3 ${templateData.sex === 'male' ? 'btn-main text-center border' : 'btn btn-outline-light'} rounded-0`}
                                onClick={()=>setTemplateData({ ...templateData, sex: 'male' })}
                            >
                                Male
                            </button>
                            
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={()=>setModalSubmit(false)}
                            disabled={status === 'loading'}
                            >
                            Закрыть
                        </button>
                        <button
                            type="button"
                            className="btn-main"
                            onClick={handleCheckNameAndSubmit}
                            disabled={status === 'loading'}
                            >
                            {status === 'loading' ? 'Создание...' : 'Создать'}
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {errorInfo && <ErrorToast 
                message={errorInfo}
                onClose={()=>setErrorInfo(null)}
            />}
        </div>
    )
}

export default CustomTemplateForm;