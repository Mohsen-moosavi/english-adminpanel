import { multipartFormPostApi } from "../configs/axios";
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
                formData.append('links[]' , [links])
                formData.append('tags[]' ,[tags])

                console.log('params=================>' ,{ title , shortDescription , longDescription , cover , slug , isPublished , links , tags})

                const response = await apiPrivate(multipartFormPostApi).post('/article' , formData);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    createArticleFunc
}