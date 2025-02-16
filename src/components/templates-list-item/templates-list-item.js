import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TemplateDetails from '../template-details';
import { useDispatch } from 'react-redux';
import OptionsMenu from '../options-menu';
import { deleteTemplateThunk } from '../../redux/slices/templates-slice';
import './template-list-item.css';

const TemplatesListItem = ({ template }) => {

    const navigate = useNavigate();

    const dispatch = useDispatch()

    const [isOpenForm, setIsOpenForm] = useState(false);

    const handleNavigateToCreateMesocycle = () => {
        navigate(`/create-mesocycle/${template._id}`);
    }

    const handleDeleteTemplate = () => {
        if(template.isCustom) {
            dispatch(deleteTemplateThunk(template._id));
        }  
    }

    return (
        <>
        <div className='card bg-component rounded-0 hover-effect' onClick={() => setIsOpenForm(true)}>
            <div className='card-body py-2 px-3 border-top border-secondary'>
                <div className='d-flex justify-content-between'>
                    <div>
                        {template.emphasis && 
                        <div className='font-size-tertiary text-secondary text-uppercase'>
                            {template.emphasis}
                        </div>
                        }
                        <div className='text-light mb-1'>{template.name}</div>
                        <span className='template-days-per-week'>
                            {template.daysPerWeek}/НЕДЕЛЮ
                        </span>
                        {template.sex && <span className='template-days-per-week ms-1'>
                            {template.sex === 'female' ? 'ЖЕНСКИЙ' : 'МУЖСКОЙ'}
                        </span>}
                    </div>
                    
                    {template.isCustom && 
                        <div className='text-light' onClick={(e) => e.stopPropagation()}>
                            <OptionsMenu
                                options={[
                                    {
                                        label: 'Информация',
                                        action: () => setIsOpenForm(true),
                                        className: 'text-light',
                                        icon: 'fa fa-circle-info',
                                    },
                                    {
                                        label: 'Удалить шаблон',
                                        action: handleDeleteTemplate,
                                        className: 'text-danger',
                                        icon: 'fa-solid fa-trash',
                                    },
                                ]}
                                direction='right'
                                header='Шаблон'
                            />
                        </div>
                        
                    }
                </div>
            </div>
        </div>
        <Modal 
            show={isOpenForm}   
            onHide={() => setIsOpenForm(false)}
        >
            <Modal.Body className='bg-component'>
                <TemplateDetails 
                    template={template}
                    handleNavigateToCreateMesocycle={handleNavigateToCreateMesocycle}
                    handleCancel={() => setIsOpenForm(false)} />
            </Modal.Body>
        </Modal>
        </>
    )
}

export default TemplatesListItem;