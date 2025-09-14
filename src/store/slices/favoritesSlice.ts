import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from "@/store";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type FavState = { ids: number[] };
const initialState: FavState = { ids: [] };

// Cargar favoritos al iniciar
export const loadFavorites = createAsyncThunk<number[]>(
  'favorites/load',
  async () => {
    const res = await fetch(`${API_BASE}/characters?favorite=true`);
    const chars: Array<{ id: number }> = await res.json();
    return chars.map(c => c.id);
  }
);

export const toggleFavorite = createAsyncThunk<
  { id: number; next: boolean },
  { id: number; next: boolean },
  { state: RootState }
>('favorites/toggle', async ({ id, next }) => {
  const r = await fetch(`${API_BASE}/characters/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorite: next }),
  });
  if (!r.ok) throw new Error('toggle failed');
  return { id, next };
});

const slice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: b => {
    b.addCase(loadFavorites.fulfilled, (s, a) => { s.ids = a.payload; });
    b.addCase(toggleFavorite.fulfilled, (s, a) => {
      const { id, next } = a.payload;
      s.ids = next ? [...new Set([...s.ids, id])] : s.ids.filter(x => x !== id);
    });
  }
});

export const selectFavIds = (s: RootState) => s.favorites.ids;
export const selectIsFavorite = (id: number) => (s: RootState) => s.favorites.ids.includes(id);
export default slice.reducer;
