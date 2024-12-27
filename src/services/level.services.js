import { appJsonPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const createLevel= (name) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post('/level' , {name});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getLevelsFunc= async () => {
    try {
        const response = await appJsonPostApi.get('/level' , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

const deleteLevelFunc= (id) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/level/${id}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateLevelFunc = (id ,name) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).put(`/level/${id}` , {name});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    createLevel,
    getLevelsFunc,
    deleteLevelFunc,
    updateLevelFunc
}