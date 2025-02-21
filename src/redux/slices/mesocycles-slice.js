
import { createSlice, createAsyncThunk, createSelector  } from '@reduxjs/toolkit';
import { getMesocycles, addMesocycle, updateMesocycle, deleteMesocycle, changeCurrentMesocycle, changeCurrentDay, deleteExerciseFromCurrentDay, addExerciseToCurrentDay, replaceExerciseInCurrentDay, moveExerciseInCurrentDay } from '../../services/hyper-app-service';

export const getMesocyclesThunk = createAsyncThunk(
    'data/getMesocycles',
    async (userId, { rejectWithValue }) => {
      try {
        return await getMesocycles(userId);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const postMesocycleThunk = createAsyncThunk(
    'data/addMesocycle',
    async (data, { rejectWithValue }) => {
      try {
        return await addMesocycle(data);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const updateMesocycleThunk = createAsyncThunk(
  'data/updateMesocycle',
  async ({ id }, { getState, rejectWithValue }) => {
    const state = getState();
    const mesocycle = state.mesocycles.mesocycles.find(m => m._id === id); // Берём из актуального состояния

    try {
      return await updateMesocycle(id, mesocycle);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMesocycleThunk = createAsyncThunk(
  'data/deleteMesocycle',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteMesocycle(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeCurrentMesocycleThunk = createAsyncThunk(
  'data/changeCurrentMesocycle',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      return await changeCurrentMesocycle(id, userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const changeCurrentDayThunk = createAsyncThunk(
  'data/changeCurrentDay',
  async ({ id, dayId }, { rejectWithValue }) => {
    try {
      return await changeCurrentDay(id, dayId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const deleteExerciseThunk = createAsyncThunk(
  'data/deleteExerciseFromCurrentDay',
  async ({ id, exerciseId }, { rejectWithValue }) => {
    try {
      return await deleteExerciseFromCurrentDay(id, exerciseId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const addExerciseThunk = createAsyncThunk(
  'data/addExerciseToCurrentDay',
  async ({ id, targetMuscleGroupId, exerciseId, notes }, { rejectWithValue }) => {
    try {
      return await addExerciseToCurrentDay(id, targetMuscleGroupId, exerciseId, notes);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const replaceExerciseThunk = createAsyncThunk(
  'data/replaceExerciseInCurrentDay',
  async ({ id, exerciseId, targetMuscleGroupId, newExerciseId, notes }, { rejectWithValue }) => {
    try {
      return await replaceExerciseInCurrentDay(id, exerciseId, targetMuscleGroupId, newExerciseId, notes);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const moveExerciseThunk = createAsyncThunk(
  'data/moveExerciseInCurrentDay',
  async ({ id, exerciseId, direction }, { rejectWithValue }) => {
    try {
      return await moveExerciseInCurrentDay(id, exerciseId, direction);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

// селекторы: 
export const selectCurrentMesocycle = createSelector(
  [(state) => state.mesocycles.mesocycles],
  (mesocycles) => mesocycles.find(mesocycle => mesocycle.isCurrent) || null
);

export const selectCurrentDayAndWeek = createSelector(
  [selectCurrentMesocycle],
  (mesocycle) => {
    if (!mesocycle) return { day: null, week: null, rir: null };

    const day = mesocycle.weeks.flatMap(week => week.days).find(d => d.isCurrent);
    const week = mesocycle.weeks.find(w => w.days.some(d => d.isCurrent));

    return { day: day || null, week: week || null };
  }
);

export const selectCurrentDay = createSelector(
  [selectCurrentDayAndWeek],
  ({ day }) => day
);

export const selectCurrentWeek = createSelector(
  [selectCurrentDayAndWeek],
  ({ week }) => week
);

// Функции

// Генерация ObjectId для MongoDB
const generateMongoObjectId = () => 
  [...Array(2)].map(() => Math.random().toString(16).slice(2, 8)).join('').padStart(24, '0');

// Получение текущей даты в формате "дек 19, 2025"
const getDate = () => new Date().toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', year: 'numeric' });

// Создание пустого подхода (сета)
const getEmptySet = (weight = '', type = 'straight') => ({
  weight,
  reps: '',
  type,
  isDone: false,
  _id: generateMongoObjectId(),
});

// Получение текущего мезоцикла
const findCurrentMesocycle = (mesocycles) => mesocycles.find(meso => meso.isCurrent) || null;

// Получение текущего дня в текущем мезоцикле
const getCurrentDay = (mesocycles) => {
  const mesocycle = findCurrentMesocycle(mesocycles);
  return mesocycle ? mesocycle.weeks.flatMap(week => week.days).find(day => day.isCurrent) || null : null;
};

// Поиск дня по ID в текущем мезоцикле
const getDayById = (mesocycles, dayId) => {
  const mesocycle = findCurrentMesocycle(mesocycles);
  return mesocycle ? mesocycle.weeks.flatMap(week => week.days).find(day => day._id === dayId) || null : null;
};

// Проверка, завершены ли все подходы в упражнении
const isExerciseDone = (exercise) => exercise.sets.every(set => set.isDone);

// Проверка, завершены ли все упражнения в дне
const areAllExercisesDone = (day) => day.exercises.every(isExerciseDone);

// Проверка, завершены ли все упражнения в дне и установка флага
const markDayIfDone = (day) => {
  if (day) {
    if (areAllExercisesDone(day)) {
      // Все упражнения завершены, помечаем день как завершённый
      markDayAsDone(day);
    } else {
      // Не все упражнения завершены, помечаем день как не завершённый
      markDayAsNotDone(day);
    }
  }
};

// Отметка дня как завершенного
const markDayAsDone = (day) => {
  if (day) {
    day.isDone = true;
    day.endDate = getDate();
  }
};

// Сброс отметки дня как завершенного
const markDayAsNotDone = (day) => {
  if (day) {
    day.isDone = false;
    day.endDate = '';
  }
};

// Начальное состояние
const initialState = {
  mesocycles: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  loadingElements: {
    changeCurrentDayLoading: false,
    deleteExerciseLoading: null,
    addExerciseLoading: false,
    replaceExerciseLoading: null,
    moveExerciseLoading: null,
  },
};

// Слайс
const mesocyclesSlice = createSlice({
    name: 'mesocycles',
    initialState,
    reducers: {
      
      // проверка завершен ли мезоцикл
      updateMesocycleStatus(state) {
        const mesocycle = findCurrentMesocycle(state.mesocycles);
        if (mesocycle) {
          mesocycle.isDone = mesocycle.weeks.every(week => week.days.every(day => day.isDone));
          if (mesocycle.isDone) mesocycle.endDate = getDate();
        }
      },

      
  
      changeSet(state, action) {
        const { name, value, exerciseId, setId } = action.payload;
        const day = getCurrentDay(state.mesocycles);
        const exercise = day.exercises.find(ex => ex._id === exerciseId);
        const set = exercise?.sets.find(set => set._id === setId);
        if (set) set[name] = value;
        markDayIfDone(day);
        mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
  
      deleteSet(state, action) {
        const { exerciseId, setId } = action.payload;
        const day = getCurrentDay(state.mesocycles);
        const exercise = day.exercises.find(ex => ex._id === exerciseId);
        if (exercise) exercise.sets = exercise.sets.filter(set => set._id !== setId);
        markDayIfDone(day);
        mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
  
      addSet(state, action) {
        const { exerciseId } = action.payload;
        const day = getCurrentDay(state.mesocycles);
        const exercise = day.exercises.find(ex => ex._id === exerciseId);
        if (exercise) exercise.sets.push(getEmptySet());
        markDayIfDone(day);
        mesocyclesSlice.caseReducers.updateMesocycleStatus(state);

      },

      addSetBelow(state, action) {
        const { exerciseId, setId } = action.payload;
        const day = getCurrentDay(state.mesocycles);
        const exercise = day.exercises.find(exercise => exercise._id === exerciseId);
    
        if (exercise) {
            const prevSet = exercise.sets.find(set => set._id === setId);
            if (prevSet) {
                const newSet = getEmptySet(prevSet.weight, prevSet.type);
                const index = exercise.sets.indexOf(prevSet);
                exercise.sets.splice(index + 1, 0, newSet);
            }
        }

        markDayIfDone(day);
        mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
  
      applyNotesToExercisesInCurrentMesocycle(state, action) {
        const { exerciseId, notes } = action.payload;
        const mesocycle = findCurrentMesocycle(state.mesocycles);
        mesocycle?.weeks.forEach(week =>
          week.days.forEach(day => {
            const exercise = day.exercises.find(ex => ex.exerciseId === exerciseId);
            if (exercise) exercise.notes = notes;
          })
        );
      },
    },
    extraReducers: (builder) => {
      // Обработка getMesocyclesThunk
      builder
        .addCase(getMesocyclesThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(getMesocyclesThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.mesocycles = action.payload;
        })
        .addCase(getMesocyclesThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });

      // Обработка postMesocycleThunk
      builder
        .addCase(postMesocycleThunk.pending, (state) => {
            state.status = 'loading';
        })  
        .addCase(postMesocycleThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.mesocycles.map((mesocycle) => mesocycle.isCurrent=false);
            state.mesocycles = [...state.mesocycles, action.payload]; // Иммутабельное обновление массива
        })
        .addCase(postMesocycleThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
      
      // Обработка updateMesocycleThunk
      builder
        .addCase(updateMesocycleThunk.pending, (state, action) => {
            state.status = 'loading';
        })
        .addCase(updateMesocycleThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          // Найти индекс обновляемого мезоцикла
          const index = state.mesocycles.findIndex(
              (mesocycle) => mesocycle._id === action.payload._id
          );
      
          if (index !== -1) {
              // Если мезоцикл найден, заменяем его новым
              state.mesocycles[index] = action.payload;
          }
        })
        .addCase(updateMesocycleThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

      // Обработка deleteMesocyclesThunk
      builder
        .addCase(deleteMesocycleThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(deleteMesocycleThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const idToRemove = action.payload.deletedMesocycle._id;
          state.mesocycles = state.mesocycles.filter((mesocycle) => mesocycle._id !== idToRemove);
        })
        .addCase(deleteMesocycleThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });

      // Обработка changeCurrentMesocyclesThunk
      builder
        .addCase(changeCurrentMesocycleThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(changeCurrentMesocycleThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';

          state.mesocycles = state.mesocycles.map((mesocycle) => ({
              ...mesocycle,
              isCurrent: mesocycle._id === action.payload._id,
          }));
        })
        .addCase(changeCurrentMesocycleThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });

      // Обработка changeCurrentDayThunk
      builder
        .addCase(changeCurrentDayThunk.pending, (state) => {
          state.loadingElements.changeCurrentDayLoading = true;
        })
        .addCase(changeCurrentDayThunk.fulfilled, (state, action) => {
          state.loadingElements.changeCurrentDayLoading = false;
          
          const prevDay = getCurrentDay(state.mesocycles);
          const newDay = getDayById(state.mesocycles, action.meta.arg.dayId);
          
          if (prevDay) prevDay.isCurrent = false;
          if (newDay) newDay.isCurrent = true;
          
        })
        .addCase(changeCurrentDayThunk.rejected, (state, action) => {
          state.loadingElements.changeCurrentDayLoading = false;
          state.error = action.payload;
        });

      // Обработка deleteExerciseThunk
      builder
        .addCase(deleteExerciseThunk.pending, (state, action) => {
          state.loadingElements.deleteExerciseLoading = action.meta.arg.exerciseId;
        })
        .addCase(deleteExerciseThunk.fulfilled, (state, action) => {
          state.loadingElements.deleteExerciseLoading = null;
          
          const day = getCurrentDay(state.mesocycles);
          if (!day) return;
          day.exercises = day.exercises.filter(exercise => exercise._id !== action.meta.arg.exerciseId);
        })
        .addCase(deleteExerciseThunk.rejected, (state, action) => {
          state.loadingElements.deleteExerciseLoading = null;
          state.error = action.payload;
        });

      // Обработка addExerciseThunk
      builder
        .addCase(addExerciseThunk.pending, (state) => {
          state.loadingElements.addExerciseLoading = true;
        })
        .addCase(addExerciseThunk.fulfilled, (state, action) => {
          state.loadingElements.addExerciseLoading = false;
          
          const day = getCurrentDay(state.mesocycles);
          if (!day) return;
          day.exercises.push(action.payload.exercise);
        })
        .addCase(addExerciseThunk.rejected, (state, action) => {
          state.loadingElements.addExerciseLoading = false;
          state.error = action.payload;
        });

      // Обработка replaceExerciseThunk
      builder
        .addCase(replaceExerciseThunk.pending, (state, action) => {
          state.loadingElements.replaceExerciseLoading = action.meta.arg.exerciseId;
        })
        .addCase(replaceExerciseThunk.fulfilled, (state, action) => {
          state.loadingElements.replaceExerciseLoading = null;
          
          const day = getCurrentDay(state.mesocycles);
          if (!day) return;
          const index = day.exercises.findIndex(ex => ex._id === action.meta.arg.exerciseId);
          if (index !== -1) {
            // Заменяем старое упражнение на новое
            day.exercises[index] = action.payload.exercise;
          }
        })
        .addCase(replaceExerciseThunk.rejected, (state, action) => {
          state.loadingElements.replaceExerciseLoading = null;
          state.error = action.payload;
        });
      // Обработка moveExerciseThunk
      builder
        .addCase(moveExerciseThunk.pending, (state, action) => {
          state.loadingElements.moveExerciseLoading = action.meta.arg.exerciseId;
        })
        .addCase(moveExerciseThunk.fulfilled, (state, action) => {
          state.loadingElements.moveExerciseLoading = null;
          
          const { exerciseId, direction } = action.meta.arg; // Исправил деструктуризацию
          const day = getCurrentDay(state.mesocycles);
          if (!day) return;
      
          const index = day.exercises.findIndex(ex => ex._id === exerciseId);
          const newIndex = direction === "up" ? index - 1 : index + 1;
      
          if (index !== -1 && newIndex >= 0 && newIndex < day.exercises.length) {
              [day.exercises[index], day.exercises[newIndex]] = [day.exercises[newIndex], day.exercises[index]];
          }
        })
        .addCase(moveExerciseThunk.rejected, (state, action) => {
          state.loadingElements.moveExerciseLoading = null;
          state.error = action.payload;
        });
    },
  });

  export const { 
    setCurrentDayId, 
    replaceExercise,
    moveUpExercise,
    moveDownExercise,
    changeSet, 
    addSet, 
    addSetBelow,
    deleteSet, 
    applyNotesToExercisesInCurrentMesocycle 
  } = mesocyclesSlice.actions;
  
  export default mesocyclesSlice.reducer;