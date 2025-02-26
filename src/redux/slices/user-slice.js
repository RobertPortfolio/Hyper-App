import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { register, login, logout, fetchCurrentUser } from '../../services/user-service';

// Асинхронные действия
export const registerUser = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        return await register(userData);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const loginUser = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
    try {
        return await login(credentials);
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        return await logout();
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const initializeUser = createAsyncThunk('user/initialize', async (_, { getState, rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token'); // или getState().user.token;
        if (!token) return rejectWithValue('Нет токена');

        const user = await fetchCurrentUser(token);
        return user;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const initialToken = localStorage.getItem('token');

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null, // Данные пользователя
        isAuthenticated: !!initialToken, // Авторизован ли пользователь
        loading: false, // Статус загрузки
        error: null, // Ошибки
    },
    reducers: {
        resetError(state) {
            state.error = null;
        },
        setUser(state, action) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        clearUser(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token); // Сохраняем токен
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token'); // Удаляем токен
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(initializeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(initializeUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(initializeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;