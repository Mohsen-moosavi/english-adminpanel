import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { createArticleFunc } from "../../services/article.services";

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


// export const getTags = createAsyncThunk(
//     'tag/getTags',
//     async (
//         { limit , offset , search},
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await getTagsFunc(limit , offset , search)

//         if (response) {
//             return response.data;
//         }

//         toast.error(error?.response?.data?.message);
//         return rejectWithValue(error);
//     }
// );

// export const deleteTag = createAsyncThunk(
//     'tag/deleteTag',
//     async (
//         { id , limit , offset , search },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(deleteTagFunc(id , limit , offset , search));

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

// export const updateTag = createAsyncThunk(
//     'tag/updateTag',
//     async (
//         { id , name , limit , offset , search },
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(updateTagFunc(id ,name, limit , offset , search ));

//         if (response) {
//             toast.success(response?.data?.message);
//             return response.data;
//         }
//         console.log('errorrr=====>', error);

//         if (error?.response?.status === 401) {
//             localStorage.setItem('isLoggin', false);
//         } else {
//             toast.error(error?.response?.data?.message);
//         }
//         return rejectWithValue(error);
//     }
// );

// const setSearchWordAction = (state , action) =>{
//     state.search = action.payload;
// }

// const setOffsetAction = (state , action) =>{
//     state.offset = action.payload;
// }

const articleSlice = createSlice({
    name: "article",
    initialState: {
        articles: [],
        articlesCount : 0,
        search : "",
        offset : 0,
        limit :10,
        isLoading: false,
    },
    // reducers : {
    //     setSearch : setSearchWordAction,
    //     setOffset : setOffsetAction
    // },
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


    //         .addCase(getTags.pending, state => {
    //             state.isLoading = true;
    //         })
    //         .addCase(getTags.fulfilled, (state, action) => {
    //             state.isLoading = false;
    //             state.tags = action.payload?.data?.tags;
    //             state.tagsCount = action.payload?.data?.count;
    //         })
    //         .addCase(getTags.rejected, (state, action) => {
    //             state.isLoading = false;
    //         })


    //         .addCase(deleteTag.pending, state => {
    //             state.isLoading = true;
    //         })
    //         .addCase(deleteTag.fulfilled, (state, action) => {
    //             state.isLoading = false;
    //             state.tags = action.payload?.data?.tags;
    //             state.tagsCount = action.payload?.data?.count;
    //         })
    //         .addCase(deleteTag.rejected, (state, action) => {
    //             state.isLoading = false;
    //         })


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

// export const { setSearch , setOffset } = tagSlice.actions;

export default articleSlice.reducer;