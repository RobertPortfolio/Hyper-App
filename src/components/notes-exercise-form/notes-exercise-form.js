import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyNotesToExercisesInMesocycleThunk, selectCurrentMesocycle } from '../../redux/slices/mesocycles-slice';
import TooltipExplanation from '../tooltip-explanation';
import SpinnerSmall from '../spinner-small';

const NotesExerciseForm = ({ exerciseId, prevNotes, handleCancel }) => {
  const [notes, setNotes] = useState(prevNotes || '');
  const [isSaving, setIsSaving] = useState(false); // Состояние для отслеживания начала загрузки

  const { exercises } = useSelector((state) => state.exercises);
  const currentMesocycle = useSelector(selectCurrentMesocycle);
  const { applyNotesLoading } = useSelector((state) => state.mesocycles.loadingElements);

  const dispatch = useDispatch();

  const handleChangeNotes = (e) => {
    setNotes(e.target.value);
  };

  const handleSaveNotes = () => {
    setIsSaving(true); // Начало загрузки
    dispatch(
      applyNotesToExercisesInMesocycleThunk({
        id: currentMesocycle._id,
        exerciseId,
        notes,
      }));
  };

  // useEffect для отслеживания завершения загрузки и закрытия формы
  useEffect(() => {
    if (applyNotesLoading === null && isSaving) {  // Если загрузка завершена и это было начало операции
      setIsSaving(false); // Останавливаем отслеживание загрузки
      handleCancel(); // Закрываем форму
    }
  }, [applyNotesLoading, isSaving, handleCancel]);

  return (
    <div>
      <div>
        Новая заметка
        <TooltipExplanation label='' explanation='Данная заметка применится к этому упражнению для всего мезоцикла' />
      </div>
      <div className='font-size-secondary text-secondary mb-2'>
        Для упражнения {exercises.find((exercise) => exercise._id === exerciseId).name}
      </div>

      <textarea
        type="text"
        id="notes"
        name='notes'
        value={notes}
        onChange={handleChangeNotes}
        className='form-control input-custom text-light text-center rounded-0 mb-3'
        placeholder=''
        required
      />

      <div className='d-flex justify-content-end'>
        <button className='btn-secondary me-2' onClick={handleCancel}>
          Закрыть
        </button>
        <button className='btn-main' onClick={handleSaveNotes}>
          Сохранить {isSaving && <SpinnerSmall />} {/* Показать спиннер, если идет сохранение */}
        </button>
      </div>
    </div>
  );
};

export default NotesExerciseForm;