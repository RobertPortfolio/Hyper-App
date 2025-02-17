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
            <div className='d-flex'>
                <div className='position-relative mb-4'>
                    <h2>Составление тренировочного плана</h2>
                    <div className="position-absolute top-0 start-100 translate-middle-y">
                        <TooltipExplanation 
                            label=''
                            explanation='Составьте мезоцикл (рассчитанный на несколько недель тренировочный план) с нуля или на основе базового или вашего шаблона.'
                        />
                    </div>
                </div>
            </div>  
            
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
                    <div className='bg-component mb-0 px-3 py-2 mt-4'>Кастомные шаблоны</div>
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