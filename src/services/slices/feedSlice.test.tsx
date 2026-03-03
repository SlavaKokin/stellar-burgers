import reducer, {
  fetchFeed,
  fetchProfileOrders,
  IFeedState
} from './feedSlice';

jest.mock('@api');

describe('Тестируем feedSlice', () => {
  let initialState: IFeedState;

  beforeEach(() => {
    initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      ordersAuth: [],
      isLoading: false,
      error: null
    };
  });

  // Тест: при вызове fetchFeed.pending isLoading = true, error = null
  it('fetchFeed.pending устанавливает значение isLoading равным true и сбрасывает ошибку', () => {
    const state = reducer(initialState, fetchFeed.pending('', undefined));
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Тест: при успешном fetchFeed, данные записываются, isLoading = false
  it('fetchFeed.fulfilled обновляет состояние и устанавливает значение isLoading равным false', () => {
    const mockResponseFeed = {
      success: true,
      orders: [
        {
          _id: '69a12e6ea64177001b32dd2c',
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa0941',
            '643d69a5c3f7b9001cfa093c'
          ],
          status: 'done',
          name: 'Био-марсианский краторный бургер',
          createdAt: '2026-02-27T05:41:02.835Z',
          updatedAt: '2026-02-27T05:41:03.064Z',
          number: 101972
        }
      ],
      total: 25966,
      totalToday: 125
    };
    const state = reducer(
      initialState,
      fetchFeed.fulfilled(mockResponseFeed, '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockResponseFeed.orders);
    expect(state.total).toBe(mockResponseFeed.total);
    expect(state.totalToday).toBe(mockResponseFeed.totalToday);
  });

  // Тест: при ошибке fetchFeed, error записывается, isLoading = false
  it('fetchFeed.rejected устанавливает ошибку и значение isLoading равно false', () => {
    const errorMsg = 'Ошибка загрузки ленты заказов';
    const action = {
      type: fetchFeed.rejected.type,
      error: { message: errorMsg }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  // Аналогичные тесты для fetchProfileOrders
  it('fetchProfileOrders.pending устанавливает значение isLoading равным true и сбрасывает ошибку', () => {
    const state = reducer(
      initialState,
      fetchProfileOrders.pending('', undefined)
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchProfileOrders.fulfilled обновляет ordersAuth и устанавливает для isLoading значение false', () => {
    const mockResponse = {
      success: true,
      orders: [
        {
          _id: '69a12e6ea64177001b32dd2c',
          ingredients: [
            '643d69a5c3f7b9001cfa093c',
            '643d69a5c3f7b9001cfa0941',
            '643d69a5c3f7b9001cfa093c'
          ],
          status: 'done',
          name: 'Био-марсианский краторный бургер',
          createdAt: '2026-02-27T05:41:02.835Z',
          updatedAt: '2026-02-27T05:41:03.064Z',
          number: 101972
        }
      ],
      total: 25966,
      totalToday: 125
    };
    const state = reducer(
      initialState,
      fetchProfileOrders.fulfilled(mockResponse, '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.ordersAuth).toEqual(mockResponse.orders);
  });

  it('fetchProfileOrders.rejected устанавливает ошибку и значение isLoading равно false', () => {
    const errorMsg = 'Ошибка загрузки заказов пользователя';
    const action = {
      type: fetchProfileOrders.rejected.type,
      error: { message: errorMsg }
    };
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
