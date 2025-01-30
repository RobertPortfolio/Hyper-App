import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InputSetType from './input-set-type';
import OptionsMenu from '../options-menu';
import { changeSet, deleteSet, addSetBelow } from '../../redux/slices/mesocycles-slice';

const CurrentDayExerciseSetItem = ({ exerciseId, set }) => {

    const { currentRir } = useSelector((state) => state.mesocycles);

    const [invalidFields, setInvalidFields] = useState({
        weight: false,
        reps: false,
    });

    const dispatch = useDispatch();

    const handleChangeSet = (e, setId) => {
        const { name, value } = e.target;

        if (set.isDone) {
            dispatch(changeSet({
                name: 'isDone',
                value: false,
                exerciseId,
                setId,
            }));
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

    const checkboxChangeSet = (e, setId) => {
        const { name, checked } = e.target;

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
        });

        dispatch(changeSet({
            name,
            value: checked,
            exerciseId,
            setId,
        }));
    };

    const handleChangeSetType = (type, setId) => {
        dispatch(changeSet({
            name: 'type',
            value: type,
            exerciseId,
            setId,
        }));
    };

    const handleDeleteSet = (setId) => {
        dispatch(deleteSet({
            exerciseId,
            setId,
        }));
    };

    const handleAddSetBelow = (setId) => {
        dispatch(addSetBelow({
            exerciseId,
            setId,
        }));
    };

    return (
        <div className="row font-size-secondary g-0 text-center align-items-center mb-2">
            <div className="col-1">
                <OptionsMenu
                    options={[
                        {
                            label: 'Копировать снизу',
                            action: () => handleAddSetBelow(set._id),
                            className: 'text-light',
                            icon: 'fa fa-add',
                        },
                        {
                            label: 'Myo-Reps',
                            action: () => handleChangeSetType('myoreps', set._id),
                            className: 'text-light',
                            icon: 'fa fa-m',
                        },
                        {
                            label: 'Myo-Reps Match',
                            action: () => handleChangeSetType('myorepsMatch', set._id),
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
                />
            </div>
            <div className="col-1"></div>
            <div className="col-3">
                <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={set.weight}
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
                        onChange={(e) => handleChangeSet(e, set._id)}
                        className={`form-control input-custom text-light text-center rounded-0 ${
                            invalidFields.reps ? 'is-invalid' : ''
                        }`}
                        placeholder={`${currentRir} RIR`}
                        required
                    />
                    {set.type === 'myoreps' && <InputSetType label="M" />}
                    {set.type === 'myorepsMatch' && <InputSetType label="MM" />}
                </div>
            </div>
            <div className="col-1"></div>
            <div className="col-1">
                <input
                    type="checkbox"
                    id="isDone"
                    name="isDone"
                    checked={set.isDone}
                    onChange={(e) => checkboxChangeSet(e, set._id)}
                    className="form-check-input text-light text-center rounded-0"
                />
            </div>
            <div className="col-1"></div>
        </div>
    );
};

export default CurrentDayExerciseSetItem;