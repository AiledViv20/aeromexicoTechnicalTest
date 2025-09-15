import { configureStore } from '@reduxjs/toolkit';
import favorites from './slices/favoritesSlice';

export const store = configureStore({ reducer: { favorites } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
