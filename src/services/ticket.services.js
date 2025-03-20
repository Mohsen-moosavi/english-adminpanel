import { appJsonPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const getTicketsFunc= (offset, limit ,status, subject, userId) => {
    return (
        async () => {
            try {
                let queryString = `?limit=${limit}&offset=${offset}`
                status && (queryString += `&status=${status}`)
                subject && (queryString += `&subject=${subject}`)
                userId && (queryString += `&userId=${userId}`)
                
                const response = await apiPrivate(appJsonPostApi).get(`/ticket${queryString}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const getTicketDetailsFunc= (id) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/ticket/${id}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteTicketFunc= (id,offset, limit ,status, subject, userId) => {
    return (
        async () => {
            try {
                let queryString = `?limit=${limit}&offset=${offset}`
                status && (queryString += `&status=${status}`)
                subject && (queryString += `&subject=${subject}`)
                userId && (queryString += `&userId=${userId}`)
                
                const response = await apiPrivate(appJsonPostApi).delete(`/ticket/${id}${queryString}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const sendAnswerToTicketFunc= (id , message) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post(`/ticket/${id}/answer` , {message});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const deleteTicketMessageFunc= (ticketid , messageId) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/ticket/${ticketid}/message/${messageId}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const changeStatusOfTicketFunc = (id) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).put(`/ticket/${id}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    getTicketsFunc,
    deleteTicketFunc,
    getTicketDetailsFunc,
    sendAnswerToTicketFunc,
    deleteTicketMessageFunc,
    changeStatusOfTicketFunc
}