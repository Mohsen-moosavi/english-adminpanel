import { appJsonPostApi, multipartFormPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const uploadSessionVideoFunc = (chunk, chunkNumber, totalChunks, fileName, courseId, time) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("video", chunk);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("fileName", fileName);
                formData.append("courseId", courseId);
                formData.append("time", time);

                const response = await apiPrivate(multipartFormPostApi).post('/session/upload-video', formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateSessionVideoFunc = (chunk, chunkNumber, totalChunks, fileName, sessionId, time) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("video", chunk);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("fileName", fileName);
                formData.append("sessionId", sessionId);
                formData.append("time", time);

                const response = await apiPrivate(multipartFormPostApi).post('/session/update-video', formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const uploadSessionDetailsFunc = (chunk, chunkNumber, totalChunks, fileName, sessionId, name, isFree) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("file", chunk);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("fileName", fileName);
                formData.append("sessionId", sessionId);
                formData.append("isFree", isFree);
                formData.append("name", name);

                const response = await apiPrivate(multipartFormPostApi).post('/session', formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const uploadSessionDetailsWithoutFileFunc = (sessionId, name, isFree) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post('/session/without-file', { sessionId, name, isFree });
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getSessionsFunc = async (id, limit, offset, search = '', status, fileStatus) => {
    try {
        let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
        status && (queryString += `&status=${status}`)
        fileStatus && (queryString += `&fileStatus=${fileStatus}`)

        const response = await appJsonPostApi.get(`/session/${id}${queryString}`, { withCredentials: false });
        return { response };
    } catch (error) {
        return { error };
    }
}

const deleteSessionFunc = (id,courseId, limit, offset, search = '', status, fileStatus) => {
    return (
        async () => {
            try {
                let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
                status && (queryString += `&status=${status}`)
                fileStatus && (queryString += `&fileStatus=${fileStatus}`)
        
                const response = await apiPrivate(appJsonPostApi).delete(`/session/${id}/${courseId}${queryString}`,);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const getSingleSessionFunc = (id) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/session/single/${id}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    uploadSessionVideoFunc,
    uploadSessionDetailsFunc,
    uploadSessionDetailsWithoutFileFunc,
    getSessionsFunc,
    getSingleSessionFunc,
    updateSessionVideoFunc,
    deleteSessionFunc
}