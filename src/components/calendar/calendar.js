import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeCurrentDay, selectCurrentMesocycles } from '../../redux/slices/mesocycles-slice';
import { days } from '../../assets/assets';
import './calendar.css';

const Calendar = () => {

    const currentMesocycle = useSelector(selectCurrentMesocycles);

    const dispatch = useDispatch();

    const handleChangeCurrentDay = (dayId) => {
        dispatch(changeCurrentDay(dayId));
    }

    return (
        <div className="container">
            <div className="font-size-secondary text-tertiary my-3">НЕДЕЛИ</div>
            <div className="row justify-content-center">
                {currentMesocycle.weeks.map((week) => (
                <div className="col text-center" key={week._id}>
                    <h6 className="m-0">{week.number}</h6>
                    <div className="font-size-secondary text-tertiary mb-2">{week.rir} RIR</div>
                    <div className="d-flex flex-column align-items-center">
                    {week.days.map((day) => (
                        <button
                        key={day._id}
                        onClick={() => handleChangeCurrentDay(day._id)}
                        className={`custom-button ${
                            day.isDone
                            ? "custom-button-done"
                            : day.isCurrent
                            ? "custom-button-current"
                            : "custom-button-default"
                        }`}
                        >
                        {days.find((dayItem) => dayItem.id === Number(day.dayId))?.ruShortName}
                        </button>
                    ))}
                    </div>
                </div>
                ))}
            </div>
        </div>
        
    )
}

export default Calendar;