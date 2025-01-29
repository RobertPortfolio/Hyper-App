
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTemplates, addTemplate, deleteTemplate } from '../../services/hyper-app-service';

export const getTemplatesThunk = createAsyncThunk(
    'data/getTemplates',
    async (userId, { rejectWithValue }) => {
      try {
        return await getTemplates(userId);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const postTemplateThunk = createAsyncThunk(
    'data/addTemplate',
    async (data, { rejectWithValue }) => {
      try {
        return await addTemplate(data);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const deleteTemplateThunk = createAsyncThunk(
    'data/deleteTemplate',
    async (id, { rejectWithValue }) => {
      try {
        return await deleteTemplate(id);
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

const initialState = {
    templates: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
};

// Слайс
const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      // Обработка getTemplatesThunk
      builder
        .addCase(getTemplatesThunk.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(getTemplatesThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.templates = action.payload;
        })
        .addCase(getTemplatesThunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });

      // Обработка postTemplateThunk
      builder
        .addCase(postTemplateThunk.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(postTemplateThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.templates = [...state.templates, action.payload]; // Иммутабельное обновление массива
        })
        .addCase(postTemplateThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

      // Обработка deleteTemplateThunk
      builder
        .addCase(deleteTemplateThunk.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteTemplateThunk.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.templates = [...state.templates, action.payload];
            state.templates = state.templates.filter(
              (template) => template._id !== action.payload._id
            );
        })
        .addCase(deleteTemplateThunk.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
  });
  
  export default templatesSlice.reducer;