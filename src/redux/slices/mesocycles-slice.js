
import { createSlice, createAsyncThunk, createSelector, createListenerMiddleware, isAnyOf   } from '@reduxjs/toolkit';
import { getMesocycles, addMesocycle, deleteMesocycle, changeCurrentMesocycle, changeCurrentDay, deleteExerciseFromCurrentDay, addExerciseToCurrentDay, replaceExerciseInCurrentDay, moveExerciseInCurrentDay, deleteSet, addSet, updateSet, applyNotesToExercisesInMesocycle, updateStatus } from '../../services/mesocycles-service';

const createThunk = (type, asyncFunc) =>
  createAsyncThunk(type, async (args, { rejectWithValue }) => {
    try {
      return await asyncFunc(args);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const getMesocyclesThunk = createThunk(
  'data/getMesocycles',
  ({ userId }) => getMesocycles(userId)
);

export const postMesocycleThunk = createThunk(
  'data/addMesocycle',
  (data) => addMesocycle(data)
);

export const deleteMesocycleThunk = createThunk(
  'data/deleteMesocycle',
  ({ mesocycleId }) => deleteMesocycle(mesocycleId)
);

export const changeCurrentMesocycleThunk = createThunk(
  'data/changeCurrentMesocycle',
  ({ mesocycleId, userId }) => changeCurrentMesocycle(mesocycleId, userId)
);

export const changeCurrentDayThunk = createThunk(
  'data/changeCurrentDay',
  ({ mesocycleId, dayId }) => changeCurrentDay(mesocycleId, dayId)
);

export const deleteExerciseThunk = createThunk(
  'data/deleteExerciseFromCurrentDay',
  ({ mesocycleId, exerciseId }) => deleteExerciseFromCurrentDay(mesocycleId, exerciseId)
);

export const addExerciseThunk = createThunk(
  'data/addExerciseToCurrentDay',
  ({ mesocycleId, targetMuscleGroupId, exerciseId, notes }) =>
    addExerciseToCurrentDay(mesocycleId, targetMuscleGroupId, exerciseId, notes)
);

export const replaceExerciseThunk = createThunk(
  'data/replaceExerciseInCurrentDay',
  ({ mesocycleId, exerciseId, targetMuscleGroupId, newExerciseId, notes }) =>
    replaceExerciseInCurrentDay(mesocycleId, exerciseId, targetMuscleGroupId, newExerciseId, notes)
);

export const moveExerciseThunk = createThunk(
  'data/moveExerciseInCurrentDay',
  ({ mesocycleId, exerciseId, direction }) => moveExerciseInCurrentDay(mesocycleId, exerciseId, direction)
);

export const deleteSetThunk = createThunk(
  'data/deleteSet',
  ({ mesocycleId, exerciseId, setId }) => deleteSet(mesocycleId, exerciseId, setId)
);

export const addSetThunk = createThunk(
  'data/addSet',
  ({ mesocycleId, exerciseId, setId }) => addSet(mesocycleId, exerciseId, setId)
);

export const updateSetThunk = createThunk(
  'data/updateSet',
  ({ mesocycleId, exerciseId, set, isDone }) => updateSet(mesocycleId, exerciseId, set, isDone)
);

export const applyNotesToExercisesInMesocycleThunk = createThunk(
  'data/applyNotesToExercisesInMesocycle',
  ({ mesocycleId, exerciseId, notes }) => applyNotesToExercisesInMesocycle(mesocycleId, exerciseId, notes)
);

export const updateStatusThunk = createThunk(
  'data/updateStatus',
  ({ mesocycleId, dayId, isDone }) => updateStatus(mesocycleId, dayId, isDone)
);

// listener

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(
    deleteExerciseThunk.fulfilled,
    addExerciseThunk.fulfilled,
    replaceExerciseThunk.fulfilled,
    deleteSetThunk.fulfilled,
    addSetThunk.fulfilled,
    updateSetThunk.fulfilled
  ),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    const day = getCurrentDay(state.mesocycles.mesocycles);
    const mesocycle = findCurrentMesocycle(state.mesocycles.mesocycles);

    // Проверяем, завершен ли день
    if (day && day.exercises.every(ex => ex.sets.every(set => set.isDone))) {
      if (!day.isDone) { // Отправляем на сервер только если статус изменился
        await listenerApi.dispatch(updateStatusThunk({ mesocycleId: mesocycle._id, dayId: day._id, isDone: true }));
      }
    } else if (day?.isDone) {
      await listenerApi.dispatch(updateStatusThunk({ mesocycleId: mesocycle._id, dayId: day._id, isDone: false }));
    }
  },
});

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
    deleteSetLoading: null,
    addSetLoading: null,
    updateSetLoading: null,
    applyNotesLoading: null,
    updateStatusLoading: false,
  },
};

// Слайс
const mesocyclesSlice = createSlice({
    name: 'mesocycles',
    initialState,
    reducers: {
      changeSet(state, action) {
        const { name, value, exerciseId, setId } = action.payload;
        const day = getCurrentDay(state.mesocycles);
        const exercise = day.exercises.find(ex => ex._id === exerciseId);
        const set = exercise?.sets.find(set => set._id === setId);
        if (set) set[name] = value;
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
      // Обработка deleteSetThunk
      builder
        .addCase(deleteSetThunk.pending, (state, action) => {
          state.loadingElements.deleteSetLoading = action.meta.arg.setId;
        })
        .addCase(deleteSetThunk.fulfilled, (state, action) => {
          state.loadingElements.deleteSetLoading = null;
          
          const { exerciseId, setId } = action.meta.arg;
          const day = getCurrentDay(state.mesocycles);
          const exercise = day.exercises.find(ex => ex._id === exerciseId);
          if (exercise) exercise.sets = exercise.sets.filter(set => set._id !== setId);
        })
        .addCase(deleteSetThunk.rejected, (state, action) => {
          state.loadingElements.deleteSetLoading = null;
          state.error = action.payload;
        });
      // Обработка addSetThunk
      builder
        .addCase(addSetThunk.pending, (state, action) => {
          state.loadingElements.addSetLoading = action.meta.arg.exerciseId;
        })
        .addCase(addSetThunk.fulfilled, (state, action) => {
          state.loadingElements.addSetLoading = null;
          const { exerciseId, setId } = action.meta.arg;
          const day = getCurrentDay(state.mesocycles);
          const exercise = day.exercises.find(ex => ex._id === exerciseId);
          if(setId) {
            const prevSet = exercise.sets.find(set => set._id === setId);
            const index = exercise.sets.indexOf(prevSet);
            exercise.sets.splice(index + 1, 0, action.payload.newSet);
          } else {
            exercise.sets.push(action.payload.newSet)
          }
        })
        .addCase(addSetThunk.rejected, (state, action) => {
          state.loadingElements.addSetLoading = null;
          state.error = action.payload;
        });
      // Обработка updateSetThunk
      builder
        .addCase(updateSetThunk.pending, (state, action) => {
          state.loadingElements.updateSetLoading = action.meta.arg.set._id;
        })
        .addCase(updateSetThunk.fulfilled, (state, action) => {
          state.loadingElements.updateSetLoading = null;
          const { exerciseId, set, isDone } = action.meta.arg;
          const day = getCurrentDay(state.mesocycles);
          const exercise = day.exercises.find(ex => ex._id === exerciseId);
          
          if (exercise) {
            // Найдём индекс подхода (set) по его _id
            const setIndex = exercise.sets.findIndex(s => s._id === set._id);
            if (setIndex !== -1) {
              // Обновляем подход, включая флаг isDone
              exercise.sets[setIndex] = set;
              exercise.sets[setIndex].isDone = isDone;
            }
          }
          
        })
        .addCase(updateSetThunk.rejected, (state, action) => {
          state.loadingElements.updateSetLoading = null;
          state.error = action.payload;
        });

      // Обработка applyNotesToExercisesInMesocycleThunk
      builder
        .addCase(applyNotesToExercisesInMesocycleThunk.pending, (state, action) => {
          state.loadingElements.applyNotesLoading = action.meta.arg.exerciseId;
        })
        .addCase(applyNotesToExercisesInMesocycleThunk.fulfilled, (state, action) => {
          state.loadingElements.applyNotesLoading = null;

          const { exerciseId, notes } = action.meta.arg;
          const mesocycle = findCurrentMesocycle(state.mesocycles);
          mesocycle?.weeks.forEach(week =>
            week.days.forEach(day => {
              const exercise = day.exercises.find(ex => ex.exerciseId === exerciseId);
              if (exercise) exercise.notes = notes;
            })
          );
        })
        .addCase(applyNotesToExercisesInMesocycleThunk.rejected, (state, action) => {
          state.loadingElements.applyNotesLoading = null;
          state.error = action.payload;
        });

      // Обработка updateStatusThunk
      builder
        .addCase(updateStatusThunk.pending, (state, action) => {
          state.loadingElements.updateStatusLoading = true;
        })
        .addCase(updateStatusThunk.fulfilled, (state, action) => {
          state.loadingElements.updateStatusLoading = false;
          const day = getDayById(state.mesocycles, action.meta.arg.dayId);
          day.isDone = action.payload.dayIsDone;
          if (action.payload.dayIsDone) day.endDate = action.payload.endDate;
          const mesocycle = findCurrentMesocycle(state.mesocycles);
          mesocycle.isDone = action.payload.mesocycleIsDone;
          if (action.payload.mesocycleIsDone) mesocycle.endDate = action.payload.endDate;
        })
        .addCase(updateStatusThunk.rejected, (state, action) => {
          state.loadingElements.updateStatusLoading = false;
          state.error = action.payload;
        });

    },
  });

  export const { 
    changeSet, 
  } = mesocyclesSlice.actions;
  
  export default mesocyclesSlice.reducer;