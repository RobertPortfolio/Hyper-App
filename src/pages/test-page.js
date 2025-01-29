import React from 'react';
import CreateMesoDayListItem from '../components/create-meso-day-list-item';

const TestPage = () => {
    return(
        <div className='p-2'>
            <CreateMesoDayListItem />
            <div className='mb-2'></div>
            <CreateMesoDayListItem />
            <div className='mb-2'></div>
            <CreateMesoDayListItem />
            <div className='mb-2'></div>
            <CreateMesoDayListItem />
        </div>
    )
}

export { TestPage };