import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik';
import FormErrorMsg from '../components/modules/FormErrorMessag';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineUpload } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { FiFileText } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { createArticle, updateArticle } from '../redux/features/articleSlice';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getArticleFunc } from '../services/article.services';

export default function CreateArticle() {

    const isInitialised = useRef(false)
    const params = useParams()
    const { isLoading } = useSelector(state => state.articleData)
    const fileInputElm = useRef()
    const [id, setId] = useState()
    const [coverUrl, setCoverUrl] = useState()
    const [isarticleExist, setIsarticleExist] = useState()
    const [isSelectedFile, setIsSelectedFile] = useState(null)
    const [tagArray, setTagArray] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [subtitleArray, setSubtitleArray] = useState([])
    const [subtitleInput, setSubtitleInput] = useState('')
    const [subtitleIdInput, setSubtitleIdInput] = useState('')

    const dispatch = useDispatch()

    const navigator = useNavigate()

    useEffect(() => {
        if (!isInitialised.current) {
            isInitialised.current = true
            if (params.id) {
                setId(params.id)
                getArticleInfo(params.id)
            }
        }
    }, [])

    async function getArticleInfo(id) {
        const { response, error } = await getArticleFunc(id);
        if (error) {
            return toast.error(error.response.data.message)
        }
        const article = response.data.data.article
        formik.setFieldValue('title', article.title)
        formik.setFieldValue('shortDescription', article.shortDescription)
        formik.setFieldValue('longDescription', article.longDescription)
        formik.setFieldValue('slug', article.slug)
        formik.setFieldValue('isDraft', !article.isPublished)
        setCoverUrl(article.cover)
        setTagArray(article.tags?.map(tag => tag.name))
        setSubtitleArray(JSON.parse(article.links).map(link => ({ subtitle: link.replace(/<a href="#.*">/, '').replace(/<\/a>/, ""), id: link.replace(/<a href="#/, '').replace(/">.*/, "") })))
        setIsSelectedFile(true)
        setIsarticleExist(true)
    }


    const FormValidation = Yup.object({
        title: Yup.string().required("لطفا عنوان مقاله را وارد کنید!.").min(3, "عنوان وارد شده باید حداقل 3 کاراکتر باشد."),
        shortDescription: Yup.string().required("لطفا توضیح کوتاهی برای مقاله بنویسید.").min(50, "توضیحات کوتاه حداقل باید 50 کاراکتر باشد."),
        longDescription: Yup.string().required("لطفا متن مقاله را بنویسید.").min(300, "متن مقاله حداقل باید 300 کاراکتر باشد."),
        file: Yup.mixed()
            .test({
                message: 'لطفا یک فایل بارگزاری کنید.',
                test: (file) => {
                    if (id && !file) {
                        return true
                    } else if (!id && !file) {
                        return false
                    }
                    return true;
                }
            })
            .test({
                message: 'فقط فرمت png و jpeg و jpg مجاز است.',
                test: (file, context) => {
                    if (id && !file) {
                        return true
                    }
                    const isValid = ['png', 'jpg' , 'jpeg'].includes(file?.name?.split('.').pop());
                    if (!isValid) context?.createError();
                    return isValid;
                }
            })
            .test({
                message: `حجم فایل آپلود شده نباید از 200 کیلوبایت بیشتر باشد.`,
                test: (file) => {
                    if (id && !file) {
                        return true
                    }
                    const isValid = file?.size < 200000;
                    return isValid;
                }
            })
            .optional(),
        slug: Yup.string().required("لطفا slug مقاله را وارد کنید!.").min('8', 'slug حداقل باید 8 کاراکتر باشد.'),
    });
    const formik = useFormik({
        initialValues: {
            title: '',
            shortDescription: '',
            longDescription: '',
            file: '',
            slug: '',
            isDraft: false
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {

            if (!tagArray.length) {
                toast.error('مقاله باید حداقل یک تگ داشته باشد.')
            } else if (!subtitleArray.length) {
                toast.error('مقاله باید حداقل یک زیر موضوع داشته باشد.')
            } else {
                try {
                    const links = subtitleArray.map(item => `<a href="#${item.id}">${item.subtitle}</a>`)
                    if(id){
                        dispatch(updateArticle({id, title: values.title, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.file, slug: values.slug, isPublished: !values.isDraft, links, tags: tagArray, navigator }))
                    }else{
                        dispatch(createArticle({ title: values.title, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.file, slug: values.slug, isPublished: !values.isDraft, links, tags: tagArray, navigator }))
                    }
                    // setSearchChangerFlag(prev=>!prev)
                    // setPaginatorChangerFlag(prev=>!prev)
                    //     resetForm()
                } catch (error) {
                    toast.error(error.response?.data?.message || error.message)
                }
            }
        },
    });

    function fileInputHandleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            setIsSelectedFile(true)
            formik.setFieldValue('file', e.target.files[0]);
        }
    }

    function chooseFileHandler() {
        fileInputElm.current.click()
    }

    function clearFileInput() {
        setIsSelectedFile(false)
        setCoverUrl('')
        formik.setFieldValue('file', '');
        fileInputElm.current.value = ''
        fileInputElm.current.type = ''
        fileInputElm.current.type = 'file'
    }

    function addNewTagHandler(e) {
        if (e.keyCode === 13) {
            e.preventDefault()
            if (e.target.value?.trim()) {
                setTagArray(prev => [...prev, e.target.value])
                setTagInput("")
            }
        }
    }

    function addNewSubtitleHandler(e) {
        e.preventDefault()
        if (subtitleIdInput?.trim() && subtitleInput?.trim()) {
            setSubtitleArray(prev => [...prev, { subtitle: subtitleInput, id: subtitleIdInput }])
            setSubtitleIdInput("")
            setSubtitleInput("")
        }
    }

    function deleteTagHandler(deletedTag) {
        setTagArray(prevValue => prevValue.filter(tag => tag !== deletedTag))
    }

    function deleteSubtitleHandler(deletedSubtitle) {
        setSubtitleArray(prevValue => prevValue.filter(subtitle => subtitle !== deletedSubtitle))
    }

    return (
        <>
            {id && !isarticleExist ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <h4 className='text-red-500 font-bold'>موردی یافت نشد!</h4>
                </div>
            ) : (
                <div>
                    <h3 className='page-title'>{id ? 'ویرایش مقاله' : 'افزودن مقاله'}</h3>
                    <form className='mb-4' onSubmit={formik.handleSubmit}>
                        <div className="form-btn-group">
                            <label htmlFor="create-article-input-1" className="form-label">عنوان مقاله:</label>
                            <input
                                type="text"
                                name='title'
                                placeholder="عنوان مقاله را وارد کنید..."
                                className="form-input" id="create-article-input-1"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.title && formik.errors.title ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.title} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group">
                            <label htmlFor="create-article-input-8" className="form-label">slug مقاله:</label>
                            <input
                                type="text"
                                name='slug'
                                placeholder="slug مقاله را وارد کنید..."
                                className="form-input" id="create-article-input-8"
                                value={formik.values.slug}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.slug && formik.errors.slug ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.slug} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group py-3 rounded-lg bg-[#d6f1f3]">
                            <label htmlFor="create-article-input-5" className="form-label">تگ های مقاله را وارد کنید:</label>
                            <input
                                type="text"
                                // name='tags'
                                placeholder="برای ثبت تگ، پس از نوشتن، inter را بزنید..."
                                className="form-input" id="create-article-input-5"
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={addNewTagHandler}
                            />

                            <div className='mt-2 flex flex-wrap'>
                                {tagArray.map((tag, index) =>
                                (
                                    <span key={index} className='flex items-center justify-start gap-x-1 py-1 px-2 m-1 rounded-full bg-main-color text-white'>
                                        <IoMdClose className='cursor-pointer rounded-full' onClick={() => deleteTagHandler(tag)} />
                                        {tag}
                                    </span>))}
                            </div>
                        </div>

                        <div className="py-3 rounded-lg bg-[#d6f1f3] mb-3">
                            <div className='w-full flex items-end justify-center gap-2'>
                                <div className='w-full grid md:grid-cols-2 gap-x-2 gap-y-2'>
                                    <div>
                                        <label htmlFor="create-article-input-6" className="form-label">زیرموضوعات مقاله:</label>
                                        <input
                                            type="text"
                                            // name='tags'
                                            placeholder="زیرموضوعات مقاله را وارد کنید..."
                                            className="form-input mt-1" id="create-article-input-6"
                                            value={subtitleInput}
                                            onChange={e => setSubtitleInput(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="create-article-input-7" className="form-label">آی دی:</label>
                                        <input
                                            type="text"
                                            // name='tags'
                                            placeholder="آی دی مربوط به زیر موضوع را وارد کنید..."
                                            className="form-input mt-1" id="create-article-input-7"
                                            value={subtitleIdInput}
                                            onChange={e => setSubtitleIdInput(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button onClick={addNewSubtitleHandler} className='rounded-lg bg-main-color text-white px-4 !py-2 border border-solid border-main-color hover:bg-main-color/80'>افزودن</button>
                            </div>


                            <div className='mt-2 flex flex-wrap'>
                                {subtitleArray.map((subtitleObject, index) =>
                                (
                                    <span key={index} className='flex items-center justify-start gap-x-1 py-1 px-2 m-1 rounded-full bg-main-color text-white'>
                                        <IoMdClose className='cursor-pointer rounded-full' onClick={() => deleteSubtitleHandler(subtitleObject)} />
                                        {`${subtitleObject?.subtitle} (${subtitleObject?.id})`}
                                    </span>))}
                            </div>
                        </div>


                        <div className="form-btn-group">
                            <label htmlFor="create-article-input-2" className="form-label">توضیحات کوتاه:</label>
                            <textarea
                                type="text"
                                name='shortDescription'
                                placeholder="یک چکیده از مقاله را بنویسید..."
                                className="form-input min-h-[200px]" id="create-article-input-2"
                                value={formik.values.shortDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.shortDescription && formik.errors.shortDescription ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.shortDescription} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group">
                            <label htmlFor="create-article-input-3" className="form-label">متن مقاله (به فرم HTML):</label>
                            <textarea
                                type="text"
                                name='longDescription'
                                placeholder="متن کامل مقاله را بنویسید..."
                                className="form-input min-h-[400px]" id="create-article-input-3"
                                value={formik.values.longDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.longDescription && formik.errors.longDescription ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.longDescription} />
                                </div>
                            ) : null}
                        </div>

                        <div className='form-btn-group'>
                            <input
                                id="create-article-input-4"
                                type="file"
                                ref={fileInputElm}
                                onChange={fileInputHandleChange}
                                className="hidden"
                                rows={3}
                            />

                            {id && isSelectedFile && coverUrl ? (
                                <div className='relative w-full max-w-[500px] mx-auto border-4 rounded-xl border-[#475569] overflow-hidden'>
                                    <img src={coverUrl} alt="cover" className='w-full'/>
                                    <div className='absolute top-0 right-0 flex items-center justify-center w-full h-full transition-all opacity-0 hover:opacity-100 bg-black/50'>
                                    <MdClose size={60} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" onClick={clearFileInput} />
                                    </div>
                                </div>
                            )
                                : (
                                    <>
                                        {!isSelectedFile ? (
                                            <div onClick={chooseFileHandler} className="cursor-pointer flex flex-col justify-center gap-y-4 items-center w-[100%] max-w-[400px] p-8 mt-4 mx-auto rounded-2xl bg-white border-4 border-slate-300 border-dashed">
                                                <HiOutlineUpload size={50} color="#475569" className="rounded-full bg-slate-200 p-3" />
                                                <span className="text-slate-600 text-lg font-semibold">آپلود فایل</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center gap-x-3  w-[100%] max-w-[400px] mx-auto p-3 bg-white border border-2 border-slate-200 rounded-md">
                                                <MdClose size={40} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" onClick={clearFileInput} />
                                                <div className="flex-1 flex justify-start" dir="ltr">
                                                    <p className="truncate max-w-[268px] font-semibold">{formik.values.file?.name || formik.values.title || "fileName"}</p>
                                                </div>
                                                <FiFileText size={40} color="#475569" />
                                            </div>
                                        )}

                                        <label htmlFor="create-article-input-4" className="form-label w-full text-center">کاور مقاله (حداکثر 200 کیلوبایت)</label>
                                        {formik.touched.file && formik.errors.file ? (
                                            <div className="w-full text-center">
                                                <FormErrorMsg msg={formik.errors.file} />
                                            </div>
                                        ) : null}
                                    </>
                                )}

                        </div>

                        <div className='flex items-center gap-x-2 mb-3'>
                            <input
                                name='isDraft'
                                type="checkbox"
                                id='isPublishedCheckbox'
                                className='w-[20px] h-[20px]'
                                onChange={formik.handleChange}
                                value={formik.values.isDraft}
                                checked={formik.values.isDraft}
                            />

                            <label htmlFor="isPublishedCheckbox" className='text-main-color'>ذخیره به عنوان پیش نویس</label>
                        </div>

                        <div className="grid md:grid-cols-2 gap-x-2 gap-y-2">
                            <Link to={-1} className="form-submit !py-2 block w-full text-center !text-black !bg-gray-200 hover:!bg-gray-400">بازگشت</Link>
                            <input type="submit" disabled={isLoading} value={id ? 'ویرایش مقاله' : 'افزودن مقاله'}
                                className="form-submit !py-2 block w-full hover:opacity-70 transition-all" />
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}
