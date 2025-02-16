import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { postExerciseThunk } from '../../redux/slices/exercises-slice';
import { equipment, muscleGroups } from '../../assets/assets';
import DropdownList from '../dropdown-list';
import './custom-exercise-form.css';

const CustomExerciseForm = ({ handleCancel }) => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.exercises);
    const { user } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        name: '',
        targetMuscleGroupId: '',
        equipmentId: '',
        notes: '',
        videoURL: '',
        isCustom: true,
        authorId: user._id,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Поле "Название" обязательно для заполнения.';
        if (!formData.targetMuscleGroupId) newErrors.targetMuscleGroupId = 'Выберите целевую мышечную группу.';
        if (!formData.equipmentId) newErrors.equipmentId = 'Выберите оборудование.';
        return newErrors;
    };

    const handleSave = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        await dispatch(postExerciseThunk(formData));
        if (status === 'succeeded') {
            handleCancel();
        } else {
            setErrors({ global: 'Не удалось сохранить упражнение. Попробуйте ещё раз.' });
        }
    };

    const getInputClass = (fieldName) =>
        `form-control input-custom text-light rounded-0 ${errors[fieldName] ? 'is-invalid' : ''}`;

    return (
        <form className="custom-exercise-form" noValidate>
            <h3 className="text-light mb-4">Создание упражнения</h3>

            <div className="form-group mb-3">
                <label htmlFor="name" className="text-light mb-1">Название</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={getInputClass('name')}
                    required
                />
                {errors.name && <div className="text-danger mt-1">{errors.name}</div>}
            </div>

            <DropdownList
                id="muscleGroup" 
                name="targetMuscleGroupId"
                value={formData.targetMuscleGroupId}
                options={muscleGroups} 
                label="Целевая мышечная группа" 
                error={errors.targetMuscleGroupId} 
                onChange={handleChange} 
                required />

            <DropdownList
                id="equipment"
                name="equipmentId"
                value={formData.equipmentId}
                options={equipment}
                label="Оборудование"
                error={errors.equipmentId}
                onChange={handleChange}
                required
            />

            <div className="form-group mb-3">
                <label htmlFor="notes" className="text-light mb-1">Заметки</label>
                <input
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-control input-custom text-light rounded-0"
                />
            </div>

            <div className="form-group mt-4 d-flex justify-content-end">
                <button type="button" className="btn-secondary me-2" onClick={handleCancel}>
                    Отмена
                </button>
                <button
                    type="button"
                    className="btn-main"
                    onClick={handleSave}
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Сохранение..' : 'Сохранить'}
                </button>
            </div>
        </form>
    );
};

export default CustomExerciseForm;