import { TUserState, userSlice } from './userSlice';

describe('Тестируем orderSlice', () => {
  let initialState: TUserState;

  const mockUser = {
    email: 'UserTests@example.co',
    name: 'UserTests'
  };

  beforeEach(() => {
    initialState = {
      user: null,
      userAuthChecked: false,
      isLoading: false,
      error: null
    };
  });
  // Тесты для fetchUser
  it('fetchUser.pending состояние должно показывать isLoading: true, ошибка должна быть очищена (null)', () => {
    const action = {
      type: 'user/fetchUser/pending',
      payload: undefined,
      meta: undefined
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchUser.fulfilled получаем данные пользователя, сохраняем значение user, isLoading: false и userAuthChecked: true', () => {
    const action = {
      type: 'user/fetchUser/fulfilled',
      payload: mockUser
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
    expect(state.userAuthChecked).toBe(true);
  });

  it('fetchUser.rejected ошибка при получении пользователя, записываем сообщение ошибки', () => {
    const errorMsg = 'Ошибка при получении пользователя';
    const action = {
      type: 'user/fetchUser/rejected',
      error: { message: errorMsg }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.error).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });

  // Тесты для loginUser
  it('loginUser.pending состояние должно показывать isLoading: true, ошибка должна быть очищена (null)', () => {
    const action = {
      type: 'user/loginUser/pending'
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginUser.fulfilled получает пользователя, сохраняет его и устанавливает isLoading: false и userAuthChecked: true', () => {
    const mockLoginUser = { ...mockUser };
    const action = {
      type: 'user/loginUser/fulfilled',
      payload: mockLoginUser
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.user).toEqual(mockLoginUser);
    expect(state.isLoading).toBe(false);
    expect(state.userAuthChecked).toBe(true);
  });

  it('loginUser.rejected устанавливает сообщение ошибки и isLoading: false', () => {
    const errorMsg = 'Ошибка авторизации пользователя';
    const action = {
      type: 'user/loginUser/rejected',
      error: { message: errorMsg }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.error).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });

  // Тесты для registerUser
  it('registerUser.pending должно установить isLoading: true, ошибка null', () => {
    const action = { type: 'user/registerUser/pending' };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('registerUser.fulfilled сохраняет пользователя и устанавливает isLoading: false и userAuthChecked: true', () => {
    const mockRegisterUser = { ...mockUser };
    const action = {
      type: 'user/registerUser/fulfilled',
      payload: mockRegisterUser
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.user).toEqual(mockRegisterUser);
    expect(state.isLoading).toBe(false);
    expect(state.userAuthChecked).toBe(true);
  });

  it('registerUser.rejected устанавливает сообщение ошибки и isLoading: false', () => {
    const errorMsg = 'Ошибка регистрации пользователя';
    const action = {
      type: 'user/registerUser/rejected',
      error: { message: errorMsg }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.error).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });

  // Тесты для updateUser
  it('updateUser.pending состояние должно показывать isLoading: true, ошибка должна быть очищена (null)', () => {
    const action = {
      type: 'user/updateUser/pending'
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('updateUser.fulfilled получаем данные пользователя, сохраняем значение user, isLoading: false и userAuthChecked: true', () => {
    const action = {
      type: 'user/updateUser/fulfilled',
      payload: mockUser
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
  });

  it('updateUser.rejected ошибка при получении пользователя, записываем сообщение ошибки', () => {
    const errorMsg = 'Ошибка при обновлении пользователя';
    const action = {
      type: 'user/updateUser/rejected',
      error: { message: errorMsg }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.error).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });

  // Тесты для logoutUser
  it('logoutUser.pending должно установить isLoading: true, ошибка null', () => {
    const action = { type: 'user/logout/pending' };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('logoutUser.fulfilled очищает пользователя и устанавливает isLoading: false', () => {
    const prevState = {
      ...initialState,
      user: mockUser,
      userAuthChecked: true
    };
    const action = { type: 'user/logout/fulfilled' };
    const state = userSlice.reducer(prevState, action);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('logoutUser.rejected устанавливает сообщение ошибки и isLoading: false', () => {
    const errorMsg = 'Ошибка при выходе';
    const action = {
      type: 'user/logout/rejected',
      error: { message: errorMsg }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.error).toBe(errorMsg);
    expect(state.isLoading).toBe(false);
  });
});
