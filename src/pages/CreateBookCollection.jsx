import * as Yup from 'yup'
import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik';
import FormErrorMsg from '../components/modules/FormErrorMessag';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineUpload } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { FiFileText } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import { FaFileZipper } from 'react-icons/fa6';
import { createBookCollection, updateBookCollection } from '../redux/features/bookSlice';
import Progress from '../components/modules/Progress';
import { getBookFunc } from '../services/book.service';
import { authRequest } from '../services/authApi.service';

export default function CreateBookCollection() {

    const isInitialised = useRef(false)
    const params = useParams()
    const [progress, setProgress] = useState(0)
    const { isLoading } = useSelector(state => state.articleData)
    const {userInfo} = useSelector(state => state.userData)
    const coverInputElm = useRef()
    const bookFileInputElm = useRef()
    const [id, setId] = useState()
    const [coverUrl, setCoverUrl] = useState()
    const [isBookExist, setIsBookExist] = useState()
    const [isSelectedCover, setIsSelectedCover] = useState(null)
    const [tagArray, setTagArray] = useState([])
    const [tagInput, setTagInput] = useState('')
    const [subtitleArray, setSubtitleArray] = useState([])
    const [subtitleInput, setSubtitleInput] = useState('')
    const [subtitleIdInput, setSubtitleIdInput] = useState('')
    const [bookNameInput, setBookNameInput] = useState('')
    const [bookGroupInput, setBookGroupInput] = useState('')
    const [bookGroupArray, setBookGroupArray] = useState(new Set())
    const [bookTypeInput, setBookTypeInput] = useState('')
    const [bookFileArray, setBookFileArray] = useState([])
    const [deletedFileArray, setDeletedFileArray] = useState([])

    const dispatch = useDispatch()

    const navigator = useNavigate()

    useEffect(() => {
        if (!isInitialised.current) {
            isInitialised.current = true
            if (params.id) {
                setId(params.id)
                getBookInfo(params.id)
            }
        }
    }, [])

    async function getBookInfo(id) {
        const { response, error } = await authRequest(getBookFunc(id));
        if (error) {
            if (error?.response?.status === 401) {
                window.location.assign('/login');
            }
            return toast.error(error.response.data.message)
        }
        const book = response.data.data.book
        formik.setFieldValue('name', book.name)
        formik.setFieldValue('shortDescription', book.shortDescription)
        formik.setFieldValue('longDescription', book.longDescription)
        formik.setFieldValue('slug', book.slug)
        formik.setFieldValue('ageGrate', book.ageGrate)
        formik.setFieldValue('grate', book.grate)
        formik.setFieldValue('isForChildren', Boolean(book.forChildren))
        setCoverUrl(book.cover)
        setTagArray(book.tags?.map(tag => tag.name))
        setSubtitleArray(JSON.parse(book.links).map(link => ({ subtitle: link.replace(/<a href="#.*">/, '').replace(/<\/a>/, ""), id: link.replace(/<a href="#/, '').replace(/">.*/, "") })))
        setBookFileArray(book.files?.map(file => ({ group: file.group, fileName: file.link?.split('/')?.reverse()[0], name: file.name, type: file.link?.split('.')?.reverse()[0], fileType: file.type })))
        setIsSelectedCover(true)
        setBookGroupArray(prevValue => new Set([...prevValue, book.files.map(file => file.group)]))
        setIsBookExist(true)
    }


    const FormValidation = Yup.object({
        name: Yup.string().required("لطفا عنوان مجموعه را وارد کنید!.").min(3, "عنوان وارد شده باید حداقل 3 کاراکتر باشد."),
        shortDescription: Yup.string().required("لطفا توضیح کوتاهی برای مجموعه بنویسید.").min(50, "توضیحات کوتاه حداقل باید 50 کاراکتر باشد."),
        longDescription: Yup.string().required("لطفا توضیحات کامل درباره مجموعه را بنویسید.").min(300, "توضیحات کامل حداقل باید 300 کاراکتر باشد."),
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
        slug: Yup.string().required("لطفا slug مجموعه را وارد کنید!.").min('8', 'slug حداقل باید 8 کاراکتر باشد.'),
        ageGrate: Yup.string().required("لطفا یک رده سنی برای مجموعه مشخص کنید.").min('3', 'رده سنی حداقل باید 3 کاراکتر باشد.'),
        grate: Yup.string().required("لطفا یک سطح کلی برای مجموعه مشخص کنید.").min('3', 'سطح حداقل باید 3 کاراکتر باشد.'),
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            shortDescription: '',
            longDescription: '',
            cover: '',
            slug: '',
            ageGrate: '',
            grate: '',
            isForChildren: false
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {

            if (!tagArray.length) {
                toast.error('مقاله باید حداقل یک تگ داشته باشد.')
            } else if (!subtitleArray.length) {
                toast.error('مقاله باید حداقل یک زیر موضوع داشته باشد.')
            } else if (!bookFileArray.length) {
                toast.error('حداقل یک فایل برای مجموعه وارد کنید.')
            } else {
                try {
                    const links = subtitleArray.map(item => `<a href="#${item.id}">${item.subtitle}</a>`)
                    if (id) {
                        const newFiles = bookFileArray.filter(file => file.isNew)
                        // dispatch(updateBookCollection({ id, name: values.name, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.cover, slug: values.slug, links, tags: tagArray, ageGrate: values.ageGrate, grate: values.grate, newFiles, deletedFiles: deletedFileArray, isForChildren:values.isForChildren, navigator, setProgress }))
                    } else {
                        console.log({ name: values.name, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.cover, slug: values.slug, links, tags: tagArray, ageGrate: values.ageGrate, grate: values.grate, files: bookFileArray, isForChildren:values.isForChildren, navigator, setProgress  })
                        // dispatch(createBookCollection({ name: values.name, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.cover, slug: values.slug, links, tags: tagArray, ageGrate: values.ageGrate, grate: values.grate, files: bookFileArray, isForChildren:values.isForChildren, navigator, setProgress  }))
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

    function coverInputHandleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            setIsSelectedCover(true)
            formik.setFieldValue('cover', e.target.files[0]);
        }
    }

    function chooseCoverHandler() {
        coverInputElm.current.click()
    }

    function clearCoverInput() {
        setIsSelectedCover(false)
        setCoverUrl('')
        formik.setFieldValue('cover', '');
        coverInputElm.current.value = ''
        coverInputElm.current.type = ''
        coverInputElm.current.type = 'file'
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

    function addNewBookFileHandler() {
        if (!bookGroupInput || bookGroupInput > 100 || bookGroupInput < 0) {
            return toast.error('لطفا یک شماره دسته بین 1 تا 100 برای فایل مشخص کنید.')
        }

        if (!bookNameInput) {
            return toast.error('لطفا یک عنوان برای فایل مشخص کنید.')
        }

        if (!bookFileInputElm.current.files || !bookFileInputElm.current.files[0]) {
            return toast.error('لطفا یک فایل برای کتاب آپلود کنید.')
        }

        const file = bookFileInputElm.current.files[0]
        const isValid = ['pdf', 'zip'].includes(file?.name?.split('.').pop())
        if (!isValid) {
            return toast.error('فقط فرمت pdf و zip مجاز است.')
        }

        if (file?.size > 200000000) {
            return toast.error(`حجم فایل آپلود شده نباید از 200 مگابایت بیشتر باشد.`)
        }

        if (!bookTypeInput) {
            return toast.error('لطفا یک مشخصه برای فایل مشخص کنید.')
        }

        setBookFileArray(prevValue => [...prevValue, { group: bookGroupInput, fileName: `${userInfo.id}___${Date.now()}___${file.name}`, name: bookNameInput, file, type: file?.name?.split('.').pop(), fileType: bookTypeInput, isNew: true }])
        setBookNameInput('')
        setBookGroupArray(prevValue => new Set([...prevValue, bookGroupInput]))
        setBookGroupInput('')
        setBookTypeInput('')
        bookFileInputElm.current.value = ''
        bookFileInputElm.current.type = ''
        bookFileInputElm.current.type = 'file'
    }

    function removeBookFileHandler(fileName) {
        setDeletedFileArray(prev => [...prev, fileName])
        setBookFileArray(prevValue => prevValue.filter(file => file.fileName !== fileName))
    }

    return (
        <>
            {id && !isBookExist ? (
                <div className='w-full h-full flex items-center justify-center'>
                    <h4 className='text-red-500 font-bold'>موردی یافت نشد!</h4>
                </div>
            ) : (
                <div>
                    <h3 className='page-title'>{id ? 'ویرایش مجموعه کتاب' : 'ایجاد مجموعه کتاب'}</h3>
                    <form className='mb-4' onSubmit={formik.handleSubmit}>
                        <div className="form-btn-group">
                            <label htmlFor="create-book-input-1" className="form-label">عنوان مجموعه:</label>
                            <input
                                type="text"
                                name='name'
                                placeholder="عنوان مجموعه را وارد کنید..."
                                className="form-input" id="create-book-input-1"
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
                            <label htmlFor="create-book-input-8" className="form-label">slug مجموعه:</label>
                            <input
                                type="text"
                                name='slug'
                                placeholder="slug مجموعه را وارد کنید..."
                                className="form-input" id="create-book-input-8"
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
                            <label htmlFor="create-book-input-13" className="form-label">رده سنی:</label>
                            <input
                                type="text"
                                name='ageGrate'
                                placeholder="نوجوانان، 12 تا 18 سال، زیر 8 سال، ..."
                                className="form-input" id="create-book-input-13"
                                value={formik.values.ageGrate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.ageGrate && formik.errors.ageGrate ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.ageGrate} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group">
                            <label htmlFor="create-book-input-14" className="form-label">سطح کلی:</label>
                            <input
                                type="text"
                                name='grate'
                                placeholder="مقدماتی، متوسط، پیشرفته، ..."
                                className="form-input" id="create-book-input-14"
                                value={formik.values.grate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.grate && formik.errors.grate ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.grate} />
                                </div>
                            ) : null}
                        </div>

                        <div className="form-btn-group py-3 rounded-lg bg-[#d6f1f3]">
                            <label htmlFor="create-article-input-5" className="form-label">تگ های مجموعه را وارد کنید:</label>
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
                            <div className='w-full md:flex items-end justify-center gap-2'>
                                <div className='w-full grid md:grid-cols-2 gap-x-2 gap-y-2'>
                                    <div>
                                        <label htmlFor="create-book-input-6" className="form-label">زیرموضوعات مجموعه:</label>
                                        <input
                                            type="text"
                                            // name='tags'
                                            placeholder="زیرموضوعات مقاله را وارد کنید..."
                                            className="form-input mt-1" id="create-book-input-6"
                                            value={subtitleInput}
                                            onChange={e => setSubtitleInput(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="create-book-input-7" className="form-label">آی دی:</label>
                                        <input
                                            type="text"
                                            // name='tags'
                                            placeholder="آی دی مربوط به زیر موضوع را وارد کنید..."
                                            className="form-input mt-1" id="create-book-input-7"
                                            value={subtitleIdInput}
                                            onChange={e => setSubtitleIdInput(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button onClick={addNewSubtitleHandler} className='rounded-lg bg-main-color text-white px-4 !py-2 border border-solid border-main-color max-md:w-full max-md:my-2 max-md:text-sm hover:bg-main-color/80'>افزودن</button>
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
                            <label htmlFor="create-book-input-2" className="form-label">توضیحات کوتاه:</label>
                            <textarea
                                type="text"
                                name='shortDescription'
                                placeholder="یک چکیده درباره مجموعه بنویسید..."
                                className="form-input min-h-[200px]" id="create-book-input-2"
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
                            <label htmlFor="create-book-input-3" className="form-label">توضیحات کامل مجموعه(به فرم HTML):</label>
                            <textarea
                                type="text"
                                name='longDescription'
                                placeholder="توضیحات کامل را در مورد مجموعه بنویسید..."
                                className="form-input min-h-[400px]" id="create-book-input-3"
                                value={formik.values.longDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.longDescription && formik.errors.longDescription ? (
                                <div className="w-full text-start">
                                    <FormErrorMsg msg={formik.errors.longDescription} />
                                </div>
                            ) : null}
                        </div>

                        <div className="py-3 rounded-lg bg-[#d6f1f3] mb-3">
                            <div className='w-full md:flex items-end justify-center gap-2'>
                                <div className='w-full grid lg:grid-cols-5 md:grid-cols-4 gap-x-2 gap-y-2'>
                                    <div>
                                        <label htmlFor="create-book-input-12" className="form-label">گروه فایل:</label>
                                        <input
                                            type="text"

                                            list='createBook-group-list'
                                            placeholder="یک عنوان، جهت تضخیص گروه فایل ها وارد کنید..."
                                            className="form-input mt-1" id="create-book-input-12"
                                            value={bookGroupInput}
                                            onChange={e => setBookGroupInput(e.target.value)}
                                        />
                                        <datalist id='createBook-group-list'>
                                            {[...bookGroupArray].map((group, index) => (
                                                <option key={index} value={group} />
                                            ))}
                                        </datalist>
                                    </div>
                                    <div>
                                        <label htmlFor="create-book-input-14" className="form-label">نوع فایل:</label>
                                        <select name="types" className='form-input mt-1' id="create-book-input-14" value={''} onChange={(e) => setBookTypeInput(e.target.value)}>
                                            <option value="">یک مورد را انتخاب کنید.</option>
                                            <option value="book">کتاب اصلی</option>
                                            <option value="workbook">کتاب کار</option>
                                            <option value="bookSound">صوت کتاب اصلی</option>
                                            <option value="workbookSound">صوت کتاب کار</option>
                                            <option value="teacherBook">کتاب معلم</option>
                                            <option value="videos">ویدئو ها</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="create-book-input-10" className="form-label">عنوان فایل:</label>
                                        <input
                                            type="text"
                                            // name='tags'
                                            placeholder="عنوان فایل را وارد کنید..."
                                            className="form-input mt-1" id="create-book-input-10"
                                            value={bookNameInput}
                                            onChange={e => setBookNameInput(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="create-book-input-11" className="form-label">فایل:</label>
                                        <input
                                            id="create-book-input-11"
                                            type="file"
                                            ref={bookFileInputElm}
                                            className="hidden"
                                            rows={3}
                                        />
                                        <label htmlFor="create-book-input-11" className='cursor-pointer flex flex-nowrap items-center justify-between mt-1 w-full max-w-[200px] form-input !px-1 !bg-neutral-500'>
                                            <HiOutlineUpload size={20} color="#fff" />
                                            <span>choose file</span>
                                        </label>
                                    </div>
                                </div>

                                <button onClick={addNewBookFileHandler} type='button' className='rounded-lg bg-main-color text-white px-4 !py-2 border border-solid border-main-color max-md:w-full max-md:my-2 max-md:text-sm hover:bg-main-color/80'>افزودن</button>
                            </div>


                            <div className='mt-2 flex flex-wrap flex-col w-full justify-center items-start'>
                                {bookFileArray.map((bookFile, index) =>
                                (
                                    <div key={index} className={`flex justify-between items-center gap-x-3  w-[100%] max-w-[400px] p-3 border border-2 border-slate-200 rounded-2xl overflow-hidden  ${bookFile.type === 'pdf' ? 'bg-pdf' : 'bg-zip'}`}>
                                        <MdClose size={40} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" onClick={() => removeBookFileHandler(bookFile.fileName)} />
                                        <div className="flex-1 flex flex-col items-start justify-start" dir="ltr">
                                            <p className="truncate max-w-[268px] font-semibold">{bookFile.name}</p>
                                            <span className='my-auto text-[10px] text-gray-700'>{bookFile.group}</span>
                                        </div>
                                        {bookFile.type === 'pdf' && (<FaFilePdf size={40} color="#ff2323" />)}
                                        {bookFile.type === 'zip' && (<FaFileZipper size={40} color="#d66b12" />)}
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className='form-btn-group'>
                            <input
                                id="create-book-input-4"
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

                                        <label htmlFor="create-book-input-4" className="form-label w-full text-center">کاور مجموعه (حداکثر 2 مگابایت)</label>
                                        {formik.touched.cover && formik.errors.cover ? (
                                            <div className="w-full text-center">
                                                <FormErrorMsg msg={formik.errors.cover} />
                                            </div>
                                        ) : null}
                                    </>
                                )}

                        </div>

                        <div className='flex items-center gap-x-2 mb-3'>
                            <input
                                name='isForChildren'
                                type="checkbox"
                                id='isForChildrenCheckbox'
                                className='w-[20px] h-[20px]'
                                onChange={formik.handleChange}
                                value={formik.values.isForChildren}
                                checked={formik.values.isForChildren}
                            />

                            <label htmlFor="isPublishedCheckbox" className='text-main-color'>کتاب مخصوص کودکان</label>
                        </div>


                        <div className="grid md:grid-cols-2 gap-x-2 gap-y-2">
                            {
                                isLoading ? (
                                    <button  className='form-submit !py-2 block w-full text-center !text-black !bg-gray-400'>بازگشت</button>
                                ) : (
                                    <Link to='/books-collection' className="form-submit !py-2 block w-full text-center !text-black !bg-gray-200 hover:!bg-gray-400">بازگشت</Link>
                                )
                            }
                            <input type="submit" disabled={isLoading} value={id ? 'ویرایش مجموعه' : 'افزودن مجموعه'}
                                className="form-submit !py-2 block w-full hover:opacity-70 transition-all" />
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
