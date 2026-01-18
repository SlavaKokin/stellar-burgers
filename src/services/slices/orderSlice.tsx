import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export type TOrderState = {
  createOrder: TOrder | null;
  createOrderIsLoading: boolean;
  detailOrder: TOrder | null;
  detailOrderIsLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  createOrder: null,
  createOrderIsLoading: false,
  detailOrder: null,
  detailOrderIsLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients, thunkAPI) => {
  try {
    const data = await orderBurgerApi(ingredients);
    if (data?.success) {
      return data.order;
    } else {
      return thunkAPI.rejectWithValue('Ошибка при создании заказа');
    }
  } catch {
    return thunkAPI.rejectWithValue('Ошибка сети или сервера');
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, thunkAPI) => {
  try {
    const response = await getOrderByNumberApi(number);
    if (response?.success) {
      return response.orders[0];
    } else {
      return thunkAPI.rejectWithValue('Заказ не найден или ошибка');
    }
  } catch {
    return thunkAPI.rejectWithValue('Ошибка сети или сервера');
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearNewOrder(state) {
      state.createOrder = null;
    },
    clearCurrentOrder(state) {
      state.detailOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createOrderIsLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrder = action.payload;
        console.log('createOrder', action.payload);
        state.createOrderIsLoading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrderIsLoading = false;
        state.error = action.error.message || 'Ошибка при создании заказа';
      });
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.detailOrderIsLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.detailOrder = action.payload;
        state.detailOrderIsLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.detailOrderIsLoading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказа';
      });
  }
});

export const { clearNewOrder, clearCurrentOrder } = orderSlice.actions;

export const createOrderSelect = (state: RootState) => state.order.createOrder;
export const createOrderIsLoadingSelect = (state: RootState) =>
  state.order.createOrderIsLoading;
export const detailOrderSelect = (state: RootState) => state.order.detailOrder;
export const detailOrderLoadingSelect = (state: RootState) =>
  state.order.detailOrderIsLoading;
export const orderIsLoadingSelect = (state: RootState) =>
  state.order.createOrderIsLoading || state.order.detailOrderIsLoading;

export default orderSlice.reducer;
