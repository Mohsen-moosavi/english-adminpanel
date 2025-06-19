import { appJsonPostApi, multipartFormPostApi } from "../configs/axios"
import apiPrivate from "./apiPrivate"

const getUsersFunc = (searchName='' , searchPhone='', roleStatus, purchaseStatus , scoreStatus , levelStatus, deletedUser,scorePriority,banStatus, limit , offset) => {
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
                banStatus && (queryString += `&banStatus=${banStatus}`)
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

const getRolesFunc = () => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/role`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const changeUserRoleFunc = (userId, roleId) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).put(`/user/change-role` , {userId, roleId});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const banUserFunc = (userId , isBan,description) => {
    return (
        async () => {
            try {
                const reqBody = {isBan};
                (isBan) && (reqBody.description = description) 
                const response = await apiPrivate(appJsonPostApi).put(`/user/ban/${userId}`,reqBody);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const removeUserProfileFunc = (userId) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/user/${userId}/delete-profile`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const resetPasswordFunc = (phone) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).put(`/auth/reset-pass`,{phone});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateProfileAvatarFunc= (userId , avatar) => {
    return (
        async () => {
            try {
                const formData = new FormData()
                formData.append('avatar' , avatar)

                const response = await apiPrivate(multipartFormPostApi).put(`/user/${userId}/update-profile` , formData);
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
    getUserDetailsFunc,
    getRolesFunc,
    changeUserRoleFunc,
    removeUserProfileFunc,
    updateProfileAvatarFunc,
    banUserFunc,
    resetPasswordFunc
}