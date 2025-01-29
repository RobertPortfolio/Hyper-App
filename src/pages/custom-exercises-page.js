import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CustomExerciseForm from '../components/custom-exercise-form';
import { Modal } from 'react-bootstrap';
import CustomExercisesListItem from '../components/custom-exercises-list-item';
import Spinner from '../components/spinner';

export const CustomExercisesPage = () => {
    const [isOpenForm, setIsOpenForm] = useState(false);
    const { exercises, status, error } = useSelector((state) => state.exercises);
    
    if(status === 'loading' || status==='idle') {
        return <Spinner />
    }

    return ( 
        <div className='p-3'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
                <h2>Кастомные упражнения</h2>
                <button 
                    className="btn-main d-flex align-items-center"  
                    onClick={() => setIsOpenForm(true)} >
                    <i className="fa fa-add me-2" />Добавить
                </button>
            </div>
            
            {exercises.map((exercise) => 
                exercise.isCustom === true && (
                    <div key={exercise._id} className='mt-1'>
                        <CustomExercisesListItem exercise={exercise} />
                    </div>
                )
            )}
            

            {/* Модальное окно */}
            <Modal 
                show={isOpenForm}   
                onHide={() => setIsOpenForm(false)}
            >
                <Modal.Body className='bg-dark'>
                    <CustomExerciseForm handleCancel={() => setIsOpenForm(false)} />
                </Modal.Body>
            </Modal>
        </div>
    );
};