import { appJsonPostApi, multipartFormPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const uploadFileChunckFunc= (chunk , chunkNumber , totalChunks , fileName , name , fileType , group , bookId ) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("file", chunk);
                formData.append("type", fileType);
                formData.append("group", group);
                formData.append("name", name);
                formData.append("bookId", bookId);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("fileName", fileName);

                const response = await apiPrivate(multipartFormPostApi).post('/book/upload-file' , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const createBookFunc = (name,shortDescription,longDescription,slug,ageGrate,grate,tags,links,cover) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("shortDescription", shortDescription);
                formData.append("longDescription", longDescription);
                formData.append("slug", slug);
                formData.append("ageGrate", ageGrate);
                formData.append("grate", grate);
                formData.append("tags[]", tags);
                formData.append("links", JSON.stringify(links));
                formData.append("cover", cover);

                const response = await apiPrivate(multipartFormPostApi).post('/book' , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateBookFunc = (id,name,shortDescription,longDescription,slug,ageGrate,grate,tags,links,cover) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("shortDescription", shortDescription);
                formData.append("longDescription", longDescription);
                formData.append("slug", slug);
                formData.append("ageGrate", ageGrate);
                formData.append("grate", grate);
                formData.append("tags[]", tags);
                formData.append("links", JSON.stringify(links));
                cover && formData.append('cover' , cover)

                const response = await apiPrivate(multipartFormPostApi).put(`/book/${id}` , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteFileChunckFunc=(fileNames) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post('/book/delete-file' , {fileNames});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteBookWhitoutGettingAllFunc = (bookId) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/book/${bookId}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getAllBooksFunc= async (limit , offset , search = '') => {
    try {
        const response = await appJsonPostApi.get(`/book?limit=${limit}&offset=${offset}&search=${search}` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

const deleteBookWithGettingAllFunc = (id, limit, offset, search) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).delete(`/book/${id}/get-all?limit=${limit}&offset=${offset}&search=${search}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getBookFunc= async (id) => {
    try {
        const response = await appJsonPostApi.get(`/book/${id}` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

export {
    uploadFileChunckFunc,
    deleteFileChunckFunc,
    createBookFunc,
    deleteBookWhitoutGettingAllFunc,
    getAllBooksFunc,
    deleteBookWithGettingAllFunc,
    getBookFunc,
    updateBookFunc
}