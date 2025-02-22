import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root-reducer';
import { listenerMiddleware } from './slices/mesocycles-slice';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export default store;