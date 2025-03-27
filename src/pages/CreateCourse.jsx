import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { FiFileText } from 'react-icons/fi';
import { HiOutlineUpload } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup'
import FormErrorMsg from '../components/modules/FormErrorMessag';
import { createNewCourse, getBookGroups, getCreatingData, updateCourse } from '../redux/features/courseSlice';
import { IoMdClose } from 'react-icons/io';
import Progress from '../components/modules/Progress';
import toast from 'react-hot-toast';
import { getCourseFunc } from '../services/course.services';



export default function CreateCourse() {
    const isInitialised = useRef(false)
    const params = useParams()
    const { isLoading, bookCollections, bookGroups, teachers, levels } = useSelector(state => state.courseData)
    const  {userInfo}  = useSelector(state => state.userData)
    const coverInputElm = useRef()
    const videoInputElm = useRef()
    const [id, setId] = useState()
    const [coverUrl, setCoverUrl] = useState()
    const [progress, setProgress] = useState(0)
    const [isCourseExist, setIsCourseExist] = useState()
    const [isSelectedCover, setIsSelectedCover] = useState(null)
    const [isSelectedVideo, setIsSelectedVideo] = useState(null)
    const [tagArray, setTagArray] = useState([])
    const [tagInput, setTagInput] = useState('')
    // const [subtitleArray, setSubtitleArray] = useState([])
    // const [subtitleInput, setSubtitleInput] = useState('')
    // const [subtitleIdInput, setSubtitleIdInput] = useState('')

    const dispatch = useDispatch()

    const navigate = useNavigate()

    useEffect(() => {
        if (!isInitialised.current) {
            isInitialised.current = true
            if (params.id) {
                setId(params.id)
                getCourseInfo(params.id)
            }
            dispatch(getCreatingData({}))
        }
    }, [])

    async function getCourseInfo(id) {
        const { response, error } = await getCourseFunc(id);
        if (error) {
            return toast.error(error.response.data.message)
        }
        const course = response.data.data.course
        dispatch(getBookGroups({ id: course.book_collection.id }))
        formik.setFieldValue('name', course.name)
        formik.setFieldValue('shortDescription', course.shortDescription)
        formik.setFieldValue('longDescription', course.longDescription)
        formik.setFieldValue('slug', course.slug)
        formik.setFieldValue('price', course.price)
        formik.setFieldValue('bookFileGroup', course.book_file_group)
        formik.setFieldValue('levelId', course.level.id)
        formik.setFieldValue('teacherId', course.user.id)
        formik.setFieldValue('bookCollectionId', course.book_collection.id)
        formik.setFieldValue('video', course.introductionVideo)
        setCoverUrl(course.cover)
        setTagArray(course.tags?.map(tag => tag.name))
        setIsSelectedCover(true)
        setIsCourseExist(true)
    }


    const FormValidation = Yup.object({
        name: Yup.string().required("لطفا عنوان دوره را وارد کنید!.").min(3, "عنوان وارد شده باید حداقل 3 کاراکتر باشد."),
        shortDescription: Yup.string().required("لطفا توضیح کوتاهی برای دوره بنویسید.").min(50, "توضیحات کوتاه حداقل باید 50 کاراکتر باشد."),
        longDescription: Yup.string().required("لطفا متن توضیحات دوره را بنویسید.").min(300, "توضیحات دوره حداقل باید 300 کاراکتر باشد."),
        cover: Yup.mixed()
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
                    const isValid = ['png', 'jpg', 'jpeg'].includes(file?.name?.split('.').pop());
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
        video: Yup.mixed()
            .test({
                message: 'لطفا یک فایل بارگزاری کنید.',
                test: (file) => {
                    if (!id && !file) {
                        return false
                    }
                    return true;
                }
            })
            .test({
                message: 'فقط فرمت mp4 مجاز است.',
                test: (file, context) => {
                    if(id){
                        return true
                    }
                    const isValid = ['mp4'].includes(file?.name?.split('.').pop());
                    if (!isValid) context?.createError();
                    return isValid;
                }
            })
            .test({
                message: `حجم فایل آپلود شده نباید از 300 مگابایت بیشتر باشد.`,
                test: (file) => {
                    if(id){
                        return true
                    }
                    const isValid = file?.size <= 300 * 1024 * 1024;
                    return isValid;
                }
            })
            .optional(),
        slug: Yup.string().required("لطفا slug دوره را وارد کنید!.").min('8', 'slug حداقل باید 8 کاراکتر باشد.'),
        price: Yup.number().required("لطفا مبلغ دوره را وارد کنید!."),
        bookFileGroup: Yup.string().required("لطفا شماره گروه فایل های دوره را وارد کنید!."),
        bookCollectionId: Yup.number().required("لطفا مجموعه ی مربوط به دوره را وارد کنید!."),
        teacherId: Yup.number().required("لطفا مدرس دوره را مشخص کنید!."),
        levelId: Yup.number().required("لطفا سطح دوره را وارد کنید!."),
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            shortDescription: '',
            longDescription: '',
            cover: '',
            video: '',
            slug: '',
            price: '',
            teacherId: '',
            bookFileGroup: '',
            bookCollectionId: '',
            levelId: '',
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {

            if (!tagArray.length) {
                toast.error('دوره باید حداقل یک تگ داشته باشد.')
            } else {
                if (id) {
                    dispatch(updateCourse({ id,name: values.name, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.cover, price: values.price, slug: values.slug, bookFileGroup: values.bookFileGroup, bookCollectionId: values.bookCollectionId, teacher: values.teacherId, levelId: values.levelId, tags: tagArray, video : values.video, navigator: navigate }))
                } else {
                    dispatch(createNewCourse({ name: values.name, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.cover, video: values.video, videoName: `${userInfo.id}___${Date.now()}___${values.video.name}`, price: values.price, slug: values.slug, bookFileGroup: values.bookFileGroup, bookCollectionId: values.bookCollectionId, teacher: values.teacherId, levelId: values.levelId, tags: tagArray, setProgress,navigator: navigate }))
                }
            }
        },
    });

    function coverInputHandleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            setIsSelectedCover(true)
            formik.setFieldValue('cover', e.target.files[0]);
        }
    }

    function videoInputHandleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            setIsSelectedVideo(true)
            formik.setFieldValue('video', e.target.files[0]);
        }
    }

    function chooseCoverHandler() {
        coverInputElm.current.click()
    }

    function chooseVideoHandler() {
        videoInputElm.current.click()
    }

    function clearCoverInput() {
        setIsSelectedCover(false)
        setCoverUrl('')
        formik.setFieldValue('cover', '');
        coverInputElm.current.value = ''
        coverInputElm.current.type = ''
        coverInputElm.current.type = 'file'
    }

    function clearVideoInput() {
        setIsSelectedVideo(false)
        formik.setFieldValue('video', '');
        videoInputElm.current.value = ''
        videoInputElm.current.type = ''
        videoInputElm.current.type = 'file'
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

    function deleteTagHandler(deletedTag) {
        setTagArray(prevValue => prevValue.filter(tag => tag !== deletedTag))
    }


    function bookCollectionsIdChangeHandler(e) {
        if (e.target.value) {
            dispatch(getBookGroups({ id: e.target.value }))
        }
    }

    return (
        <>
            {id && !isCourseExist ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <h4 className='text-red-500 font-bold'>موردی یافت نشد!</h4>
                </div>
            ) : (
                <div>
                    <h3 className='page-title'>{id ? 'ویرایش دوره' : 'ایجاد دوره'}</h3>
                    <form className='mb-4' onSubmit={formik.handleSubmit}>
                        <div className="form-btn-group">
                            <label htmlFor="create-course-input-1" className="form-label">عنوان دوره:</label>
                            <input
                                type="text"
                                name='name'
                                placeholder="عنوان دوره را وارد کنید..."
                                className="form-input" id="create-course-input-1"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.name && formik.errors.name ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.name} />
                                </div>
                            ) : null}
                        </div>
                        
                        <div className="form-btn-group">
                            <label htmlFor="create-course-input-8" className="form-label">slug دوره:</label>
                            <input
                                type="text"
                                name='slug'
                                placeholder="slug دوره را وارد کنید..."
                                className="form-input" id="create-course-input-8"
                                value={formik.values.slug}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.slug && formik.errors.slug ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.slug} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group">
                            <label htmlFor="create-course-input-12" className="form-label">قیمت دوره:</label>
                            <input
                                type="number"
                                name='price'
                                placeholder="قیمت دوره را وارد کنید..."
                                className="form-input" id="create-course-input-12"
                                value={formik.values.price}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.price && formik.errors.price ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.price} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group">
                            <label htmlFor="create-course-input-14" className="form-label">مدرس دوره:</label>
                            <select
                                name='teacherId'
                                className="form-input"
                                id="create-course-input-14"
                                value={formik.values.teacherId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}>
                                <option value="">یک مورد را انتخاب کنید</option>
                                {teachers?.length && teachers.map((teacher, index) => (
                                    <option key={index} value={teacher.id}>{teacher.name}</option>
                                ))}
                            </select>
                            {formik.touched.teacherId && formik.errors.teacherId ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.teacherId} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group">
                            <label htmlFor="create-course-input-15" className="form-label">سطح دوره:</label>
                            {levels.length ? (
                                <select
                                    name='levelId'
                                    defaultValue={''}
                                    className="form-input"
                                    id="create-course-input-15"
                                    value={formik.values.levelId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}>
                                    <option value="">یک مورد را انتخاب کنید</option>
                                    {levels.map((level, index) => (
                                        <option key={index} value={level.id} >{level.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input type="text" className='form-input !text-red-600' disabled value={'ابتدا باید یک  سطح، ایجاد کنید.'} />
                            )}

                            {formik.touched.levelId && formik.errors.levelId ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.levelId} />
                                </div>
                            ) : null}
                        </div>

                        <div className='grid sm:grid-cols-2 gap-x-2 items-start my-10'>
                            <div className="form-btn-group">
                                <label htmlFor="create-course-input-12" className="form-label">مجموعه کتاب دوره:</label>
                                {bookCollections.length ? (
                                    <>
                                        <select
                                            id="create-course-input-12"
                                            className='form-input'
                                            name='bookCollectionId'
                                            value={formik.values.bookCollectionId}
                                            onChange={(e) => { formik.handleChange(e); bookCollectionsIdChangeHandler(e) }}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value=''>{'یک مورد را انتخاب کنید'}</option>
                                            {bookCollections.map((book, index) => (
                                                <option key={index} value={book.id}>{book.name}</option>
                                            ))}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <input type="text" className='form-input !text-red-600' disabled value={'ابتدا باید یک مجموعه کتاب، ایجاد کنید.'} />
                                    </>
                                )}

                                {formik.touched.bookCollectionId && formik.errors.bookCollectionId ? (
                                    <div className="w-full text-start">
                                        <FormErrorMsg msg={formik.errors.bookCollectionId} />
                                    </div>
                                ) : null}
                            </div>

                            <div className="form-btn-group">
                                <label htmlFor="create-course-input-13" className="form-label">گروه کتاب دوره:</label>
                                {bookGroups.length && formik.values.bookCollectionId ? (
                                    <>
                                        <select
                                        defaultValue={''}
                                            id="create-course-input-13"
                                            className='form-input'
                                            name='bookFileGroup'
                                            value={formik.values.bookFileGroup}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value=''>{'یک مورد را انتخاب کنید'}</option>
                                            {bookGroups.map((groupObj, index) => (
                                                <option key={index} value={groupObj.group}>{groupObj.group}</option>
                                            ))}
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        <input type="text" className='form-input' disabled value={'ابتدا یک مجموعه کتاب انتخاب کنید.'} />
                                    </>
                                )}

                                {formik.touched.bookFileGroup && formik.errors.bookFileGroup ? (
                                    <div className="w-full text-start">
                                        <FormErrorMsg msg={formik.errors.bookFileGroup} />
                                    </div>
                                ) : null}
                            </div>

                        </div>

                        <div className="form-btn-group py-3 rounded-lg bg-[#d6f1f3]">
                            <label htmlFor="create-course-input-5" className="form-label">تگ های دوره را وارد کنید:</label>
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


                        <div className="form-btn-group">
                            <label htmlFor="create-course-input-2" className="form-label">توضیحات کوتاه (به فرم HTML):</label>
                            <textarea
                                type="text"
                                name='shortDescription'
                                placeholder="یک چکیده از موضوع دوره را بنویسید..."
                                className="form-input min-h-[200px]" id="create-course-input-2"
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
                            <label htmlFor="create-article-input-3" className="form-label">توضیحات کامل (به فرم HTML):</label>
                            <textarea
                                type="text"
                                name='longDescription'
                                placeholder="متن کامل توضیحات را بنویسید..."
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

                        <div className={`grid ${id ? '' :'sm:grid-cols-2'} gap-x-2`}>
                            <div className='form-btn-group'>
                                <input
                                    id="create-course-input-4"
                                    type="file"
                                    ref={coverInputElm}
                                    onChange={coverInputHandleChange}
                                    className="hidden"
                                    rows={3}
                                />

                                {id && isSelectedCover && coverUrl ? (
                                    <div className='relative w-full max-w-[500px] mx-auto border-4 rounded-xl border-[#475569] overflow-hidden'>
                                        <img src={coverUrl} alt="cover" className='w-full' />
                                        <div className='absolute top-0 right-0 flex items-center justify-center w-full h-full transition-all opacity-0 hover:opacity-100 bg-black/50'>
                                            <MdClose size={60} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" onClick={clearCoverInput} />
                                        </div>
                                    </div>
                                )
                                    : (
                                        <>
                                            {!isSelectedCover ? (
                                                <div onClick={chooseCoverHandler} className="cursor-pointer flex flex-col justify-center gap-y-4 items-center w-[100%] max-w-[400px] p-8 mt-4 mx-auto rounded-2xl bg-white border-4 border-slate-300 border-dashed">
                                                    <HiOutlineUpload size={50} color="#475569" className="rounded-full bg-slate-200 p-3" />
                                                    <span className="text-slate-600 text-lg font-semibold">آپلود فایل</span>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center gap-x-3  w-[100%] max-w-[400px] mx-auto p-3 bg-white border border-2 border-slate-200 rounded-md">
                                                    <MdClose size={40} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" onClick={clearCoverInput} />
                                                    <div className="flex-1 flex justify-start" dir="ltr">
                                                        <p className="truncate max-w-[268px] font-semibold">{formik.values.cover?.name || formik.values.name || "fileName"}</p>
                                                    </div>
                                                    <FiFileText size={40} color="#475569" />
                                                </div>
                                            )}

                                            <label htmlFor="create-course-input-4" className="form-label w-full text-center">کاور دوره (حداکثر 200 کیلوبایت)</label>
                                            {formik.touched.cover && formik.errors.cover ? (
                                                <div className="w-full text-center">
                                                    <FormErrorMsg msg={formik.errors.cover} />
                                                </div>
                                            ) : null}
                                        </>
                                    )}

                            </div>

                            {id ? '' : (
                                <div className='form-btn-group'>
                                    <input
                                        id="create-course-input-11"
                                        type="file"
                                        ref={videoInputElm}
                                        onChange={videoInputHandleChange}
                                        className="hidden"
                                        rows={3}
                                    />

                                    {!isSelectedVideo ? (
                                        <div onClick={chooseVideoHandler} className="cursor-pointer flex flex-col justify-center gap-y-4 items-center w-[100%] max-w-[400px] p-8 mt-4 mx-auto rounded-2xl bg-white border-4 border-slate-300 border-dashed">
                                            <HiOutlineUpload size={50} color="#475569" className="rounded-full bg-slate-200 p-3" />
                                            <span className="text-slate-600 text-lg font-semibold">آپلود فایل</span>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center gap-x-3  w-[100%] max-w-[400px] mx-auto p-3 bg-white border border-2 border-slate-200 rounded-md">
                                            <MdClose size={40} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" onClick={clearVideoInput} />
                                            <div className="flex-1 flex justify-start" dir="ltr">
                                                <p className="truncate max-w-[268px] font-semibold">{formik.values.video?.name || formik.values.name || "fileName"}</p>
                                            </div>
                                            <FiFileText size={40} color="#475569" />
                                        </div>
                                    )}

                                    <label htmlFor="create-course-input-11" className="form-label w-full text-center">ویدئو معارفه دوره (حداکثر 300 مگابایت)</label>
                                    {formik.touched.video && formik.errors.video ? (
                                        <div className="w-full text-center">
                                            <FormErrorMsg msg={formik.errors.video} />
                                        </div>
                                    ) : null}

                                </div>
                            )}

                        </div>

                        <div className="grid md:grid-cols-2 gap-x-2 gap-y-2">
                            {
                                isLoading ? (
                                    <button disabled={isLoading} className='form-submit !py-2 block w-full text-center !text-black !bg-gray-400'>بازگشت</button>
                                ) : (
                                    <Link to={-1} className="form-submit !py-2 block w-full text-center !text-black !bg-gray-200 hover:!bg-gray-400">بازگشت</Link>
                                )
                            }
                            <input type="submit" disabled={isLoading} value={id ? 'ویرایش دوره' : 'افزودن دوره'}
                                className={`form-submit !py-2 block w-full hover:opacity-70 transition-all ${isLoading ? 'opacity-60' : ''}`} />
                        </div>

                        {(progress !== 0 && progress !== 100) && (
                            <Progress progress={progress} />
                        )}
                    </form>
                </div>
            )}
        </>
    )

}
