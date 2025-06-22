import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { getDataFunc, getUncompletedCoursesFunc } from "../../services/console.services";


export const getData = createAsyncThunk(
    'console/getData',
    async (
        { },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getDataFunc());

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
            window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }

        return rejectWithValue(error);
    }
);

export const getUncompletedCourses = createAsyncThunk(
    'console/getUncompletedCourses',
    async (
        { },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getUncompletedCoursesFunc());

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
            window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }

        return rejectWithValue(error);
    }
);


const consoleSlice = createSlice({
    name: "console",
    initialState: {
        chartData: [],
        unCompletedCourses: [],
    },
    extraReducers: builder => {
        builder
            .addCase(getData.pending, state => {
                state.isLoading = true;
            })
            .addCase(getData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.chartData = action.payload?.data?.chartData;
                // state.commentsCount = action.payload?.data?.count;
            })
            .addCase(getData.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getUncompletedCourses.pending, state => {
                state.isLoading = true;
            })
            .addCase(getUncompletedCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.unCompletedCourses = action.payload?.data?.unCompletedCourses;
                // state.commentsCount = action.payload?.data?.count;
            })
            .addCase(getUncompletedCourses.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});

// export const { setSearch, setOffset, setStatus, setScore, setParentStatus } = commentSlice.actions;

export default consoleSlice.reducer;