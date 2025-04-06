import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { uploadFileChunckFunc, deleteFileChunckFunc, createBookFunc,updateBookFunc, deleteBookWhitoutGettingAllFunc, getAllBooksFunc, deleteBookWithGettingAllFunc } from "../../services/book.service";

export const createBookCollection = createAsyncThunk(
    'book/createBook',
    async (
        { name, shortDescription, longDescription, cover, slug, links, tags, ageGrate, grate, files, navigator, setProgress },
        { rejectWithValue }
    ) => {
        setProgress(0)

        const { response, error } = await authRequest(createBookFunc(name, shortDescription, longDescription, slug, ageGrate, grate, tags, links, cover));

        if (response) {
            if (response.data.status === 201 && response.data.data.bookId) {
                const bookId = response.data.data.bookId;
                const chunkSize = 1 * 1024 * 1024; // 1MB (adjust based on your requirements)
                let allFilesSize = 0
                files.forEach(fileObj => allFilesSize += fileObj.file.size)
                const allFilesChunks = Math.ceil(allFilesSize / chunkSize)
                const chunkProgress = 100 / allFilesChunks;


                const uploadFileObject = async (fileObject) => {
                    const totalChunks = Math.ceil(fileObject.file.size / chunkSize);
                    let chunkNumber = 0;
                    let start = 0;
                    let end = 0;

                    const uploadNextChunk = async () => {
                        if (end <= fileObject.file.size) {
                            const chunk = fileObject.file.slice(start, end);


                            const { response, error } = await authRequest(uploadFileChunckFunc(chunk, chunkNumber, totalChunks, fileObject.fileName , fileObject.name , fileObject.fileType , fileObject.group, bookId))
                            if (response) {
                                // setProgress( prevValue => Number((chunkNumber + 1) * chunkProgress));
                                setProgress(prevValue => Math.ceil(prevValue + chunkProgress));
                                chunkNumber++;
                                start = end;
                                if(fileObject.file.size-end !==0 && fileObject.file.size-end < chunkSize){
                                    end = start + (fileObject.file.size - end)
                                }else{
                                    end = start + chunkSize;
                                }
                                await uploadNextChunk();
                            }
                            if (error) {
                                const fileName = files.map(fileObj => fileObj.fileName)
                                await authRequest(deleteFileChunckFunc(fileName))
                                await authRequest(deleteBookWhitoutGettingAllFunc(bookId))
                                setProgress(0)
                                fileLinksArray = [];
                                return false
                            }
                        } else {
                            setProgress(100);
                            // setSelectedFile(null);
                            navigator('/books-collection')
                            return true
                        }
                    }
                    await uploadNextChunk()
                }
                for (let index = 0; index < files.length; index++) {
                    await uploadFileObject(files[index])
                }
                setProgress(0)
                return;
            } else {
                toast.error(response.data.message)
                return response.data
            }
        }
        
        if (error?.response?.status === 401) {
                        window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);

    }
);

export const getBooks = createAsyncThunk(
    'book/getBooks',
    async (
        { limit , offset , search,tagId },
        { rejectWithValue }
    ) => {
        const { response, error } = await getAllBooksFunc(limit , offset , search, tagId)

        if (response) {
            console.log('books=========>' , response)
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const updateBookCollection = createAsyncThunk(
    'book/updateBook',
    async (
        { id, name, shortDescription, longDescription, cover, slug, links, tags, ageGrate, grate, newFiles, deletedFiles, navigator, setProgress},
        { rejectWithValue }
    ) => {
        setProgress(0)

        const { response, error } = await authRequest(updateBookFunc(id,name,shortDescription,longDescription,slug,ageGrate,grate,tags,links,cover));

        if (response) {
            if (response.data.status === 201 && response.data.data.bookId) {
                const bookId = response.data.data.bookId;
                const chunkSize = 1 * 1024 * 1024; // 1MB (adjust based on your requirements)
                let allFilesSize = 0
                newFiles.forEach(fileObj => allFilesSize += fileObj.file.size)
                const allFilesChunks = Math.ceil(allFilesSize / chunkSize)
                const chunkProgress = 100 / allFilesChunks;

                const uploadFileObject = async (fileObject) => {
                    const totalChunks = Math.ceil(fileObject.file.size / chunkSize);
                    let chunkNumber = 0;
                    let start = 0;
                    let end = 0;

                    const uploadNextChunk = async () => {
                        if (end <= fileObject.file.size) {
                            const chunk = fileObject.file.slice(start, end);


                            const { response, error } = await authRequest(uploadFileChunckFunc(chunk, chunkNumber, totalChunks, fileObject.fileName , fileObject.name , fileObject.fileType , fileObject.group, bookId))
                            if (response) {
                                // setProgress( prevValue => Number((chunkNumber + 1) * chunkProgress));
                                setProgress(prevValue => Math.ceil(prevValue + chunkProgress));
                                chunkNumber++;
                                start = end;
                                end = start + chunkSize;
                                await uploadNextChunk();
                            }
                            if (error) {
                                const fileName = newFiles.map(fileObj => fileObj.fileName)
                                await authRequest(deleteFileChunckFunc(fileName))
                                // await authRequest(deleteBookWhitoutGettingAllFunc(bookId))
                                return false
                            }
                        } else {
                            return true
                        }
                    }
                    await uploadNextChunk()
                }
                for (let index = 0; index < newFiles.length; index++) {
                    await uploadFileObject(newFiles[index])
                }
                // setSelectedFile(null);
                await authRequest(deleteFileChunckFunc(deletedFiles))
                toast.success("مجموعه با موفقت ویرایش شد.")
                setProgress(100)
                navigator('/books-collection')
                return;
            } else {
                toast.error(response.data.message)
                return response.data
            }
        }
        
        if (error?.response?.status === 401) {
                        window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);

    }
);

export const deleteBook = createAsyncThunk(
    'book/deleteBooks',
    async (
        {id, limit , offset , search , tagId},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteBookWithGettingAllFunc(id ,limit , offset , search, tagId))

        if (response) {
            console.log('books=========>' , response)
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

// export const updateArticle = createAsyncThunk(
//     'article/updateArticle',
//     async (
//         {id, title , shortDescription , longDescription , cover , slug , isPublished , links , tags  , navigator},
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(updateArticleFunc(id ,title , shortDescription , longDescription , cover , slug , isPublished , links , tags));

//         if (response) {
//             toast.success(response?.data?.message);
//             navigator('/articles')
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

// export const deleteArticle = createAsyncThunk(
//     'article/deleteArticle',
//     async (
//         { id , limit , offset , search, status , writerId},
//         { rejectWithValue }
//     ) => {
//         const { response, error } = await authRequest(deleteArticleFunc(id , limit , offset , search, status , writerId));

//         if (response) {
//             toast.success(response?.data?.message);
//             return response.data;
//         }

//         toast.error(error?.response?.data?.message);
//         return rejectWithValue(error);
//     }
// );

const setSearchWordAction = (state, action) => {
    state.search = action.payload;
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}

const setTeacherIdAction = (state, action) => {
    state.teacherId = action.payload;
}

const articleSlice = createSlice({
    name: "book",
    initialState: {
        books: [],
        booksCount: 0,
        search: "",
        teacherId: '',
        offset: 0,
        limit: 10,
        isLoading: false,
    },
    reducers: {
        setSearch: setSearchWordAction,
        setOffset: setOffsetAction,
        setTeacherId: setTeacherIdAction
    },
    extraReducers: builder => {
        builder
            .addCase(createBookCollection.pending, state => {
                state.isLoading = true;
            })
            .addCase(createBookCollection.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.tags = action.payload?.data?.tags;
                // state.tagsCount = action.payload?.data?.count;
            })
            .addCase(createBookCollection.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getBooks.pending, state => {
                state.isLoading = true;
            })
            .addCase(getBooks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books = action.payload?.data?.books;
                state.booksCount = action.payload?.data?.count;
            })
            .addCase(getBooks.rejected, (state, action) => {
                state.isLoading = false;
            })



            .addCase(deleteBook.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.isLoading = false;
                state.books = action.payload?.data?.books;
                state.booksCount = action.payload?.data?.count;
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.isLoading = false;
            })


                .addCase(updateBookCollection.pending, state => {
                    state.isLoading = true;
                })
                .addCase(updateBookCollection.fulfilled, (state, action) => {
                    state.isLoading = false;
                })
                .addCase(updateBookCollection.rejected, (state, action) => {
                    state.isLoading = false;
                })
    },
});

export const { setSearch, setOffset, setTeacherId } = articleSlice.actions;

export default articleSlice.reducer;