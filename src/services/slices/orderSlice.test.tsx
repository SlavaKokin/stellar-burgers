import { TOrderState, orderSlice } from './orderSlice';

describe('Тестируем orderSlice', () => {
  let initialState: TOrderState;

  beforeEach(() => {
    initialState = {
      createOrder: null,
      createOrderIsLoading: false,
      detailOrder: null,
      detailOrderIsLoading: false,
      error: null
    };
  });

  it('createOrder.pending инициируется процесс создания заказа, createOrderIsLoading установливается в true, error сбрасывается в null', () => {
    const action = {
      type: 'order/createOrder/pending',
      payload: undefined,
      meta: undefined
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.createOrderIsLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('createOrder.fulfilled создается заказ и сохраняется в createOrder, createOrderIsLoading переключается на false', () => {
    const mockOrder = {
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
    const action = {
      type: 'order/createOrder/fulfilled',
      payload: mockOrder.orders[0]
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.createOrder).toEqual(mockOrder.orders[0]);
    expect(state.createOrderIsLoading).toBe(false);
  });

  it('createOrder.rejected ошибка при создании заказа', () => {
    const errorMsg = 'Ошибка при создании заказа';
    const action = {
      type: 'order/createOrder/rejected',
      error: { message: errorMsg }
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.createOrderIsLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  it('fetchOrderByNumber.pending загрузка заказа по номеру, detailOrderIsLoading в true, ошибка сбрасывается', () => {
    const action = {
      type: 'order/fetchOrderByNumber/pending',
      payload: undefined,
      meta: undefined
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.detailOrderIsLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchOrderByNumber.fulfilled загрузка заказа по номеру и сохранение в detailOrder, detailOrderIsLoading должен стать false', () => {
    const mockOrder = {
      _id: '69a12e6ea64177001b32dd2c',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
      status: 'done',
      name: 'Био-марсианский краторный бургер',
      createdAt: '2026-02-27T05:41:02.835Z',
      updatedAt: '2026-02-27T05:41:03.064Z',
      number: 101972
    };
    const action = {
      type: 'order/fetchOrderByNumber/fulfilled',
      payload: mockOrder
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.detailOrder).toEqual(mockOrder);
    expect(state.detailOrderIsLoading).toBe(false);
  });

  it('fetchOrderByNumber.rejected проверяем правильную обработку ошибок при загрузке заказа по номеру', () => {
    const errorMsg = 'Ошибка сети или сервера';
    const action = {
      type: 'order/fetchOrderByNumber/rejected',
      error: { message: errorMsg }
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.detailOrderIsLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});
