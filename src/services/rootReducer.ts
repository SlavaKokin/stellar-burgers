import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { userSlice } from './slices/userSlice';
import { constructorSlice } from './slices/constructorSlice';
import { orderSlice } from './slices/orderSlice';
import { feedSlice } from './slices/feedSlice';

const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [feedSlice.name]: feedSlice.reducer,
  [ingredientsSlice.name]: ingredientsSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [constructorSlice.name]: constructorSlice.reducer
});

export default rootReducer;
