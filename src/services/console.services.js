import { appJsonPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const getDataFunc = () => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/console/get-data`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getUncompletedCoursesFunc = () => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/console/course-data`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


export {
    getDataFunc,
    getUncompletedCoursesFunc
}