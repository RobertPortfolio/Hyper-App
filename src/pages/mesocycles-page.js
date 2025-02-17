import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MesocyclesListItem from '../components/mesocycles-list-item/mesocycles-list-item';
import Spinner from '../components/spinner';

const MesocyclesPage = () => {

    const { mesocycles, status } = useSelector((state) => state.mesocycles);   
    
    if (status === 'idle' || status === 'loading') {
        return <Spinner />
    }

    return (
        <div className='p-3'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h2>Тренировочные планы</h2>
                <Link
                    to='/plan-mesocycle'
                    className="btn-main d-flex align-items-center text-decoration-none"  
                >
                    <i className="fa fa-add me-2" />Новый
                </Link>
            </div>

            {mesocycles.slice().reverse().map((mesocycle) => 
                <div key={mesocycle._id} className='mt-1'> 
                    <MesocyclesListItem mesocycle={mesocycle}/>
                </div>
            )}

            {mesocycles.length === 0 && 
                <div className='alert alert-primary'>
                    Ваш список мезоциклов пуст.
                </div>
            }
            
        </div>
    )
}

export { MesocyclesPage };