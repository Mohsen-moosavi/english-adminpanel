import { appJsonPostApi, multipartFormPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const getBookGroupsFunc= async (id) => {
    try {
        const response = await appJsonPostApi.get(`/book/get-group/${id}` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

const getCreatingDataFunc= () => {
    return (
        async () =>{
            try {
                const response = await apiPrivate(appJsonPostApi).get(`/course/creating-data`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const createNewCourseFunc= (name, shortDescription, longDescription, cover, videoLink, price, slug, bookFileGroup, bookCollectionId, teacher, levelId,tags ) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("shortDescription",shortDescription);
                formData.append("longDescription", longDescription);
                formData.append("cover", cover);
                formData.append("videoLink", videoLink);
                formData.append("price", price);
                formData.append("slug", slug);
                formData.append("tags[]", tags);
                formData.append("bookFileGroup", bookFileGroup);
                formData.append("bookCollectionId", bookCollectionId);
                formData.append("teacher", teacher);
                formData.append("levelId", levelId);

                const response = await apiPrivate(multipartFormPostApi).post('/course' , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const uploadIntroductionVideoChunckFunc = (chunk, chunkNumber ,totalChunks,fileName ) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("video", chunk);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("fileName", fileName);

                const response = await apiPrivate(multipartFormPostApi).post('/course/upload-video' , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteVideoFunc=(fileName) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post('/course/delete-video' , {fileName});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getCoursesFunc= (limit , offset , search='' ,status , teacherId, bookId, levelId, priceStatus, scoreStatus, userId, tagId)=>{
    return (
        async () => {
            try {

                let searchQuery = `limit=${limit}&offset=${offset}&search=${search}`
                status && (searchQuery+=`&status=${status}`)
                teacherId && (searchQuery+=`&teacherId=${teacherId}`)
                bookId && (searchQuery+=`&bookId=${bookId}`)
                levelId && (searchQuery+=`&levelId=${levelId}`)
                priceStatus && (searchQuery+=`&priceStatus=${priceStatus}`)
                scoreStatus && (searchQuery+=`&scoreStatus=${scoreStatus}`)
                userId && (searchQuery+=`&userId=${userId}`)
                tagId && (searchQuery+=`&tagId=${tagId}`)
    
                const response = await apiPrivate(appJsonPostApi).get(`/course?${searchQuery}` , { withCredentials : false});
    
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}


const deleteCoursesFunc= (id,limit , offset , search='' ,status , teacherId, bookId, levelId, priceStatus, scoreStatus , userId, tagId) => {
    return (
        async()=>{
            try {
                let searchQuery = `limit=${limit}&offset=${offset}&search=${search}`
                status && (searchQuery+=`&status=${status}`)
                teacherId && (searchQuery+=`&teacher=${teacherId}`)
                bookId && (searchQuery+=`&bookId=${bookId}`)
                levelId && (searchQuery+=`&levelId=${levelId}`)
                priceStatus && (searchQuery+=`&priceStatus=${priceStatus}`)
                scoreStatus && (searchQuery+=`&scoreStatus=${scoreStatus}`)
                userId && (searchQuery+=`&userId=${userId}`)
                tagId && (searchQuery+=`&tagId=${tagId}`)

                const response = await apiPrivate(appJsonPostApi).delete(`/course/${id}?${searchQuery}` , { withCredentials : true});
                return { response };
        
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteCourseForUserFunc= (id,limit , offset , search='' ,status , teacherId, bookId, levelId, priceStatus, scoreStatus , userId, tagId) => {
    return (
        async()=>{
            try {
                let searchQuery = `limit=${limit}&offset=${offset}&search=${search}`
                status && (searchQuery+=`&status=${status}`)
                teacherId && (searchQuery+=`&teacher=${teacherId}`)
                bookId && (searchQuery+=`&bookId=${bookId}`)
                levelId && (searchQuery+=`&levelId=${levelId}`)
                priceStatus && (searchQuery+=`&priceStatus=${priceStatus}`)
                scoreStatus && (searchQuery+=`&scoreStatus=${scoreStatus}`)
                userId && (searchQuery+=`&userId=${userId}`)
                tagId && (searchQuery+=`&tagId=${tagId}`)

                const response = await apiPrivate(appJsonPostApi).delete(`/user/${userId}/delete-course/${id}?${searchQuery}` , { withCredentials : true});
                return { response };
        
            } catch (error) {
                return { error };
            }
        }
    )
}

const getCourseFunc = async (id)=>{
    try {
        const response = await appJsonPostApi.get(`/course/${id}` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

const updateCourseFunc = (id,name,shortDescription,longDescription,cover,price,slug,bookFileGroup,bookCollectionId,teacher,levelId,tags,video)=>{
    return (
        async ()=>{
            try {

                const formData = new FormData();
                formData.append("name", name);
                formData.append("shortDescription",shortDescription);
                formData.append("longDescription", longDescription);
                cover && formData.append("cover", cover);
                formData.append("price", price);
                typeof video === 'string' && formData.append("videoLink", video);
                formData.append("slug", slug);
                formData.append("tags[]", tags);
                formData.append("bookFileGroup", bookFileGroup);
                formData.append("bookCollectionId", bookCollectionId);
                formData.append("teacher", teacher);
                formData.append("levelId", levelId);


                const response = await apiPrivate(multipartFormPostApi).post(`/course/update/${id}` , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateIntroductionVideoFunc = (id,chunk, chunkNumber ,totalChunks,fileName , prevLink) => {
    return (
        async () => {
            try {
                const formData = new FormData();
                formData.append("video", chunk);
                formData.append("chunkNumber", chunkNumber);
                formData.append("totalChunks", totalChunks);
                formData.append("fileName", fileName);
                formData.append("prevLink" , prevLink)

                const response = await apiPrivate(multipartFormPostApi).post(`/course/update-video/${id}` , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const updateStatusfunc = (id,limit , offset , search='' ,status , teacherId, bookId, levelId, priceStatus, scoreStatus , userId, tagId) => {
    return (
        async () => {
            try {
                let searchQuery = `limit=${limit}&offset=${offset}&search=${search}`
                status && (searchQuery+=`&status=${status}`)
                teacherId && (searchQuery+=`&teacher=${teacherId}`)
                bookId && (searchQuery+=`&bookId=${bookId}`)
                levelId && (searchQuery+=`&levelId=${levelId}`)
                priceStatus && (searchQuery+=`&priceStatus=${priceStatus}`)
                scoreStatus && (searchQuery+=`&scoreStatus=${scoreStatus}`)
                userId && (searchQuery+=`&userId=${userId}`)
                tagId && (searchQuery+=`&tagId=${tagId}`)

                const response = await apiPrivate(appJsonPostApi).post(`/course/change-status/${id}?${searchQuery}`);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getShortDetailCoursesFunc= async () => {
    try {

        const response = await appJsonPostApi.get(`/course/short-date` , { withCredentials : false});
        return { response };
    } catch (error) {
        return { error };
    }
}

export {
    getBookGroupsFunc,
    getCreatingDataFunc,
    createNewCourseFunc,
    uploadIntroductionVideoChunckFunc,
    deleteVideoFunc,
    getCoursesFunc,
    deleteCoursesFunc,
    getCourseFunc,
    updateCourseFunc,
    updateIntroductionVideoFunc,
    updateStatusfunc,
    getShortDetailCoursesFunc,
    deleteCourseForUserFunc
}