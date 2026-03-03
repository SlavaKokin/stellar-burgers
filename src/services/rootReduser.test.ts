import rootReducer from '../services/rootReducer';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { constructorSlice } from './slices/constructorSlice';
import { orderSlice } from './slices/orderSlice';
import { feedSlice } from './slices/feedSlice';

describe('Тестируем rootReducer', () => {
  it('должен возвращать правильную начальную структуру состояния', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    // Проверка наличия ключей
    expect(initialState).toHaveProperty([userSlice.name]);
    expect(initialState).toHaveProperty([feedSlice.name]);
    expect(initialState).toHaveProperty([ingredientsSlice.name]);
    expect(initialState).toHaveProperty([orderSlice.name]);
    expect(initialState).toHaveProperty([constructorSlice.name]);

    // Проверка начальных состояний каждого слайса
    expect(initialState[userSlice.name]).toEqual(userSlice.getInitialState());
    expect(initialState[feedSlice.name]).toEqual(feedSlice.getInitialState());
    expect(initialState[ingredientsSlice.name]).toEqual(
      ingredientsSlice.getInitialState()
    );
    expect(initialState[orderSlice.name]).toEqual(orderSlice.getInitialState());
    expect(initialState[constructorSlice.name]).toEqual(
      constructorSlice.getInitialState()
    );
  });
  // проверка целого rootReducer
  it('rootReducer должен возвращать корректное начальное состояние', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      [userSlice.name]: userSlice.getInitialState(),
      [feedSlice.name]: feedSlice.getInitialState(),
      [ingredientsSlice.name]: ingredientsSlice.getInitialState(),
      [orderSlice.name]: orderSlice.getInitialState(),
      [constructorSlice.name]: constructorSlice.getInitialState()
    });
  });

  // проверка, что редьюсер не мутирует состояние при неизвестном экшене
  it('rootReducer должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = {
      [userSlice.name]: userSlice.getInitialState(),
      [feedSlice.name]: feedSlice.getInitialState(),
      [ingredientsSlice.name]: ingredientsSlice.getInitialState(),
      [orderSlice.name]: orderSlice.getInitialState(),
      [constructorSlice.name]: constructorSlice.getInitialState()
    };
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const newState = rootReducer(prevState, unknownAction);
    expect(newState).toEqual(prevState);
  });
});
