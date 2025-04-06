import { appJsonPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const createTagFunc= (name,limit, offset) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post(`/tag?limit=${limit}&offset=${offset}` , {name});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getTagsFunc= async (limit , offset , search='') => {
    try {
        const response = await appJsonPostApi.get(`/tag?limit=${limit}&offset=${offset}&search=${search}` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

const deleteTagFunc= (id, limit, offset, search) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/tag/${id}?limit=${limit}&offset=${offset}&search=${search}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateTagFunc= (id, name, limit, offset, search) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).put(`/tag/${id}?limit=${limit}&offset=${offset}&search=${search}` ,{name});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    createTagFunc,
    getTagsFunc,
    deleteTagFunc,
    updateTagFunc
}