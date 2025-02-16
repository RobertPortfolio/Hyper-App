
import { createSlice, createAsyncThunk, createSelector  } from '@reduxjs/toolkit';
import { getMesocycles, addMesocycle, updateMesocycle, deleteMesocycle, changeCurrentMesocycle } from '../../services/hyper-app-service';

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
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateMesocycle(id, data);
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

export const selectCurrentDay = createSelector(
  [(state) => state.mesocycles.mesocycles, (state) => state.mesocycles.currentDayId],
  (mesocycles, currentDayId) => {
      for (const mesocycle of mesocycles) {
          for (const week of mesocycle.weeks) {
              const day = week.days.find((day) => day._id === currentDayId);
              if (day) return day;
          }
      }
      return null;
  }
);

export const selectCurrentWeek = createSelector(
  [(state) => state.mesocycles.mesocycles, (state) => state.mesocycles.currentDayId],
  (mesocycles, currentDayId) => {
      for (const mesocycle of mesocycles) {
          for (const week of mesocycle.weeks) {
              const day = week.days.find((day) => day._id === currentDayId);
              if (day) return week;
          }
      }
      return null;
  }
);

export const selectCurrentMesocycles = createSelector(
  [(state) => state.mesocycles.mesocycles],
  (mesocycles) => {
      const mesocycle = mesocycles.find(mesocycle =>
        mesocycle.isCurrent
      );
      if (mesocycle) return mesocycle;
      return null;
  }
);

const generateMongoObjectId = () => {
  return (Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') +
          Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')).padStart(24, '0');
};

const getEmptySet = (weight='', type='straight') => {
  return {
      weight: weight,
      reps: '',
      type: type,
      isDone: false,
      _id: generateMongoObjectId(),
  };
};

const getEmptyExercise = (targetMuscleGroupId, exerciseId, notes='') => {
  return {
    targetMuscleGroupId: targetMuscleGroupId,
    exerciseId: exerciseId,
    sets: [ getEmptySet(), getEmptySet() ],
    notes: notes,
    pumpRate: '',
    sorenessRate: '',
    jointPainRate: '',
    workloadRate: '',
    _id: generateMongoObjectId(),
  }
}

const findDayById = (mesocycles, dayId) => {
  // Находим день по ID во всех мезоциклах и неделях
  for (const mesocycle of mesocycles) {
    for (const week of mesocycle.weeks) {
      const day = week.days.find((day) => day._id === dayId);
      if (day) return day;
    }
  }
  return null; // Если день не найден
};

const allExerciseDone = (exercise) => {
  return exercise.sets.every((set) => set.isDone);
}

const allSetsDone = (day) => {
  return day.exercises.every((exercise) =>
      allExerciseDone(exercise)
  );
};

const initialState = {
  mesocycles: [],
  currentDayId: null,
  currentRir: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

// Слайс
const mesocyclesSlice = createSlice({
    name: 'mesocycles',
    initialState,
    reducers: {
      setCurrentDayId(state, action) {
        state.currentDayId = action.payload.dayId;
        state.currentRir = action.payload.rir || state.currentRir;
      },
      changeCurrentDay(state, action) {

        const prevCurrentDay = findDayById(state.mesocycles, state.currentDayId);
        prevCurrentDay.isCurrent = false;

        const newCurrentDay = findDayById(state.mesocycles, action.payload);
        newCurrentDay.isCurrent = true;

      },
      // проверка завершен ли мезоцикл
      updateMesocycleStatus(state) {
        const currentMesocycle = state.mesocycles.find((mesocycle) => mesocycle.isCurrent);
        
        if (currentMesocycle) {
            // Проверяем, завершены ли все дни в текущем мезоцикле
            const allDaysDone = currentMesocycle.weeks.every((week) =>
                week.days.every((day) => day.isDone)
            );
            // Обновляем поле isDone текущего мезоцикла
            if (allDaysDone) {
              const now = new Date();
              const formattedDate = now.toLocaleDateString('ru-RU', {
                  month: 'short', // Короткое название месяца (например, Dec)
                  day: 'numeric', // Число
                  year: 'numeric' // Год
              });
              currentMesocycle.endDate = formattedDate;
            }
            currentMesocycle.isDone = allDaysDone;
        }
      },
      deleteExercise(state, action) {
        const { exerciseId } = action.payload;
        const day = findDayById(state.mesocycles, state.currentDayId);
        if (day) {
          day.exercises = day.exercises.filter(exercise => exercise._id !== exerciseId);
        }
        day.isDone = allSetsDone(day);
        mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
      replaceExercise(state, action) {
        const { exerciseId, newExerciseId, exercisesList } = action.payload;
        const day = findDayById(state.mesocycles, state.currentDayId);
        const exercise = day.exercises.find(
          (exercise) => exercise._id === exerciseId
        );
        if (exercise) {
          exercise.exerciseId = newExerciseId;
          exercise.sets = [ getEmptySet() ];
          exercise.notes = exercisesList.find((exerciseItem) => exerciseItem._id === newExerciseId)?.notes ?? '';
          exercise.pumpRate = '';
          exercise.sorenessRate = '';
          exercise.jointPainRate = '';
          exercise.workloadRate = '';
        }
        day.isDone = allSetsDone(day);
        mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
      addExercise(state, action) {
        const { targetMuscleGroupId, exerciseId, notes } = action.payload;
        const day = findDayById(state.mesocycles, state.currentDayId);
        day.exercises = [...day.exercises, getEmptyExercise(targetMuscleGroupId, exerciseId, notes) ]
        day.isDone = allSetsDone(day);
        mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
      moveUpExercise(state, action) {
        const { exerciseId } = action.payload;
        const day = findDayById(state.mesocycles, state.currentDayId);
        const exerciseIndex = day.exercises.findIndex((exercise) => exercise._id === exerciseId);
        // Проверяем, что элемент не находится в начале массива
        if (exerciseIndex > 0) {
            // Переставляем элементы местами
            [day.exercises[exerciseIndex - 1], day.exercises[exerciseIndex]] = 
            [day.exercises[exerciseIndex], day.exercises[exerciseIndex - 1]];
        }
      },
      moveDownExercise(state, action) {
        const { exerciseId } = action.payload;
        const day = findDayById(state.mesocycles, state.currentDayId);
        const exerciseIndex = day.exercises.findIndex((exercise) => exercise._id === exerciseId);
        // Проверяем, что элемент не находится в конче массива
        if (exerciseIndex < day.exercises.length - 1) {
            // Переставляем элементы местами
            [day.exercises[exerciseIndex], day.exercises[exerciseIndex + 1]] = 
            [day.exercises[exerciseIndex + 1], day.exercises[exerciseIndex]];
        }
      },
      changeSet(state, action) {
          const { name, value, exerciseId, setId} = action.payload;
          const day = findDayById(state.mesocycles, state.currentDayId);
          const exercise = day.exercises.find(
              (exercise) => exercise._id === exerciseId
          );
          if (exercise) {
              const set = exercise.sets.find((set) => set._id === setId);
              if (set) {
                  set[name] = value;
              }
          }
          day.isDone = allSetsDone(day);
          mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
      deleteSet(state, action) {
          const { exerciseId, setId } = action.payload;
          const day = findDayById(state.mesocycles, state.currentDayId);
          const exercise = day.exercises.find(exercise => exercise._id === exerciseId);
          if (exercise) {
              exercise.sets = exercise.sets.filter(set => set._id !== setId);
          }
          day.isDone = allSetsDone(day);
          mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
      addSet(state, action) {
          const { exerciseId } = action.payload;
          const day = findDayById(state.mesocycles, state.currentDayId);
          const exercise = day.exercises.find(exercise => exercise._id === exerciseId);
          if (exercise) {
              // Добавляем новый набор в массив sets
              exercise.sets.push(getEmptySet());
          }
          day.isDone = allSetsDone(day);
          mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
      addSetBelow(state, action) {
          const { exerciseId, setId } = action.payload;
          const day = findDayById(state.mesocycles, state.currentDayId);
          const exercise = day.exercises.find(exercise => exercise._id === exerciseId);
          if (exercise) {
              // Добавляем новый набор в массив sets
              const prevSetIndex = exercise.sets.findIndex((set) => set._id === setId);
              if (prevSetIndex !== -1) {
                const prevSet = exercise.sets[prevSetIndex];
                // Вставляем новый подход под предыдущим
                exercise.sets.splice(prevSetIndex + 1, 0, getEmptySet(prevSet.weight, prevSet.type));
              }
          }
          day.isDone = allSetsDone(day);
          mesocyclesSlice.caseReducers.updateMesocycleStatus(state);
      },
      applyNotesToExercisesInCurrentMesocycle(state, action) {
        const { exerciseId, notes } = action.payload;

        const mesocycle = state.mesocycles.find(mesocycle =>
          mesocycle.isCurrent
        );

        if (mesocycle) {
          // Обновить заметки упражнения во всех днях текущего мезоцикла
          mesocycle.weeks.forEach(week => {
              week.days.forEach(day => {
                  const exercise = day.exercises.find(exercise => exercise.exerciseId === exerciseId);
                  if (exercise) {
                      exercise.notes = notes;
                  }
              });
          });
      }
        
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
        .addCase(updateMesocycleThunk.pending, (state) => {
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
    },
  });

  export const { 
    setCurrentDayId, 
    changeCurrentDay, 
    deleteExercise, 
    replaceExercise,
    addExercise,
    moveUpExercise,
    moveDownExercise,
    changeSet, 
    addSet, 
    addSetBelow,
    deleteSet, 
    applyNotesToExercisesInCurrentMesocycle 
  } = mesocyclesSlice.actions;
  
  export default mesocyclesSlice.reducer;