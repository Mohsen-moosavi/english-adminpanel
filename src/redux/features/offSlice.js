import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { createOffFunc, deleteOffFunc, getOffsFunc } from "../../services/off.service";

export const createNewOff = createAsyncThunk(
    'off/createNewOff',
    async (
        { percent, expire, isPublic, code, times, courses, isForAllCourses ,navigate },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(createOffFunc(percent, expire, times, isPublic, courses, code, isForAllCourses));

        if (response) {
            toast.success(response?.data?.message);
            navigate('/offs')
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


export const getOffs = createAsyncThunk(
    'off/getOffs',
    async (
        { limit, offset, search, orderStatus, publicStatus },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getOffsFunc(limit, offset, search, orderStatus, publicStatus))

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

export const deleteOff = createAsyncThunk(
    'off/deleteOff',
    async (
        { id,limit, offset, search, orderStatus, publicStatus },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteOffFunc(id,limit, offset, search, orderStatus, publicStatus))

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

const setSearchWordAction = (state, action) => {
    state.search = action.payload;
}

const setPublicStatusAction = (state, action) => {
    state.publicStatus = action.payload;
}

const setOrderStatusAction = (state, action) => {
    state.orderStatus = action.payload;
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}

const offSlice = createSlice({
    name: "off",
    initialState: {
        off:{},
        offs: [],
        offsCount: 0,
        offset: 0,
        limit: 10,
        search: '',
        orderStatus: '',
        publicStatus: '',
        isLoading: false,
    },
    reducers: {
        setSearch: setSearchWordAction,
        setPublicStatus : setPublicStatusAction,
        setOrderStatus : setOrderStatusAction,
        setOffset : setOffsetAction
    },
    extraReducers: builder => {
        builder
            .addCase(createNewOff.pending, state => {
                state.isLoading = true;
            })
            .addCase(createNewOff.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.tags = action.payload?.data?.tags;
                // state.tagsCount = action.payload?.data?.count;
            })
            .addCase(createNewOff.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getOffs.pending, state => {
                state.isLoading = true;
            })
            .addCase(getOffs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.offs = action.payload?.data?.offs;
                state.offsCount = action.payload?.data?.count;
            })
            .addCase(getOffs.rejected, (state, action) => {
                state.isLoading = false;
            })


        .addCase(deleteOff.pending, state => {
            state.isLoading = true;
        })
        .addCase(deleteOff.fulfilled, (state, action) => {
            state.isLoading = false;
            state.offs = action.payload?.data?.offs;
            state.offsCount = action.payload?.data?.count;
        })
        .addCase(deleteOff.rejected, (state, action) => {
            state.isLoading = false;
        })
    },
});

export const { setSearch , setPublicStatus , setOrderStatus, setOffset } = offSlice.actions;

export default offSlice.reducer;