import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const fetchIngredients = createAsyncThunk(
  'fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export type TIngredientState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null | undefined;
};

const initialState: TIngredientState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const ingredientsActions = ingredientsSlice.actions;

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectingredientById = (id?: string) =>
  createSelector([selectIngredients], (ingredients) =>
    id ? ingredients.find((ingredient) => ingredient._id === id) : null
  );

export const selectIngredientsIsLoading = (state: RootState) =>
  state.ingredients.isLoading;
