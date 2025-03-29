import { appJsonPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const createCommentsFunc = ({ content, score, courseId, parentId }) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post(`/comment`, { content, score, courseId, parentId });
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getCommentsFunc = async (limit, offset, search = '', score, status, parentStatus, userId) => {
    try {
        let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
        score && (queryString += `&score=${score}`)
        status && (queryString += `&status=${status}`)
        parentStatus && (queryString += `&parentStatus=${parentStatus}`)
        userId && (queryString += `&userId=${userId}`)

        const response = await appJsonPostApi.get(`/comment${queryString}`, { withCredentials: false });
        return { response };
    } catch (error) {
        return { error };
    }
}

const changeAcceptFunc = (id, accept, limit, offset, search = '', score, status, parentStatus , userId) => {
    return (
        async () => {
            try {
                let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
                score && (queryString += `&score=${score}`)
                status && (queryString += `&status=${status}`)
                parentStatus && (queryString += `&parentStatus=${parentStatus}`)
                userId && (queryString += `&userId=${userId}`)

                const response = await apiPrivate(appJsonPostApi).put(`/comment/${id}${queryString}`, { accept });
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const deleteCommentFunc = (id, limit, offset, search = '', score, status, parentStatus, userId) => {
    return (
        async () => {
            try {
                let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
                score && (queryString += `&score=${score}`)
                status && (queryString += `&status=${status}`)
                parentStatus && (queryString += `&parentStatus=${parentStatus}`)
                userId && (queryString += `&userId=${userId}`)

                const response = await apiPrivate(appJsonPostApi).delete(`/comment/${id}${queryString}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getCommentTreeFunc = (id) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/comment/${id}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const changeAcceptInCommentLoopFunc = (id, accept) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).put(`/comment/comment-loop/${id}`, { accept });
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteCommentInCommentLoopFunc = (id, mainCommentId) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/comment/comment-loop/${id}?mainCommentId=${mainCommentId}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const answerToCommentFunc = ( content, courseId, parentId,   limit, offset, search = '', score, status, parentStatus , userId) => {
    return (
        async () => {
            try {
                let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
                score && (queryString += `&score=${score}`)
                status && (queryString += `&status=${status}`)
                parentStatus && (queryString += `&parentStatus=${parentStatus}`)
                userId && (queryString += `&userId=${userId}`)


                const response = await apiPrivate(appJsonPostApi).post(`/comment/answer${queryString}`, { content, courseId, parentId });
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const answerToCommentInCommentLoopFunc = (id, content, courseId, parentId) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post(`/comment/comment-loop/answer/${id}`, { content, courseId, parentId });
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


export {
    createCommentsFunc,
    getCommentsFunc,
    changeAcceptFunc,
    deleteCommentFunc,
    getCommentTreeFunc,
    changeAcceptInCommentLoopFunc,
    deleteCommentInCommentLoopFunc,
    answerToCommentFunc,
    answerToCommentInCommentLoopFunc
}