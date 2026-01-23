import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    addBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    removeIngredient(state, action: PayloadAction<{ id: string }>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => (ingredient as any).id !== action.payload.id
      );
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      )
        return;
      const item = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, item);
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  addBun,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

// Получить весь слайс
export const selectConstructor = (state: RootState) => state.constructorBurger;

// Получить булку
export const selectConstructorBun = createSelector(
  selectConstructor,
  (constructorBurger) => constructorBurger.bun
);

// Получить массив ингредиентов
export const selectConstructorIngredients = createSelector(
  selectConstructor,
  (constructorBurger) => constructorBurger.ingredients
);

export const selectIngredientsCountMap = createSelector(
  selectConstructorIngredients,
  (ingredients) => {
    const countMap: Record<string, number> = {};
    ingredients.forEach((ing) => {
      if (ing.type !== 'bun') {
        countMap[ing._id] = (countMap[ing._id] || 0) + 1;
      }
    });
    return countMap;
  }
);
