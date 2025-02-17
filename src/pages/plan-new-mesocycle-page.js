import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../components/spinner';
import TemplatesListItem from '../components/templates-list-item/templates-list-item';
import TooltipExplanation from '../components/tooltip-explanation';

const PlanNewMesocyclePage = () => {

    const navigate = useNavigate();

    const { templates, status, error } = useSelector((state) => state.templates);

    const handleToTemplates = () => {
        navigate('/templates')
    }

    const handleToCreateMesoFromScratch = () => {
        navigate('/create-mesocycle/0')
    }

    if(status === 'loading' || status==='idle') {
        return <Spinner />
    }

    return(
        <div className='p-3'>
            <h2 className='mb-4'>Составление плана тренировок</h2>
            <div className='text-secondary font-size-secondary mb-3'>Составьте мезоцикл (рассчитанный на несколько недель тренировочный план) с нуля или на основе базового или вашего шаблона.</div>
            <div className='d-flex mb-2'>
                <button 
                    onClick={handleToTemplates}
                    className='btn-main w-100 text-center'>
                    Найти шаблон
                </button>
            </div>
            <div className='d-flex'>
                <button 
                    onClick={handleToCreateMesoFromScratch}
                    className='w-100 text-center'>
                    Спланировать с нуля
                </button>
            </div>
            
            {templates.some(template => template.isCustom) && (
                <div>
                    <div className='bg-component mb-0 px-3 py-2 mt-4'>Ваши шаблоны</div>
                    {templates.map((template) =>
                        template.isCustom && (
                            <div key={template._id}>
                                <TemplatesListItem 
                                    template={template} />
                            </div>
                        )
                    )}
                </div>
            )}
            
        </div>
    ) 
}

export { PlanNewMesocyclePage };