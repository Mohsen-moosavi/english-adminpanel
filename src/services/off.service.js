import { appJsonPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const createOffFunc = (percent, expire, times, isPublic, courses, code, isForAllCourses) => {
    return (
        async () => {
            try {

                const dataObj = { percent, expire, public: isPublic }
                times && (dataObj.times = times);

                isForAllCourses ? (dataObj.isForAllCourses = true) : (dataObj.isForAllCourses = false)

                isForAllCourses ? (dataObj.courses = []) : (courses && (dataObj.courses = courses));
                code && (dataObj.code = code);

                const response = await apiPrivate(appJsonPostApi).post('/off', dataObj);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getOffsFunc = (limit, offset, search = '', orderStatus, publicStatus) => {
    return (
        async () => {
            try {
                let queryString = `limit=${limit}&offset=${offset}&search=${search}`
                orderStatus && (queryString += `&orderStatus=${orderStatus}`)
                publicStatus && (queryString += `&publicStatus=${publicStatus}`)

                const response = await apiPrivate(appJsonPostApi).get(`/off?${queryString}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteOffFunc = (id,limit, offset, search = '', orderStatus, publicStatus) => {
    return (
        async () => {
            try {
                let queryString = `limit=${limit}&offset=${offset}&search=${search}`
                orderStatus && (queryString += `&orderStatus=${orderStatus}`)
                publicStatus && (queryString += `&publicStatus=${publicStatus}`)

                const response = await apiPrivate(appJsonPostApi).delete(`/off/${id}?${queryString}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    createOffFunc,
    getOffsFunc,
    deleteOffFunc
}