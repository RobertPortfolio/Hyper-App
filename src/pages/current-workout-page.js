import React from 'react';
import { useSelector } from 'react-redux';
import CurrentWorkoutForm from '../components/current-workout-form';
import Spinner from '../components/spinner';
const CurrentWorkoutPage = () => {
    
    const { status } = useSelector((state) => state.mesocycles);

    if (status === 'idle' || status === 'loading') {
        return <Spinner />
    }
    

    return (
        <div>
            <CurrentWorkoutForm />
        </div>
    );
};

export { CurrentWorkoutPage };