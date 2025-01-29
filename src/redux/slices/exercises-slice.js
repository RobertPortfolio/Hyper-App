
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getExercises, addExercise, deleteExercise } from '../../services/hyper-app-service';

export const getExercisesThunk = createAsyncThunk(
  'data/getExercises',
  async (userId, { rejectWithValue }) => {
    try {
      return await getExercises(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const postExerciseThunk = createAsyncThunk(
  'data/addExercise',
  async (data, { rejectWithValue }) => {
    try {
      return await addExercise(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteExerciseThunk = createAsyncThunk(
  'data/deleteExercise',
  async (exercise, { rejectWithValue }) => {
    try {
      return await deleteExercise(exercise._id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
    exercises: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
};

// Слайс
const exercisesSlice = createSlice({
    name: 'exercises',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      // Обработка getExercisesThunk
      builder
        .addCase(getExercisesThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(getExercisesThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.exercises = action.payload;
        })
        .addCase(getExercisesThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });

      // Обработка postExerciseThunk
      builder
        .addCase(postExerciseThunk.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postExerciseThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.exercises = [...state.exercises, action.payload]; // Иммутабельное обновление массива
        })
        .addCase(postExerciseThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

      // Обработка deleteExerciseThunk
      builder
        .addCase(deleteExerciseThunk.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteExerciseThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.exercises = state.exercises.filter(
              (exercise) => exercise._id !== action.meta.arg._id
            ); // Иммутабельное обновление массива
        })
        .addCase(deleteExerciseThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
  });

  export default exercisesSlice.reducer;