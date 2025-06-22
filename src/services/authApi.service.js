import memoizee from "memoizee"
import { appJsonPostApi } from "../configs/axios"
import { getCookie } from "../utils/cookie"
import apiPrivate from "./apiPrivate"


const getUserInfo = () => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get('/auth/get-me');
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const sendRefreshTokenRequest = async () => {
    try {
        const response = await appJsonPostApi.post('/auth/refresh-token')
        return true
    } catch (error) {
        window.location.assign('/login')
    }
}

const refreshToken = memoizee(
    sendRefreshTokenRequest,
    {
        promise: true,
        maxAge: 5_000
    }
)

const authRequest = async (request) => {
    const expireTime = getCookie('expireTime');
    const isExpired = (expireTime > Date.now()) ? false : true


    if (isExpired) {
        const isRefreshed = await refreshToken();
        if (isRefreshed) {
            const { response, error } = await request()
            return { response, error }
        }
    } else {
        const { response, error } = await request()
        return { response, error }
    }
}

const logOutService = async () => {
    try {
        const response = await appJsonPostApi.post('/auth/logout',{},{withCredentials:true})
        return {response}
    } catch (error) {
        return {error}
    }
}

export { authRequest, getUserInfo,logOutService }