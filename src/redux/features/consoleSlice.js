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

// export const getComments = createAsyncThunk(
//     'comment/getComments',
//     async (
//         { limit, offset, search, score, status, parentStatus , userId},
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await getCommentsFunc(limit, offset, search, score, status, parentStatus , userId);

//         if (response) {
//             return response.data;
//         }

//         toast.error(error?.response?.data?.message);

//         return rejectWithValue(error);
//     }
// );

// export const changeAccept = createAsyncThunk(
//     'comment/changeAcceptComments',
//     async (
//         { id, accept, limit, offset, search, score, status, parentStatus , userId },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(changeAcceptFunc(id, accept, limit, offset, search, score, status, parentStatus , userId));

//         if (response) {
//             return response.data;
//         }

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//         }

//         return rejectWithValue(error);
//     }
// );

// export const deleteComment = createAsyncThunk(
//     'comment/deleteComment',
//     async (
//         { id, limit, offset, search, score, status, parentStatus , userId },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(deleteCommentFunc(id, limit, offset, search, score, status, parentStatus, userId));

//         if (response) {
//             toast.success(response?.data?.message);
//             return response.data;
//         }

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//         }

//         return rejectWithValue(error);
//     }
// );


// export const getCommentTree = createAsyncThunk(
//     'comment/getCommentTree',
//     async (
//         { id, navigate },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(getCommentTreeFunc(id))

//         if (response) {
//             return response.data;
//         }

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//         }
//         navigate('/comments')
//         return rejectWithValue(error);
//     }
// );

// export const answerToComment = createAsyncThunk(
//     'comment/answerToComment',
//     async (
//         { content, courseId, parentId, limit, offset, search, score, status, parentStatus, userId },
//         { rejectWithValue }
//     ) => {

//         const { response, error } = await authRequest(answerToCommentFunc(content, courseId, parentId, limit, offset, search, score, status, parentStatus , userId))

//         if (response) {
//             return response.data;
//         }

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//         }
//         return rejectWithValue(error);
//     }
// );

// export const answerToCommentInCommentLoop = createAsyncThunk(
//     'comment/answerToCommentInCommentLoop',
//     async (
//         { id, content, courseId, parentId, navigate },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(answerToCommentInCommentLoopFunc(id, content, courseId, parentId))

//         if (response) {
//             return response.data;
//         }

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//         }
//         navigate('/comments')
//         return rejectWithValue(error);
//     }
// );


// export const changeAcceptInCommentLoop = createAsyncThunk(
//     'comment/changeAcceptInCommentLoop',
//     async (
//         { id, accept },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(changeAcceptInCommentLoopFunc(id, accept));

//         if (response) {
//             return response.data;
//         }

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//         }

//         return rejectWithValue(error);
//     }
// );

// export const deleteCommentInCommentLoop = createAsyncThunk(
//     'comment/deleteCommentInCommentLoop',
//     async (
//         { id, mainCommentId, navigator },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(deleteCommentInCommentLoopFunc(id, mainCommentId));

//         if (response) {
//             if (!response.data?.data?.commentTree?.length) {
//                 navigator('/comments')
//             }
//             return response.data;
//         }

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//             navigator('/comments')
//         }

//         return rejectWithValue(error);
//     }
// );

// export const deleteLevel = createAsyncThunk(
//     'level/deleteLevel',
//     async (
//         { id },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(deleteLevelFunc(id));

//         console.log('responses---=====>', response);
//         if (response) {
//             toast.success(response?.data?.message);
//             return response.data;
//         }
//         console.log('errorrr=====>', error);

//         toast.error(error?.response?.data?.message);
//         return rejectWithValue(error);
//     }
// );

// export const updateLevel = createAsyncThunk(
//     'level/updateLevel',
//     async (
//         { id, name },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(updateLevelFunc(id, name));

//         if (response) {
//             toast.success(response?.data?.message);
//             return response.data;
//         }
//         console.log('errorrr=====>', error);

//         if (error?.response?.status === 401) {
//                         window.location.assign('/login');
//         } else {
//             toast.error(error?.response?.data?.message);
//         }
//         return rejectWithValue(error);
//     }
// );

// const setSearchWordAction = (state, action) => {
//     state.search = action.payload;
// }

// const setOffsetAction = (state, action) => {
//     state.offset = action.payload;
// }

// const setStatusAction = (state, action) => {
//     state.status = action.payload;
// }

// const setScoreAction = (state, action) => {
//     state.score = action.payload;
// }

// const setParentStatusAction = (state, action) => {
//     state.parentStatus = action.payload
// }

const consoleSlice = createSlice({
    name: "console",
    initialState: {
        chartData: [],
        unCompletedCourses: [],
        // status: '',
        // score: '',
        // search: '',
        // offset: 0,
        // limit: 10,
        // isLoading: false,
    },
    reducers: {
        // setSearch: setSearchWordAction,
        // setOffset: setOffsetAction,
        // setStatus: setStatusAction,
        // setScore: setScoreAction,
        // setParentStatus: setParentStatusAction
    },
    extraReducers: builder => {
        builder
            .addCase(getData.pending, state => {
                state.isLoading = true;
            })
            .addCase(getData.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log("data======================================>" , action.payload.data)
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
                console.log("unCompletedCourses======================================>" , action.payload.data)
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