import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { authRequest } from "../../services/authApi.service";
import { deleteExtrafileFunc, getExtrafileFunc, uploadExtrafileFunc } from "../../services/extrafile.service";


export const getExtraFile = createAsyncThunk(
    'extrafile/getExtrafiles',
    async (
        { offset, limit, articles, books, courses },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getExtrafileFunc(limit, offset, articles, books, courses))

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

export const getExtraFileAfterStatusChanging = createAsyncThunk(
    'extrafile/getExtrafilesAfterStatusChanging',
    async (
        { offset, limit, articles, books, courses },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getExtrafileFunc(limit, offset, articles, books, courses))

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

export const uploadExtraFile = createAsyncThunk(
    'extrafile/uploadExtrafiles',
    async (
        { offset, limit, articles, books, courses, file },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(uploadExtrafileFunc(limit, offset, articles, books, courses, file))

        if (response) {
            toast.success(response.message)
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

export const deleteExtraFile = createAsyncThunk(
    'extrafile/deleteExtrafiles',
    async (
        { offset, limit, articles, books, courses, id },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteExtrafileFunc(limit, offset, articles, books, courses, id))

        if (response) {
            toast.success(response.message)
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


const setCoursesStatusAction = (state, action) => {
    state.changingStatus = true
    state.offset = 0
    state.courses = action.payload
}

const setBooksStatusAction = (state, action) => {
    state.changingStatus = true
    state.offset = 0
    state.books = action.payload
}

const setArticlesStatusAction = (state, action) => {
    state.changingStatus = true
    state.offset = 0
    state.articles = action.payload
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload
}

const setExtrafilesAction = (state, action) => {
    state.extrafiles = action.payload
}


const extrafileSlice = createSlice({
    name: "extrafile",
    initialState: {
        extrafiles: [],
        extrafilesCount: 0,
        isLoading: false,
        changingStatus : false,
        gettingFiles : false,
        offset: 0,
        limit: 5,
        books: '',
        articles: '',
        courses: ''
    },
    reducers: {
        setBooksStatus: setBooksStatusAction,
        setArticlesStatus: setArticlesStatusAction,
        setCoursesStatus: setCoursesStatusAction,
        setOffset: setOffsetAction,
        setExtrafiles: setExtrafilesAction
    },
    extraReducers: builder => {
        builder
            .addCase(getExtraFile.pending, state => {
                state.isLoading = true;
                state.gettingFiles = true;
            })
            .addCase(getExtraFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.gettingFiles = false;
                state.extrafiles = [...state.extrafiles, ...action.payload?.extrafiles];
                state.extrafilesCount = action.payload?.count;
                state.offset = state.offset + state.limit;
                state.changingStatus = false;
            })
            .addCase(getExtraFile.rejected, (state, action) => {
                state.gettingFiles = false;
                state.changingStatus = false;
                state.isLoading = false;
            })

            .addCase(getExtraFileAfterStatusChanging.pending, state => {
                state.isLoading = true;
                state.gettingFiles = true;
            })
            .addCase(getExtraFileAfterStatusChanging.fulfilled, (state, action) => {
                state.isLoading = false;
                state.gettingFiles = false;
                state.extrafiles = action.payload?.extrafiles;
                state.extrafilesCount = action.payload?.count;
                state.offset = state.offset + state.limit;
                state.changingStatus = false;
            })
            .addCase(getExtraFileAfterStatusChanging.rejected, (state, action) => {
                state.gettingFiles = false;
                state.changingStatus = false;
                state.isLoading = false;
            })


            .addCase(uploadExtraFile.pending, state => {
                state.isLoading = true;
            })
            .addCase(uploadExtraFile.fulfilled, (state, action) => {
                state.extrafiles = [action.payload?.extrafile,...state.extrafiles];
                state.extrafilesCount = state.extrafilesCount + 1;
                state.offset = state.offset + 1;
                state.isLoading = false;
            })
            .addCase(uploadExtraFile.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteExtraFile.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteExtraFile.fulfilled, (state, action) => {
                const deletedExtraFileId = action.payload?.deletedExtraFileId;
                state.extrafiles = state.extrafiles.filter(item=> item.id !== deletedExtraFileId);
                state.extrafilesCount = state.extrafilesCount - 1;
                state.offset = state.offset - 1;
                state.isLoading = false;
            })
            .addCase(deleteExtraFile.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});

export const { setBooksStatus, setArticlesStatus, setCoursesStatus, setOffset, setExtrafiles } = extrafileSlice.actions;

export default extrafileSlice.reducer;