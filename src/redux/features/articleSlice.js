import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { createArticleFunc, getArticlesFunc, updateArticleFunc, deleteArticleFunc } from "../../services/article.services";

export const createArticle = createAsyncThunk(
    'article/createArticle',
    async (
        { title , shortDescription , longDescription , cover , slug , isPublished , links , tags  , navigator},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(createArticleFunc(title , shortDescription , longDescription , cover , slug , isPublished , links , tags));

        if (response) {
            toast.success(response?.data?.message);
            navigator('/articles')
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const getArticles = createAsyncThunk(
    'article/getArticles',
    async (
        { limit , offset , search ,status , writerId},
        { rejectWithValue }
    ) => {
        const { response, error } = await getArticlesFunc(limit , offset , search, status , writerId)

        if (response) {
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const updateArticle = createAsyncThunk(
    'article/updateArticle',
    async (
        {id, title , shortDescription , longDescription , cover , slug , isPublished , links , tags  , navigator},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(updateArticleFunc(id ,title , shortDescription , longDescription , cover , slug , isPublished , links , tags));

        if (response) {
            toast.success(response?.data?.message);
            navigator('/articles')
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const deleteArticle = createAsyncThunk(
    'article/deleteArticle',
    async (
        { id , limit , offset , search, status , writerId},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteArticleFunc(id , limit , offset , search, status , writerId));

        if (response) {
            toast.success(response?.data?.message);
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

const setSearchWordAction = (state , action) =>{
    state.search = action.payload;
}

const setOffsetAction = (state , action) =>{
    state.offset = action.payload;
}

const setStatusAction = (state , action) =>{
    state.status = action.payload;
}

const articleSlice = createSlice({
    name: "article",
    initialState: {
        articles: [],
        articlesCount : 0,
        search : "",
        status : '' ,
        writerId : '',
        offset : 0,
        limit :10,
        isLoading: false,
    },
    reducers : {
        setSearch : setSearchWordAction,
        setOffset : setOffsetAction,
        setStatus : setStatusAction
    },
    extraReducers: builder => {
        builder
            .addCase(createArticle.pending, state => {
                state.isLoading = true;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.tags = action.payload?.data?.tags;
                // state.tagsCount = action.payload?.data?.count;
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getArticles.pending, state => {
                state.isLoading = true;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles = action.payload?.data?.articles;
                state.articlesCount = action.payload?.data?.count;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false;
            })



            .addCase(deleteArticle.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles = action.payload?.data?.articles;
                state.articlesCount = action.payload?.data?.count;
            })
            .addCase(deleteArticle.rejected, (state, action) => {
                state.isLoading = false;
            })


    //         .addCase(updateTag.pending, state => {
    //             state.isLoading = true;
    //         })
    //         .addCase(updateTag.fulfilled, (state, action) => {
    //             state.isLoading = false;
    //             state.tags = action.payload?.data?.tags;
    //             state.count = action.payload?.data?.count;
    //         })
    //         .addCase(updateTag.rejected, (state, action) => {
    //             state.isLoading = false;
    //         })
    },
});

export const { setSearch , setOffset , setStatus } = articleSlice.actions;

export default articleSlice.reducer;