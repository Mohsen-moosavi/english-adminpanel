import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import FormErrorMsg from '../modules/FormErrorMessag';
import { MdClose, MdDownload } from 'react-icons/md';
import { HiOutlineUpload } from 'react-icons/hi';
import { FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Progress from '../modules/Progress';
import { useDispatch, useSelector } from 'react-redux';
import { updateDetails, updateDetailsWithoutFile } from '../../redux/features/sessionSlice';


export default function SessionDetailsForm({ videoDetails }) {

    const fileInputElm = useRef()
    const dispatch = useDispatch()
    const [isSelectedFile,setisSelectedFile] = useState()
    const [chooseNewFile , setChooseNewFile] = useState(!videoDetails?.file)
    const [sessionDetails,setSessionDetails] = useState(null)
    const [progress, setProgress] = useState(0)
    const { isLoading } = useSelector(state => state.sessionData)
    const { userInfo } = useSelector(state => state.userData)
    

    const FormValidation = Yup.object({
        name: Yup.string().required("لطفا عنوان جلسه را وارد کنید!.").min(3, "عنوان وارد شده باید حداقل 3 کاراکتر باشد."),
        file: Yup.mixed()
            .test({
                message: 'فقط فرمت zip و rar مجاز است.',
                test: (file, context) => {
                    if(!file){
                        return true
                    }
                    const isValid = ['zip', 'rar'].includes(file?.name?.split('.').pop());
                    if (!isValid) context?.createError();
                    return isValid;
                }
            })
            .test({
                message: `حجم فایل آپلود شده نباید از 10 کیلوبایت بیشتر باشد.`,
                test: (file) => {
                    if(!file){
                        return true
                    }
                    const isValid = file?.size < 10 * 1024 * 1024;
                    return isValid;
                }
            })
            .optional(),
        isFree: Yup.boolean().required("مقدار وارد شده معتبر نمی باشد.")
    });
    const formik = useFormik({
        initialValues: {
            name: videoDetails?.name,
            file: '',
            isFree: videoDetails?.isFree ? true : false
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {
            if(values.file){
                dispatch(updateDetails({ file : values.file ,fileName : `${userInfo.id}___${Date.now()}___${values.file.name}`,sessionId : videoDetails.id,name : values.name,isFree : values.isFree ? 1 : 0,setProgress,setSessionDetails,setChooseNewFile}))
            }else{
                dispatch(updateDetailsWithoutFile({sessionId : videoDetails.id,name : values.name,isFree : values.isFree, setSessionDetails}))
            }
            // dispatch(c({ name: values.name, shortDescription: values.shortDescription, longDescription: values.longDescription, cover: values.cover, video: values.video, videoName: `${userInfo.id}___${Date.now()}___${values.video.name}`, price: values.price, slug: values.slug, bookFileGroup: values.bookFileGroup, bookCollectionId: values.bookCollectionId, teacher: values.teacherId, levelId: values.levelId, tags: tagArray, setProgress, navigator: navigate }))
        },
    });

    useEffect(()=>{
        setisSelectedFile(false)
        formik.setFieldValue('file', '');
        fileInputElm.current.value = ''
        fileInputElm.current.type = ''
        fileInputElm.current.type = 'file'
    } , [chooseNewFile])

    function fileInputHandleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            setisSelectedFile(true)
            formik.setFieldValue('file', e.target.files[0]);
        }
    }

    function clearFileInput() {
        setisSelectedFile(false)
        formik.setFieldValue('file', '');
        fileInputElm.current.value = ''
        fileInputElm.current.type = ''
        fileInputElm.current.type = 'file'
    }
    function clearPrevFileInput(){
        setChooseNewFile(true)
    }

    function chooseFileHandler() {
        fileInputElm.current.click()
    }

    return (
        <form className='mb-4' onSubmit={formik.handleSubmit}>
            <h4 className='page-subtitle mt-14'>اطلاعات جلسه</h4>
            <div className='grid md:grid-cols-2 gap-x-3'>
                <div className="form-btn-group">
                    <label htmlFor="session-deatils-input-1" className="form-label">عنوان دوره:</label>
                    <input
                        type="text"
                        name='name'
                        placeholder="عنوان جلسه را وارد کنید..."
                        className="form-input" id="session-deatils-input-1"
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
                    <label htmlFor="session-deatils-input-2" className="form-label">وضعیت دوره:</label>
                    <select
                    type="text"
                    name='isFree'
                    placeholder="slug دوره را وارد کنید..."
                    className="form-input" id="session-deatils-input-2"
                    value={formik.values.isFree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    >
                        <option value={false}>غیر رایگان</option>
                        <option value={true}>رایگان</option>
                    </select>
                    {formik.touched.isFree && formik.errors.isFree ? (
                        <div className="w-full text-start">
                            <FormErrorMsg msg={formik.errors.isFree} />
                        </div>
                    ) : null}
                </div>
            </div>

            <div>
                <div className='form-btn-group'>
                    <input
                        id="create-course-input-4"
                        type="file"
                        ref={fileInputElm}
                        onChange={fileInputHandleChange}
                        className="hidden"
                        rows={3}
                    />

                    {(!chooseNewFile && (videoDetails?.file || sessionDetails?.file)) ? (
                        <div className="flex justify-between items-center gap-x-3  w-[100%] max-w-[400px] mx-auto p-3 bg-white border border-2 border-slate-200 rounded-md">
                            <MdClose size={40} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" onClick={clearPrevFileInput} />
                            <a href={sessionDetails?.file ? sessionDetails?.file : videoDetails?.file}>
                                <MdDownload size={40} color="#475569" className="cursor-pointer rounded-full bg-slate-200 p-3" />
                            </a>
                            <div className="flex-1 flex justify-start" dir="ltr">
                                <p className="truncate max-w-[268px] font-semibold">فایل پیوست</p>
                            </div>
                            <FiFileText size={40} color="#475569" />
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
                                            <p className="truncate max-w-[268px] font-semibold">{formik.values.file?.name || formik.values.name || "fileName"}</p>
                                        </div>
                                        <FiFileText size={40} color="#475569" />
                                    </div>
                                )}


                                <label htmlFor="create-course-input-4" className="form-label w-full text-center">فایل پیوست(حداکثر 10 مگابایت)</label>
                                {formik.errors.file ? (
                                    <div className="w-full text-center">
                                        <FormErrorMsg msg={formik.errors.file} />
                                    </div>
                                ) : null}
                            </>
                        )}

                </div>

            </div>

            <input type="submit" disabled={isLoading} value={'ویرایش اطلاعات'}
                className={`form-submit !py-2 block w-full hover:opacity-70 transition-all ${isLoading ? 'opacity-60' : ''}`} />



            {(progress !== 0 && progress !== 100) && (
                <Progress progress={progress} />
            )}
        </form>
    )
}
