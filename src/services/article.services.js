import { appJsonPostApi, multipartFormPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const createArticleFunc= (title , shortDescription , longDescription , cover , slug , isPublished , links , tags) => {
    return (
        async () => {
            try {
                const formData = new FormData()
                formData.append('title' , title)
                formData.append('shortDescription' , shortDescription)
                formData.append('longDescription' , longDescription)
                formData.append('cover' , cover)
                formData.append('slug' , slug)
                formData.append('isPublished' , isPublished)
                formData.append('links' , JSON.stringify(links))
                formData.append('tags[]' ,[tags])

                const response = await apiPrivate(multipartFormPostApi).post('/article' , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateArticleFunc= (id , title , shortDescription , longDescription , cover , slug , isPublished , links , tags) => {
    return (
        async () => {
            try {
                const formData = new FormData()
                formData.append('title' , title)
                formData.append('shortDescription' , shortDescription)
                formData.append('longDescription' , longDescription)
                cover && formData.append('cover' , cover)
                formData.append('slug' , slug)
                formData.append('isPublished' , isPublished)
                formData.append('links' , JSON.stringify(links))
                formData.append('tags[]' ,[tags])

                const response = await apiPrivate(multipartFormPostApi).put(`/article/${id}` , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getArticlesFunc= (limit , offset , search='' , status , writerId , userId, tagId) => {
    return (
        async ()=>{
            try {
                let searchQuery = `?limit=${limit}&offset=${offset}&search=${search}`
                status && (searchQuery+=`&status=${status}`)
                writerId && (searchQuery+=`&writerId=${writerId}`)
                userId && (searchQuery+=`&userId=${userId}`)
                tagId && (searchQuery+=`&tagId=${tagId}`)
        
                const response = await apiPrivate(appJsonPostApi).get(`/article${searchQuery}`);
                return { response };
            } catch (error) {
                return { error };
            }
    }
)
}

const getArticleFunc= (id) => {
    return (
        async ()=>{
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/article/${id}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteArticleFunc= (id, limit, offset, search , status , writerId , userId, tagId) => {
    return (
        async () => {
            try {
                let searchQuery = `?limit=${limit}&offset=${offset}&search=${search}`
                status && (searchQuery+=`&status=${status}`)
                writerId && (searchQuery+=`&writerId=${writerId}`)
                userId && (searchQuery+=`&userId=${userId}`)
                tagId && (searchQuery+=`&tagId=${tagId}`)


                const response = await apiPrivate(appJsonPostApi).delete(`/article/${id}${searchQuery}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}



export {
    createArticleFunc,
    getArticlesFunc,
    getArticleFunc,
    updateArticleFunc,
    deleteArticleFunc
}