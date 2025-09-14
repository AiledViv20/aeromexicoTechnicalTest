import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FavoritesState = {
  ids: number[];
};

const initialState: FavoritesState = { ids: [] };

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const id = action.payload;
      const i = state.ids.indexOf(id);
      if (i >= 0) state.ids.splice(i, 1);
      else state.ids.push(id);
    },
    setFavorites(state, action: PayloadAction<number[]>) {
      state.ids = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
