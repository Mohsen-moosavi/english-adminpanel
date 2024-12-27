import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { createLevel, deleteLevelFunc, getLevelsFunc, updateLevelFunc } from "../../services/level.services";

export const createNewLevel = createAsyncThunk(
    'level/createNewLevel',
    async (
        { name },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(createLevel(name));

        if (response) {
            toast.success(response?.data?.message);
            return response.data;
        }
        console.log('errorrr=====>', error);

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);


export const getLevels = createAsyncThunk(
    'level/getLevels',
    async (
        { },
        { rejectWithValue }
    ) => {
        const { response, error } = await getLevelsFunc()

        if (response) {
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const deleteLevel = createAsyncThunk(
    'level/deleteLevel',
    async (
        { id },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteLevelFunc(id));

        console.log('responses---=====>', response);
        if (response) {
            toast.success(response?.data?.message);
            return response.data;
        }
        console.log('errorrr=====>', error);

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const updateLevel = createAsyncThunk(
    'level/updateLevel',
    async (
        { id , name },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(updateLevelFunc(id ,name));

        if (response) {
            toast.success(response?.data?.message);
            return response.data;
        }
        console.log('errorrr=====>', error);

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

const levelSlice = createSlice({
    name: "level",
    initialState: {
        levels: [],
        isLoading: false,
    },
    extraReducers: builder => {
        builder
            .addCase(createNewLevel.pending, state => {
                state.isLoading = true;
            })
            .addCase(createNewLevel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.levels = action.payload?.data?.levels;
            })
            .addCase(createNewLevel.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getLevels.pending, state => {
                state.isLoading = true;
            })
            .addCase(getLevels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.levels = action.payload?.data?.levels;
            })
            .addCase(getLevels.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteLevel.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteLevel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.levels = action.payload?.data?.levels;
            })
            .addCase(deleteLevel.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(updateLevel.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateLevel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.levels = action.payload?.data?.levels;
            })
            .addCase(updateLevel.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});



export default levelSlice.reducer;