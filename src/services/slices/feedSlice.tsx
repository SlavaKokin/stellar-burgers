import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export type IFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  ordersAuth: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  ordersAuth: [],
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchProfileOrders = createAsyncThunk(
  'feed/fetchProfileOrders',
  async () => {
    const response = await getOrdersApi();
    return { orders: response };
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed(state, action) {
      state.orders = action.payload;
    },
    setOrdersAuth(state, action) {
      state.ordersAuth = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      });

    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersAuth = action.payload.orders;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки заказов пользователя';
      });
  }
});

export const { setFeed, setOrdersAuth, setLoading, setError } =
  feedSlice.actions;

export const selectFeed = (state: RootState) => state.feed.orders;
export const selectTotal = (state: RootState) => state.feed.total;
export const selectTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedOrdersAuth = (state: RootState) => state.feed.ordersAuth;
export const selectFeedisLoading = (state: RootState) => state.feed.isLoading;

export default feedSlice.reducer;
