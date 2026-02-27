import {
  fetchIngredients,
  TIngredientState,
  ingredientsSlice
} from './ingredientsSlice';

describe('Тестируем ingredientsSlice', () => {
  let initialState: TIngredientState;

  beforeEach(() => {
    initialState = {
      ingredients: [],
      isLoading: false,
      error: null
    };
  });

  // Тест: при вызове fetchIngredients.fulfilled isLoading = false
  it('fetchIngredients.fulfilled обновляет состояние и устанавливает значение isLoading равным false', () => {
    const mockIngredients = [
      {
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
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];
    const action = fetchIngredients.fulfilled(
      mockIngredients,
      'requestId',
      undefined
    );
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
  });

  // Тест: при вызове fetchIngredients.pending isLoading = true, error = null
  it('fetchFeed.pending устанавливает значение isLoading равным true и сбрасывает ошибку', () => {
    const action = fetchIngredients.pending('', undefined);
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Тест: при ошибке fetchIngredients, error записывается, isLoading = false
  it('fetchIngredients.rejected устанавливает ошибку и значение isLoading равно false', () => {
    const errorMsg = 'Ошибка загрузки ингредиентов';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMsg }
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
