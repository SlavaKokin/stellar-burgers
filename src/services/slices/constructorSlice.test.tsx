import { configureStore } from '@reduxjs/toolkit';
import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('Тестируем constructorSlice', () => {
  let store = configureStore({
    reducer: { constructorBurger: constructorSlice.reducer }
  });

  const ingredient1: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: 'bun-id'
  };

  const ingredient2: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: 'main-id'
  };

  const ingredient3: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    id: 'sauce-id'
  };

  beforeEach(() => {
    store = configureStore({
      reducer: { constructorBurger: constructorSlice.reducer }
    });
  });

  test('добавляет ингредиент', () => {
    store.dispatch(addIngredient(ingredient2));
    const state = store.getState().constructorBurger;
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(ingredient2);
  });

  test('удаляет ингредиент по id', () => {
    store.dispatch(addIngredient({ ...ingredient1, id: 'bun-id' }));
    store.dispatch(addIngredient({ ...ingredient3, id: 'sauce-id' }));
    // удаляем ingredient по id 'bun-id'
    store.dispatch({
      type: 'constructorBurger/removeIngredient',
      payload: { id: 'bun-id' }
    });
    const state = store.getState().constructorBurger;
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('643d69a5c3f7b9001cfa0942');
  });

  test('изменяет порядок ингредиентов', () => {
    store.dispatch(addIngredient(ingredient1));
    store.dispatch(addIngredient(ingredient2));
    store.dispatch(addIngredient(ingredient3));
    // меняем местами 0 и 2
    store.dispatch({
      type: 'constructorBurger/moveIngredient',
      payload: { from: 1, to: 2 }
    });
    const state = store.getState().constructorBurger;
    expect(state.ingredients[1]._id).toBe('643d69a5c3f7b9001cfa0942');
    expect(state.ingredients[2]._id).toBe('643d69a5c3f7b9001cfa0941');
  });
});
