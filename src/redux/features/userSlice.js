import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest, getUserInfo } from "../../services/authApi.service";

export const getUserDate = createAsyncThunk(
    'user/getUserDate',
    async (
      {},
      { rejectWithValue }
    ) => {
        const {response , error} = await authRequest(getUserInfo());

        if(response) return response.data;
        console.log('errorrr=====>',error);

        if (error?.response?.status === 401) {
            window.location.assign('/login')
        } else {
          toast.error(error?.response?.data?.message);
        }
          return rejectWithValue(error);
    }
  );

const setUserLogginAction = (state , action)=>{
  state.isLogin = true;
}

const setUserLogoutAction = (state , action) =>{
  state.isLogin = false;
}

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: {},
        isLogin : false,
        error: null,
        isLoading: false,
    },
    reducers: {
        setUserLoggin : setUserLogginAction,
        setUserLogout : setUserLogoutAction
    },
    extraReducers: builder => {
        builder
          .addCase(getUserDate.pending, state => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getUserDate.fulfilled, (state, action) => {
            state.isLoading = false;
            state.userInfo = action.payload?.data?.user;
            state.isLogin = true;
          })
          .addCase(getUserDate.rejected, (state, action) => {
            state.isLoading = false;
            if(action.payload?.response?.data?.status === 401){
              state.userInfo = {}
            }
            state.error = action.payload?.response?.data?.message;
          })
      },
});


export const { setUserLoggin , setUserLogout } = userSlice.actions;

export default userSlice.reducer;