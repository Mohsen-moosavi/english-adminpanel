import { appJsonPostApi, multipartFormPostApi } from "../configs/axios"
import apiPrivate from "./apiPrivate"

const getExtrafileFunc= (limit ,offset ,articles, books, courses)=>{
    return (
        async () => {
            try {
                let searchQuery = `limit=${limit}&offset=${offset}`
                articles && (searchQuery+=`&articles=${articles}`)
                books && (searchQuery+=`&books=${books}`)
                courses && (searchQuery+=`&courses=${courses}`)
    
                const response = await apiPrivate(appJsonPostApi).get(`/extra-file?${searchQuery}` , { withCredentials : true});
    
                return { response : response.data };
            } catch (error) {
                return { error };
            }
        }
    )
}

const uploadExtrafileFunc= (limit ,offset ,articles, books, courses , file)=>{
    return (
        async () => {
            try {
                let searchQuery = `limit=${limit}&offset=${offset}`
                articles && (searchQuery+=`&articles=${articles}`)
                books && (searchQuery+=`&books=${books}`)
                courses && (searchQuery+=`&courses=${courses}`)

                const formData = new FormData()
                formData.append('image',file)
    
                const response = await apiPrivate(multipartFormPostApi).post(`/extra-file?${searchQuery}`,formData);
    
                return { response: response.data };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteExtrafileFunc= (limit ,offset ,articles, books, courses , id)=>{
    return (
        async () => {
            try {
                let searchQuery = `limit=${limit}&offset=${offset}`
                articles && (searchQuery+=`&articles=${articles}`)
                books && (searchQuery+=`&books=${books}`)
                courses && (searchQuery+=`&courses=${courses}`)
    
                const response = await apiPrivate(multipartFormPostApi).delete(`/extra-file/${id}?${searchQuery}`);
    
                return { response: response.data };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    getExtrafileFunc,
    uploadExtrafileFunc,
    deleteExtrafileFunc
}