import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { answerToCommentFunc, answerToCommentInCommentLoopFunc, changeAcceptFunc, changeAcceptInCommentLoopFunc, deleteCommentFunc, deleteCommentInCommentLoopFunc, getCommentsFunc, getCommentTreeFunc } from "../../services/comment.services";

export const getComments = createAsyncThunk(
    'comment/getComments',
    async (
        { limit, offset, search, score, status, parentStatus , userId},
        { rejectWithValue }
    ) => {
        const { response, error } = await getCommentsFunc(limit, offset, search, score, status, parentStatus , userId);

        if (response) {
            return response.data;
        }

        toast.error(error?.response?.data?.message);

        return rejectWithValue(error);
    }
);

export const changeAccept = createAsyncThunk(
    'comment/changeAcceptComments',
    async (
        { id, accept, limit, offset, search, score, status, parentStatus , userId },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(changeAcceptFunc(id, accept, limit, offset, search, score, status, parentStatus , userId));

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

export const deleteComment = createAsyncThunk(
    'comment/deleteComment',
    async (
        { id, limit, offset, search, score, status, parentStatus , userId },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteCommentFunc(id, limit, offset, search, score, status, parentStatus, userId));

        if (response) {
            toast.success(response?.data?.message);
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


export const getCommentTree = createAsyncThunk(
    'comment/getCommentTree',
    async (
        { id, navigate },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getCommentTreeFunc(id))

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
                        window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        navigate('/comments')
        return rejectWithValue(error);
    }
);

export const answerToComment = createAsyncThunk(
    'comment/answerToComment',
    async (
        { content, courseId, parentId, limit, offset, search, score, status, parentStatus, userId },
        { rejectWithValue }
    ) => {

        const { response, error } = await authRequest(answerToCommentFunc(content, courseId, parentId, limit, offset, search, score, status, parentStatus , userId))

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

export const answerToCommentInCommentLoop = createAsyncThunk(
    'comment/answerToCommentInCommentLoop',
    async (
        { id, content, courseId, parentId, navigate },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(answerToCommentInCommentLoopFunc(id, content, courseId, parentId))

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
                        window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        navigate('/comments')
        return rejectWithValue(error);
    }
);


export const changeAcceptInCommentLoop = createAsyncThunk(
    'comment/changeAcceptInCommentLoop',
    async (
        { id, accept },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(changeAcceptInCommentLoopFunc(id, accept));

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

export const deleteCommentInCommentLoop = createAsyncThunk(
    'comment/deleteCommentInCommentLoop',
    async (
        { id, mainCommentId, navigator },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteCommentInCommentLoopFunc(id, mainCommentId));

        if (response) {
            if (!response.data?.data?.commentTree?.length) {
                navigator('/comments')
            }
            return response.data;
        }

        if (error?.response?.status === 401) {
                        window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
            navigator('/comments')
        }

        return rejectWithValue(error);
    }
);

const setSearchWordAction = (state, action) => {
    state.search = action.payload;
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}

const setStatusAction = (state, action) => {
    state.status = action.payload;
}

const setScoreAction = (state, action) => {
    state.score = action.payload;
}

const setParentStatusAction = (state, action) => {
    state.parentStatus = action.payload
}

const commentSlice = createSlice({
    name: "comment",
    initialState: {
        comments: [],
        commentsCount: 0,
        commentTree: [],
        status: '',
        score: '',
        search: '',
        offset: 0,
        limit: 10,
        isLoading: false,
    },
    reducers: {
        setSearch: setSearchWordAction,
        setOffset: setOffsetAction,
        setStatus: setStatusAction,
        setScore: setScoreAction,
        setParentStatus: setParentStatusAction
    },
    extraReducers: builder => {
        builder
            .addCase(getComments.pending, state => {
                state.isLoading = true;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload?.data?.comments;
                state.commentsCount = action.payload?.data?.count;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(answerToComment.pending, state => {
                state.isLoading = true;
            })
            .addCase(answerToComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload?.data?.comments;
                state.commentsCount = action.payload?.data?.count;
            })
            .addCase(answerToComment.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(changeAccept.pending, state => {
                state.isLoading = true;
            })
            .addCase(changeAccept.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload?.data?.comments;
                state.commentsCount = action.payload?.data?.count;
            })
            .addCase(changeAccept.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteComment.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comments = action.payload?.data?.comments;
                state.commentsCount = action.payload?.data?.count;
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getCommentTree.pending, state => {
                state.isLoading = true;
            })
            .addCase(getCommentTree.fulfilled, (state, action) => {
                state.isLoading = false;
                state.commentTree = action.payload?.data?.commentTree;
            })
            .addCase(getCommentTree.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(changeAcceptInCommentLoop.pending, state => {
                state.isLoading = true;
            })
            .addCase(changeAcceptInCommentLoop.fulfilled, (state, action) => {
                state.isLoading = false;
                state.commentTree = action.payload?.data?.commentTree;
            })
            .addCase(changeAcceptInCommentLoop.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteCommentInCommentLoop.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteCommentInCommentLoop.fulfilled, (state, action) => {
                state.isLoading = false;
                state.commentTree = action.payload?.data?.commentTree;
            })
            .addCase(deleteCommentInCommentLoop.rejected, (state, action) => {
                state.isLoading = false;
            })

            
            .addCase(answerToCommentInCommentLoop.pending, state => {
                state.isLoading = true;
            })
            .addCase(answerToCommentInCommentLoop.fulfilled, (state, action) => {
                state.isLoading = false;
                state.commentTree = action.payload?.data?.commentTree;
            })
            .addCase(answerToCommentInCommentLoop.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});

export const { setSearch, setOffset, setStatus, setScore, setParentStatus } = commentSlice.actions;

export default commentSlice.reducer;