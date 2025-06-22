import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { deleteSessionFunc, getSessionsFunc, getSingleSessionFunc, updateSessionVideoFunc, uploadSessionDetailsFunc, uploadSessionDetailsWithoutFileFunc, uploadSessionVideoFunc } from "../../services/session.services";

export const uploadVideo = createAsyncThunk(
    'session/uploadSessionVideo',
    async (
        { video, videoName, courseId, time, setProgress, setVideo, setVideoDetails },
        { rejectWithValue }
    ) => {
        setProgress(0)

        const chunkSize = 1 * 1024 * 1024; // 1MB (adjust based on your requirements)
        const totalChunks = Math.ceil(video.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;

        let videoDetails = null;

        let resultError = null;

        const uploadNextChunk = async () => {
            if (end <= video.size) {
                const chunk = video.slice(start, end);

                const { response, error } = await authRequest(uploadSessionVideoFunc(chunk, chunkNumber, totalChunks, videoName, courseId, time))


                if (response && response.data.status === 200) {
                    videoDetails = response.data.data?.session;
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
                                window.location.assign('/login');
                    resultError = error
                } else {
                    toast.error(error?.response?.data?.message);
                    resultError = error
                }
            } else {
                setProgress(0);
                setVideo(videoDetails?.video)
                setVideoDetails(videoDetails)
            }
        };

        await uploadNextChunk();
        setProgress(0)
        if (resultError) {
            return rejectWithValue(error);
        }
    }

);

export const updateVideo = createAsyncThunk(
    'session/updateSessionVideo',
    async (
        { video, videoName, sessionId, time, setProgress, setVideo, setVideoDetails },
        { rejectWithValue }
    ) => {
        setProgress(0)

        const chunkSize = 1 * 1024 * 1024; // 1MB (adjust based on your requirements)
        const totalChunks = Math.ceil(video.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;

        let videoDetails = null;

        let resultError = null;

        const uploadNextChunk = async () => {
            if (end <= video.size) {
                const chunk = video.slice(start, end);

                const { response, error } = await authRequest(updateSessionVideoFunc(chunk, chunkNumber, totalChunks, videoName, sessionId, time))


                if (response && response.data.status === 200) {
                    videoDetails = response.data.data?.session;
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
                                window.location.assign('/login');
                    resultError = error
                } else {
                    toast.error(error?.response?.data?.message);
                    resultError = error
                }
            } else {
                setProgress(0);
                setVideo(videoDetails?.video)
                setVideoDetails(videoDetails)
            }
        };

        await uploadNextChunk();
        setProgress(0)
        if (resultError) {
            return rejectWithValue(error);
        }
    }

);

export const updateDetails = createAsyncThunk(
    'session/updateSessionDetails',
    async (
        { file, fileName, sessionId, name, isFree, setProgress, setSessionDetails, setChooseNewFile },
        { rejectWithValue }
    ) => {
        setProgress(0)

        const chunkSize = 1 * 1024 * 1024; // 1MB (adjust based on your requirements)
        const totalChunks = Math.ceil(file.size / chunkSize);
        const chunkProgress = 100 / totalChunks;
        let chunkNumber = 0;
        let start = 0;
        let end = 0;

        let sessionDetails = null;

        let resultError = null;

        const uploadNextChunk = async () => {
            if (end <= file.size) {
                const chunk = file.slice(start, end);

                const { response, error } = await authRequest(uploadSessionDetailsFunc(chunk, chunkNumber, totalChunks, fileName, sessionId, name, isFree))


                if (response && response.data.status === 200) {
                    sessionDetails = response.data.data?.session;
                    setProgress(Number((chunkNumber + 1) * chunkProgress));
                    chunkNumber++;
                    start = end;
                    if (file.size - end !== 0 && file.size - end < chunkSize) {
                        end = start + (file.size - end)
                    } else {
                        end = start + chunkSize;
                    }
                    await uploadNextChunk();
                } else if (error?.response?.status === 401) {
                                window.location.assign('/login');
                    resultError = error
                } else {
                    toast.error(error?.response?.data?.message);
                    resultError = error
                }
            } else {
                setProgress(0);
                setChooseNewFile(false)
                setSessionDetails(sessionDetails)
                toast.success("اطلاعات با موفقیت ویرایش شد.")
            }
        };

        await uploadNextChunk();
        if (resultError) {
            setProgress(0)
            return rejectWithValue(error);
        }
    }

);

export const updateDetailsWithoutFile = createAsyncThunk(
    'session/updateSessionDetailsWithoutFile',
    async (
        { sessionId, name, isFree, setSessionDetails },
        { rejectWithValue }
    ) => {

        const { response, error } = await authRequest(uploadSessionDetailsWithoutFileFunc(sessionId, name, isFree))

        if (response) {
            setSessionDetails(response.data.data?.session)
            toast.success(response?.data?.message)
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

export const getSessions = createAsyncThunk(
    'session/getSessions',
    async (
        { id, limit, offset, search, status, fileStatus },
        { rejectWithValue }
    ) => {

        const { response, error } = await getSessionsFunc(id, limit, offset, search, status, fileStatus)

        if (response) {
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const deleteSession = createAsyncThunk(
    'session/deleteSession',
    async (
        { id, courseId, limit, offset, search, status, fileStatus },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteSessionFunc(id, courseId, limit, offset, search, status, fileStatus))

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

export const getSingleSession = createAsyncThunk(
    'session/getSingleSession',
    async (
        { id, setVideo, setVideoDetails },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getSingleSessionFunc(id))

        if (response) {
            setVideoDetails(response.data.data.session)
            setVideo(response.data.data.session?.video)
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

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}

const setStatusAction = (state, action) => {
    state.status = action.payload;
}

const setFileStatusAction = (state, action) => {
    state.fileStatus = action.payload;
}

const sessionSlice = createSlice({
    name: "session",
    initialState: {
        sessions: [],
        sessionsCount: 0,
        status: '',
        fileStatus: '',
        search: '',
        offset: 0,
        limit: 10,
        isLoading: false,
    },
    reducers: {
        setSearch: setSearchWordAction,
        setOffset: setOffsetAction,
        setStatus: setStatusAction,
        setFileStatus: setFileStatusAction
    },
    extraReducers: builder => {
        builder
            .addCase(updateDetails.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.comments = action.payload?.data?.comments;
                // state.commentsCount = action.payload?.data?.count;
            })
            .addCase(updateDetails.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(uploadVideo.pending, state => {
                state.isLoading = true;
            })
            .addCase(uploadVideo.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.comments = action.payload?.data?.comments;
                // state.commentsCount = action.payload?.data?.count;
            })
            .addCase(uploadVideo.rejected, (state, action) => {
                state.isLoading = false;
            })

            .addCase(updateVideo.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateVideo.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.comments = action.payload?.data?.comments;
                // state.commentsCount = action.payload?.data?.count;
            })
            .addCase(updateVideo.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getSessions.pending, state => {
                state.isLoading = true;
            })
            .addCase(getSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = action.payload?.data?.sessions;
                state.sessionsCount = action.payload?.data?.count;
            })
            .addCase(getSessions.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteSession.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sessions = action.payload?.data?.sessions;
                state.sessionsCount = action.payload?.data?.count;
            })
            .addCase(deleteSession.rejected, (state, action) => {
                state.isLoading = false;
            })

    },
});

export const { setSearch, setOffset, setStatus, setFileStatus } = sessionSlice.actions;

export default sessionSlice.reducer;