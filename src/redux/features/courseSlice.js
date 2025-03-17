import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { createNewCourseFunc, deleteVideoFunc, getBookGroupsFunc, getCreatingDataFunc, uploadIntroductionVideoChunckFunc, updateCourseFunc, getCoursesFunc, deleteCoursesFunc, updateIntroductionVideoFunc, updateStatusfunc, getShortDetailCoursesFunc } from "../../services/course.services";

export const createNewCourse = createAsyncThunk(
    'course/createNewCourse',
    async (
        { name, shortDescription, longDescription, cover, video, videoName, price, slug, bookFileGroup, bookCollectionId, teacher, levelId, tags, setProgress, navigator },
        { rejectWithValue }
    ) => {
        setProgress(0)

        const chunkSize = 1 * 1024 * 1024; // 1MB (adjust based on your requirements)
        const totalChunks = Math.ceil(video.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;

        let videoLink = ''
        let resultError = null;

        const uploadNextChunk = async () => {
            if (end <= video.size) {
                const chunk = video.slice(start, end);

                const { response, error } = await authRequest(uploadIntroductionVideoChunckFunc(chunk, chunkNumber, totalChunks, videoName))

                if (response && response.data.status === 200) {
                    videoLink = response.data.data.link;
                    setProgress(Number((chunkNumber + 1) * chunkProgress));
                    chunkNumber++;
                    start = end;
                    if (video.size - end !== 0 && video.size - end < chunkSize) {
                        end = start + (video.size - end)
                    } else {
                        end = start + chunkSize;
                    }
                    await uploadNextChunk();
                } else if (error?.response?.status === 401) {
                    localStorage.setItem('isLoggin', false);
                    resultError = error
                } else {
                    toast.error(error?.response?.data?.message);
                    resultError = error
                }
            } else {
                const { response, error } = await authRequest(createNewCourseFunc(name, shortDescription, longDescription, cover, videoLink, price, slug, bookFileGroup, bookCollectionId, teacher, levelId, tags));
                if (response) {
                    setProgress(100);
                    return navigator('/courses')
                }
                await authRequest(deleteVideoFunc(videoLink?.split('/')?.reverse()[0]))
                if (error?.response?.status === 401) {
                    localStorage.setItem('isLoggin', false);
                }
                toast.error(error?.response?.data?.message);
                resultError = error
            }
        };

        await uploadNextChunk();
        setProgress(0)
        if (resultError) {
            return rejectWithValue(error);
        }
    }
);

export const getCourses = createAsyncThunk(
    'course/getCourses',
    async (
        { limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus },
        { rejectWithValue }
    ) => {
        const { response, error } = await getCoursesFunc(limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus)

        if (response) {
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const deleteCourse = createAsyncThunk(
    'course/deleteCourse',
    async (
        { id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteCoursesFunc(id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus))

        if (response) {
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

export const getShortDetailCourses = createAsyncThunk(
    'course/getShortDetailCourses',
    async (
        {setCourses},
        { rejectWithValue }
    ) => {
        const { response, error } = await getShortDetailCoursesFunc();

        if (response) {
            setCourses(response.data.data?.courses)
            return;
        }

        toast.error(error?.response?.data ? error?.response?.data.message : "مشکل در دریافت لیست دوره ها");
        
        return rejectWithValue(error);
    }
);

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


export const getBookGroups = createAsyncThunk(
    'course/getBookGroups',
    async (
        { id },
        { rejectWithValue }
    ) => {
        const { response, error } = await getBookGroupsFunc(id)

        if (response) {
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const getCreatingData = createAsyncThunk(
    'course/getCreatingData',
    async (
        { },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getCreatingDataFunc())

        if (response) {
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


export const updateCourse = createAsyncThunk(
    'course/updateCourse',
    async (
        { id, name, shortDescription, longDescription, cover, price, slug, bookFileGroup, bookCollectionId, teacher, levelId, tags, video, navigator },
        { rejectWithValue }
    ) => {

        const { response, error } = await authRequest(updateCourseFunc(id, name, shortDescription, longDescription, cover, price, slug, bookFileGroup, bookCollectionId, teacher, levelId, tags, video));
        if (response) {
            return navigator('/courses')
        }
        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const updateVideo = createAsyncThunk(
    'course/updateVideo',
    async (
        { id, video, filename, prevLink, setProgress, setVideo, navigator },
        { rejectWithValue }
    ) => {

        const chunkSize = 1 * 1024 * 1024; // 5MB (adjust based on your requirements)
        const totalChunks = Math.ceil(video.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;
        let newVideoLink = ''

        const uploadNextChunk = async () => {
            if (end <= video.size) {
                const chunk = video.slice(start, end);

                const { response, error } = await authRequest(updateIntroductionVideoFunc(id, chunk, chunkNumber, totalChunks, filename, prevLink))

                if (response) {
                    newVideoLink = response.data?.data?.link;
                    console.log(newVideoLink);
                    const temp = `Chunk ${chunkNumber + 1
                        }/${totalChunks} uploaded successfully`;
                    setProgress(Number((chunkNumber + 1) * chunkProgress));
                    console.log(temp);
                    chunkNumber++;
                    start = end;
                    if (video.size - end !== 0 && video.size - end < chunkSize) {
                        end = start + (video.size - end)
                    } else {
                        end = start + chunkSize;
                    }
                    return uploadNextChunk();
                }

                if (error?.response?.status === 401) {
                    localStorage.setItem('isLoggin', false);
                } else {
                    toast.error(error?.response?.data?.message);
                }
                return rejectWithValue(error);
            } else {
                setProgress(0);
                setVideo(newVideoLink)
            }
        };

        uploadNextChunk();
    }
);

export const changeStatus = createAsyncThunk(
    'course/changeStatusCourse',
    async (
        { id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus },
        { rejectWithValue }
    ) => {

        const {response , error} = await authRequest(updateStatusfunc(id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus))

        if(response){
            return response.data;
        }

        console.log('error====>', error)
        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
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

const setTeacherIdAction = (state, action) => {
    state.teacherId = action.payload;
}

const setBookIdAction = (state, action) => {
    state.bookId = action.payload;
}

const setLevelIdAction = (state, action) => {
    state.levelId = action.payload;
}

const setPriceStatusAction = (state, action) => {
    state.priceStatus = action.payload;
}

const setScoreStatusAction = (state, action) => {
    state.scoreStatus = action.payload;
}

const courseSlice = createSlice({
    name: "course",
    initialState: {
        courses: [],
        coursesCount: 0,
        bookCollections: [],
        bookGroups: [],
        teachers: [],
        levels: [],
        search: "",
        status: '',
        teacherId: '',
        bookId: '',
        levelId: '',
        priceStatus: '',
        scoreStatus: '',
        offset: 0,
        limit: 10,
        isLoading: false,
    },
    reducers: {
        setSearch: setSearchWordAction,
        setOffset: setOffsetAction,
        setStatus: setStatusAction,
        setTeacherId: setTeacherIdAction,
        setBookId: setBookIdAction,
        setLevelId: setLevelIdAction,
        setPriceStatus: setPriceStatusAction,
        setScoreStatus: setScoreStatusAction
    },
    extraReducers: builder => {
        builder
            .addCase(createNewCourse.pending, state => {
                state.isLoading = true;
            })
            .addCase(createNewCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.tags = action.payload?.data?.tags;
                // state.tagsCount = action.payload?.data?.count;
            })
            .addCase(createNewCourse.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getCourses.pending, state => {
                state.isLoading = true;
            })
            .addCase(getCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload?.data?.courses;
                state.coursesCount = action.payload?.data?.count;
            })
            .addCase(getCourses.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getBookGroups.pending, state => {
                state.isLoading = true;
            })
            .addCase(getBookGroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookGroups = action.payload?.data?.groups;
            })
            .addCase(getBookGroups.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getCreatingData.pending, state => {
                state.isLoading = true;
            })
            .addCase(getCreatingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.teachers = action.payload?.data?.teachers;
                state.levels = action.payload?.data?.levels;
                state.bookCollections = action.payload?.data?.books;
            })
            .addCase(getCreatingData.rejected, (state, action) => {
                state.isLoading = false;
            })



            .addCase(deleteCourse.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload?.data?.courses;
                state.coursesCount = action.payload?.data?.count;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(updateVideo.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateVideo.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateVideo.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(changeStatus.pending, state => {
                state.isLoading = true;
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = action.payload?.data?.courses;
                state.coursesCount = action.payload?.data?.count;
            })
            .addCase(changeStatus.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});

export const { setSearch, setOffset, setStatus, setTeacherId, setBookId, setLevelId, setPriceStatus, setScoreStatus } = courseSlice.actions;

export default courseSlice.reducer;