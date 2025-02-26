import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InputSetType from './input-set-type';
import OptionsMenu from '../options-menu';
import SpinnerSmall from '../spinner-small';
import { changeSet, deleteSetThunk, addSetThunk, selectCurrentWeek, selectCurrentMesocycle, updateSetThunk } from '../../redux/slices/mesocycles-slice';

const CurrentDayExerciseSetItem = ({ exerciseId, set }) => {

    const currentWeek = useSelector(selectCurrentWeek);
    const currentMesocycle = useSelector(selectCurrentMesocycle);
    const { deleteSetLoading, updateSetLoading, updateStatusLoading } = useSelector((state) => state.mesocycles.loadingElements);

    const [invalidFields, setInvalidFields] = useState({
        weight: false,
        reps: false,
        isDone: false,
    });

    const dispatch = useDispatch();

    const handleChangeSet = (e, setId) => {
        const { name, value } = e.target;

        if (set.isDone) {
            setInvalidFields({
                isDone: set.isDone,
            });
            return
        }

        // Update invalid state
        setInvalidFields((prev) => ({
            ...prev,
            [name]: value.trim() === '',
        }));

        dispatch(changeSet({
            name,
            value,
            exerciseId,
            setId,
        }));
    };

    const checkboxChangeSet = (e) => {
        const { checked } = e.target;

        // Check if required fields are empty
        if (checked && (set.weight === '' || set.reps === '')) {
            setInvalidFields({
                weight: set.weight === '',
                reps: set.reps === '',
            });
            return;
        }

        setInvalidFields({
            weight: false,
            reps: false,
            isDone: false,
        });

        dispatch(updateSetThunk({mesocycleId: currentMesocycle._id, exerciseId, set, isDone: checked}));
    };

    const handleChangeSetType = (type) => {
        dispatch(updateSetThunk({
            mesocycleId: currentMesocycle._id, 
            exerciseId, 
            set: { ...set, type: type }, 
            isDone: set.isDone
        }));
    };

    const handleDeleteSet = (setId) => {
        dispatch(deleteSetThunk({mesocycleId: currentMesocycle._id, exerciseId, setId}));
    };

    const handleAddSetBelow = (setId) => {
        dispatch(addSetThunk({
            mesocycleId: currentMesocycle._id,
            exerciseId,
            setId,
        }));
    };

    return (
        <div className="row font-size-secondary g-0 text-center align-items-center mb-2">
            <div className="col-1 d-flex justify-content-center">
                {(deleteSetLoading !== set._id && updateSetLoading !== set._id) && <OptionsMenu
                    options={[
                        {
                            label: 'Копировать снизу',
                            action: () => handleAddSetBelow(set._id),
                            className: 'text-light',
                            icon: 'fa fa-add',
                        },
                        {
                            label: 'Myo-Reps',
                            action: () => handleChangeSetType('myoreps'),
                            className: 'text-light',
                            icon: 'fa fa-m',
                        },
                        {
                            label: 'Myo-Reps Match',
                            action: () => handleChangeSetType('myorepsMatch'),
                            className: 'text-light',
                            icon: 'fa fa-exchange-alt',
                        },
                        {
                            label: 'Удалить подход',
                            action: () => handleDeleteSet(set._id),
                            className: 'text-danger',
                            icon: 'fa fa-trash',
                        },
                    ]}
                    direction="left"
                    header="Подход"
                />}
            </div>
            <div className="col-1"></div>
            <div className="col-3">
                <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={set.weight}
                    disabled={updateSetLoading === set._id}
                    onChange={(e) => handleChangeSet(e, set._id)}
                    className={`form-control input-custom text-light text-center rounded-0 ${
                        invalidFields.weight ? 'is-invalid' : ''
                    }`}
                    placeholder="кг"
                    required
                />
            </div>
            <div className="col-1"></div>
            <div className="col-3">
                <div className="position-relative d-inline-block">
                    <input
                        type="number"
                        id="reps"
                        name="reps"
                        value={set.reps}
                        disabled={updateSetLoading === set._id}
                        onChange={(e) => handleChangeSet(e, set._id)}
                        className={`form-control input-custom text-light text-center rounded-0 ${
                            invalidFields.reps ? 'is-invalid' : ''
                        }`}
                        placeholder={`${currentWeek.rir} RIR`}
                        required
                    />
                    {set.type === 'myoreps' && <InputSetType label="M" />}
                    {set.type === 'myorepsMatch' && <InputSetType label="MM" />}
                </div>
            </div>
            <div className="col-1">
                {(deleteSetLoading === set._id || updateSetLoading === set._id) && <SpinnerSmall />}
            </div>
            <div className="col-1">
                <input
                    type="checkbox"
                    id="isDone"
                    name="isDone"
                    checked={set.isDone}
                    disabled={updateSetLoading === set._id || updateStatusLoading}
                    onChange={checkboxChangeSet}
                    className="form-check-input text-light text-center rounded-0"
                />
            </div>
            <div className="col-1 text-center"></div>
            {invalidFields.isDone && <div className='font-size-tertiary text-secondary mt-1'>Для внесения изменений снимите отметку "выполнено"</div>}
        </div>
    );
};

export default CurrentDayExerciseSetItem;