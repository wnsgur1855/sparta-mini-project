import QUERY from '../../../../constants/query';
import Axios from '../../../api/axios';
import { getCookie } from '../../../cookie';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');

const initialState = {
  getHome: [],
  isLoading: false,
  isError: false,
  error: null,
};

const axios = new Axios(process.env.REACT_APP_URL);

const cookie = getCookie(QUERY.COOKIE.COOKIE_NAME);

const option = {
  headers: {
    Authorization: `Bearer ${cookie ? cookie : ''}`,
  },
};

export const __getHome = createAsyncThunk(
  'GET_HOME',
  async (payload, thunkAPI) => {
    return await axios
      .get(`/api/posts?page=${payload.page}&size=16${payload.query}`, option)
      .then(response => thunkAPI.fulfillWithValue(response.data.result))
      .catch(error => thunkAPI.rejectWithValue());
  },
);

const getHomeSlice = createSlice({
  name: 'getHome',
  initialState,
  reducers: {},
  extraReducers: bulider => {
    bulider.addCase(__getHome.pending, (state, _) => {
      state.isLoading = true;
      state.isError = false;
    });
    bulider.addCase(__getHome.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.getHome = [...state.getHome].concat(action.payload);
    });
    bulider.addCase(__getHome.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    });
  },
});

export default getHomeSlice.reducer;
