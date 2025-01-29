import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CurrentWorkoutForm from '../components/current-workout-form';
import { setCurrentDayId } from '../redux/slices/mesocycles-slice';
import Spinner from '../components/spinner';

const CurrentWorkoutPage = () => {
    
    const { mesocycles, status } = useSelector((state) => state.mesocycles);

    const dispatch = useDispatch();

    useEffect(() => {
        if (status === 'succeeded') {
            const currentMesocycle = mesocycles.find((mesocycle) => mesocycle.isCurrent);
            const currentWeek = currentMesocycle?.weeks.find((week) =>
                week.days.some((day) => day.isCurrent)
            );
            const currentDay = currentWeek?.days.find((day) => day.isCurrent);

            if (currentDay) {
                dispatch(setCurrentDayId({ 
                    dayId: currentDay._id, 
                    rir: currentWeek.rir,
                    weekNumber: currentWeek.number
                }));
            }
        }
    }, [status, mesocycles, dispatch]);

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