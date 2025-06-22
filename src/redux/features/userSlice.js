import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest, getUserInfo, logOutService } from "../../services/authApi.service";
import toast from "react-hot-toast";

export const getUserDate = createAsyncThunk(
    'user/getUserDate',
    async (
      {},
      { rejectWithValue }
    ) => {
        const {response , error} = await authRequest(getUserInfo());

        if(response) return response.data;

        if (error?.response?.status === 401) {
            window.location.assign('/login')
        } else {
          toast.error(error?.response?.data?.message);
        }
          return rejectWithValue(error);
    }
  );

  export const logout = createAsyncThunk(
    'user/logout',
    async (
      {},
      { rejectWithValue }
    ) => {      
        const {response , error} = await logOutService();

        if(response){
          toast.success('با موفقیت از حسابتان خارج شدید.')
          return true;
        };
        

        toast.error(error?.response?.data?.message);
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



          .addCase(logout.fulfilled, (state, action) => {
            state.userInfo = {};
            state.isLogin = false;
            window.location.assign('/login')
          })
      },
});


export const { setUserLoggin , setUserLogout } = userSlice.actions;

export default userSlice.reducer;