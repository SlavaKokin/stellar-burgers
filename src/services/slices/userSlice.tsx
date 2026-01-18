import { createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData,
  logoutApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

// Получить текущего пользователя
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

// Войти в систему
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

// Зарегистрироваться
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    console.log('Токен сохранен в cookie:', getCookie('accessToken'));
    return response.user;
  }
);

// Обновить пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

// Проверить пользовател
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        const response = await getUserApi();
        return response.user;
      } catch (error) {
        // Можно обработать ошибку
        dispatch(setAuthUserCheck());
        return null;
      }
    } else {
      dispatch(setAuthUserCheck());
      return null;
    }
  }
);

export interface TUserState {
  user: TUser | null;
  userAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: TUserState = {
  user: null,
  userAuthChecked: false,
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthUserCheck: (state) => {
      state.userAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    // fetchUser
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.userAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error =
          action.error.message ?? 'Ошибка при получении пользователя';
        state.isLoading = false;
      })

      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка авторизации пользователя';
        state.isLoading = false;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка регистрации пользователя';
        state.isLoading = false;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка обновления пользователя';
        state.isLoading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка при выходе';
        state.isLoading = false;
      });
  }
});

export const { setAuthUserCheck } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserAuthChecked = (state: RootState) =>
  state.user.userAuthChecked;
export const selectUserIsLoading = (state: RootState) => state.user.isLoading;

export default userSlice.reducer;
