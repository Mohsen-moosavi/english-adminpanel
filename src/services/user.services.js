import { appJsonPostApi } from "../configs/axios"
import apiPrivate from "./apiPrivate"

const getUsersFunc = (searchName='' , searchPhone='', roleStatus, purchaseStatus , scoreStatus , levelStatus, deletedUser,scorePriority, limit , offset) => {
    return (
        async () => {
            try {
                let queryString = `?limit=${limit}&offset=${offset}`
                searchName && (queryString += `&searchName=${searchName}`)
                searchPhone && (queryString += `&searchPhone=${searchPhone}`)
                roleStatus && (queryString += `&roleStatus=${roleStatus}`)
                purchaseStatus && (queryString += `&purchaseStatus=${purchaseStatus}`)
                scoreStatus && (queryString += `&scoreStatus=${scoreStatus}`)
                levelStatus && (queryString += `&levelStatus=${levelStatus}`)
                !!deletedUser && (queryString += `&deletedUser=${deletedUser}`)
                !!scorePriority && (queryString += `&scorePriority=${scorePriority}`)

                console.log('params====>',{searchName , searchPhone, roleStatus, purchaseStatus , scoreStatus , levelStatus, deletedUser,scorePriority, limit , offset})

                const response = await apiPrivate(appJsonPostApi).get(`/user/${queryString}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getFinderParamsFunc = () => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/user/get-finders`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getUserDetailsFunc = (id) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/user/${id}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    getUsersFunc,
    getFinderParamsFunc,
    getUserDetailsFunc
}