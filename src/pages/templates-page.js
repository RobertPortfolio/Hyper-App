import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TemplatesListItem from '../components/templates-list-item/templates-list-item';
import GroupButton from '../components/group-button';
import TooltipExplanation from '../components/tooltip-explanation';
import Spinner from '../components/spinner';

const TemplatesPage = () => {

    const { templates, status, error } = useSelector((state) => state.templates);
    const navigate = useNavigate();

    const [ templatesTypeIsCustom, setTemplatesTypeIsCustom ] = useState(false);

    const handleNavigateToCreateTemplate = () => {
        navigate('/templates/create-custom-template');
    }

    if(status === 'loading' || status==='idle') {
        return <Spinner />
    }

    return (
        <div className='p-3'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <div className='position-relative'>
                    <h2>Шаблоны</h2>
                    <div className="position-absolute top-0 start-100 translate-middle-y">
                        <TooltipExplanation 
                            label=''
                            explanation='Вы можете составить мезоцикл на основе шаблона. Выберите шаблон из списка чтобы увидеть информацию о нем, после чего перейти к созданию мезоцикла.'
                        />
                    </div>
                </div>
                <button 
                    className="btn-main d-flex align-items-center"  
                    onClick={handleNavigateToCreateTemplate}>
                    <i className="fa fa-add me-2" />Добавить
                </button>
            </div>
            
            <div className='bg-component px-3 py-2'>
                <GroupButton
                    isPrimarySelected={templatesTypeIsCustom}
                    setIsPrimarySelected={setTemplatesTypeIsCustom} 
                />
            </div>

            <div>
                {templates.map((template) => 
                    template.isCustom === templatesTypeIsCustom && (
                        <div key={template._id}>

                            <TemplatesListItem 
                                template={template} />
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export { TemplatesPage };