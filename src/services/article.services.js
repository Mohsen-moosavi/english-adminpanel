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

const getArticlesFunc= async (limit , offset , search='' , status , writerId) => {
    try {
        const response = await appJsonPostApi.get(`/article?limit=${limit}&offset=${offset}&search=${search}&status=${status}&writerId=${writerId}` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

const getArticleFunc= async (id) => {
    try {
        const response = await appJsonPostApi.get(`/article/${id}` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

const deleteArticleFunc= (id, limit, offset, search , status , writerId) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/article/${id}?limit=${limit}&offset=${offset}&search=${search}&status=${status}&writerId=${writerId}`);
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