import { appJsonPostApi } from "../configs/axios"
import apiPrivate from "./apiPrivate"

const getContactsFunc= (limit , offset , status ,answering)=>{
    return (
        async () => {
            try {

                let searchQuery = `limit=${limit}&offset=${offset}`
                status && (searchQuery+=`&status=${status}`)
                answering && (searchQuery+=`&answering=${answering}`)
    
                const response = await apiPrivate(appJsonPostApi).get(`/contact?${searchQuery}`);
    
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const answerToContactsFunc= (limit , offset , status ,answering ,contactId, email,message)=>{
    return (
        async () => {
            try {

                let searchQuery = `limit=${limit}&offset=${offset}`
                status && (searchQuery+=`&status=${status}`)
                answering && (searchQuery+=`&answering=${answering}`)
    
                const response = await apiPrivate(appJsonPostApi).post(`/contact/answer/${contactId}?${searchQuery}`, {email , message});
    
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteContactsFunc= (limit , offset , status ,answering ,contactId)=>{
    return (
        async () => {
            try {

                let searchQuery = `limit=${limit}&offset=${offset}`
                status && (searchQuery+=`&status=${status}`)
                answering && (searchQuery+=`&answering=${answering}`)
    
                const response = await apiPrivate(appJsonPostApi).delete(`/contact/${contactId}?${searchQuery}`);
    
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const changeStatusContactsFunc= (limit , offset , status ,answering ,contactId,newStatus)=>{
    return (
        async () => {
            try {

                let searchQuery = `limit=${limit}&offset=${offset}`
                status && (searchQuery+=`&status=${status}`)
                answering && (searchQuery+=`&answering=${answering}`)
                newStatus && (searchQuery+=`&newStatus=${newStatus}`)
    
                const response = await apiPrivate(appJsonPostApi).put(`/contact/${contactId}?${searchQuery}`);
    
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    getContactsFunc,
    answerToContactsFunc,
    deleteContactsFunc,
    changeStatusContactsFunc
}