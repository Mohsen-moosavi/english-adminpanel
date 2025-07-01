import { useEffect, useRef, useState } from "react"
import { FaImage } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { HiOutlineUpload } from "react-icons/hi";
import { LuUpload } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import FormErrorMsg from "../components/modules/FormErrorMessag";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../components/modules/DataTable";
import { deleteExtraFile, getExtraFile, getExtraFileAfterStatusChanging, setArticlesStatus, setBooksStatus, setCoursesStatus, setExtrafiles, setOffset, uploadExtraFile } from "../redux/features/extrafileSlice";
import { ImSpinner3 } from "react-icons/im";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

function Extrafile() {

    const { extrafiles, extrafilesCount, gettingFiles, changingStatus, isLoading, offset, limit, books, courses, articles } = useSelector(state => state.extrafileData)
    const dispatch = useDispatch()


    const fileInputElm = useRef()
    const [extrafileValue, setExtraFileValue] = useState()
    const [extrafileInputError, setExtraFileInputError] = useState()



    const isInitialized = useRef(false)
    useEffect(() => {
        if (!isInitialized.current) {
            isInitialized.current = true;
            dispatch(getExtraFile({ offset, limit, articles, books, courses }))
        }

        return ()=>{
            dispatch(setOffset(0))
            dispatch(setExtrafiles([]))
        }
    }, [])

    const [isStateInitialized, setIsStateInitialized] = useState(false)
    useEffect(() => {
        if (isStateInitialized) {
            dispatch(getExtraFileAfterStatusChanging({ offset, limit, articles, books, courses }))
        } else {
            setIsStateInitialized(true)
        }
    }, [books, articles, courses])

    function fileInputHandleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
                return setExtraFileInputError('فقط فرمت های png و jpg و jpeg مجاز است!')
            }
            if (file.size > 200 * 1024) {
                return setExtraFileInputError('حجم فایل آپلود شده نباید بیشتر از 200 کیلوبایت باشد!')
            }
            setExtraFileInputError(null)
            setExtraFileValue(e.target.files[0]);
        }
    }

    function chooseFileHandler() {
        fileInputElm.current.click()
    }

    function clearFileInput() {
        if (isLoading) {
            return;
        }
        setExtraFileValue(null);
        fileInputElm.current.value = ''
        fileInputElm.current.type = ''
        fileInputElm.current.type = 'file'
    }

    async function uploadFileHandler() {
        if (isLoading) {
            return;
        }

        Swal.fire({
            title: `آیا از آپلود فایل اطمینان دارید؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'تایید',
            cancelButtonText: 'لغو',
        }).then(result => {
            if (result.isConfirmed) {
                return dispatch(uploadExtraFile({ offset, limit, articles, books, courses, file: extrafileValue }))
            }
        }).then((dispatchResult) => {
            if ((dispatchResult.meta.requestStatus = 'fulfilled') && !dispatchResult.type.endsWith('rejected')) {
                setExtraFileValue(null)
                fileInputElm.current.value = ''
                fileInputElm.current.type = ''
                fileInputElm.current.type = 'file'
            }
        })
    }

    function getMoreExtrafilesHandler() {
        dispatch(getExtraFile({ offset, limit, articles, books, courses }))
    }

    function deleteExtrafilesHandler(id) {
        Swal.fire({
            title: `آیا از حذف فایل اطمینان دارید؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'تایید',
            cancelButtonText: 'لغو',
        }).then(result => {
            if (result.isConfirmed) {
                dispatch(deleteExtraFile({ offset, limit, articles, books, courses, id }))
            }
        })
    }

    function seeExtrafilesHandler(link) {
        Swal.fire({
            html: `
    <div class='see-extrafile-modal'>
        <img src=${link} alt="extra image" />
        <p>${link}</p>
    </div>
    `,
            confirmButtonText: 'بستن',
        })
    }

    async function copyLink(link) {
        try {
            await navigator.clipboard.writeText(link)
            toast.success("متن کپی شد.")
        } catch (error) {
            toast.error("متن کپی نشد!")
        }
    }


    return (
        <div>
            <h4 className='page-title !mb-3'>آپلود تصویر</h4>
            <div className='form-btn-group'>
                <input
                    id="upload-extrafile-input-1"
                    type="file"
                    ref={fileInputElm}
                    onChange={fileInputHandleChange}
                    className="hidden"
                    rows={3}
                />

                {!extrafileValue ? (
                    <div onClick={chooseFileHandler} className="cursor-pointer flex flex-col justify-center gap-y-4 items-center w-[100%] max-w-[400px] p-8 mt-4 mx-auto rounded-2xl bg-white border-4 border-slate-300 border-dashed">
                        <HiOutlineUpload size={50} color="#475569" className="rounded-full bg-slate-200 p-3" />
                        <span className="text-slate-600 text-lg font-semibold">آپلود فایل</span>
                    </div>
                ) : (

                    <>
                        <div className="cursor-pointer flex flex-col justify-center gap-y-2 items-center w-[100%] max-w-[400px] p-4 mt-4 mx-auto rounded-2xl bg-[#cceaff] border-4 border-slate-300 border-dashed">
                            <FaImage size={80} color="#4894da" />
                            <div className="flex items-center justify-center gap-x-2">
                                <MdClose size={40} color="#fff" className="cursor-pointer rounded-full bg-red-400 p-3" onClick={clearFileInput} />
                                <LuUpload size={40} color="#fff" className="cursor-pointer rounded-full bg-main-color p-3" onClick={uploadFileHandler} />
                            </div>
                        </div>
                    </>
                )}

                <label htmlFor="upload-extrafile-input-1" className="form-label w-full text-center">حداکثر 200 کیلوبایت</label>
                {extrafileInputError ? (
                    <div className="w-full text-center">
                        <FormErrorMsg msg={extrafileInputError} />
                    </div>
                ) : null}

            </div>

            <h3 className='page-title !mt-10'>لیست تصاویر</h3>



            {!extrafiles.length && !books && !courses && !articles ?
                (
                    <div className='text-center'>
                        <h5 className='text-red-400 text-lg'>هنوز موردی وجود ندارد!</h5>
                    </div>
                ) :
                (<>
                    <DataTable>
                        <thead>
                            <tr>
                                <th>شماره</th>
                                <th>لینک</th>
                                <th>
                                    <select className='bg-transparent' value={books} onChange={e => dispatch(setBooksStatus(e.target.value))}>
                                        <option value="">استفاده در کتاب</option>
                                        <option value="has">استفاده شده در کتاب</option>
                                        <option value="not">بدون استفاده در کتاب</option>
                                    </select>
                                </th>
                                <th>
                                    <select className='bg-transparent' value={courses} onChange={e => dispatch(setCoursesStatus(e.target.value))}>
                                        <option value="">استفاده در دوره</option>
                                        <option value="has">استفاده شده در دوره</option>
                                        <option value="not">بدون استفاده در دوره</option>
                                    </select>
                                </th>
                                <th>
                                    <select className='bg-transparent' value={articles} onChange={e => dispatch(setArticlesStatus(e.target.value))}>
                                        <option value="">استفاده در مقاله</option>
                                        <option value="has">استفاده شده در مقاله</option>
                                        <option value="not">بدون استفاده در مقاله</option>
                                    </select>
                                </th>
                                <th>مشاهده</th>
                                <th>حذف</th>
                                <th>پیش نمایش</th>
                            </tr>
                        </thead>
                        {extrafiles.length ? (
                            <>
                                <tbody>
                                    {changingStatus ? (
                                        <tr>
                                            <td colSpan={8}>
                                                <div className="text-center py-10">
                                                    <ImSpinner3 color='#0e4b50' size={40} className='animate-[spin_2s_linear_infinite] mx-auto' />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <>
                                            {extrafiles.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>
                                                        <button className="py-1 px-2 rounded-lg text-white bg-sky-500" onClick={() => copyLink(item.link)}>
                                                            کپی کردن لینک
                                                        </button>
                                                    </td>
                                                    <td className={item.books === 0 ? 'text-red-400' : `text-green-400`}>{item.books === 0 ? 'استفاده نشده' : `${item.books} مرتبه`}</td>
                                                    <td className={item.courses === 0 ? 'text-red-400' : `text-green-400`}>{item.courses === 0 ? 'استفاده نشده' : `${item.courses} مرتبه`}</td>
                                                    <td className={item.articles === 0 ? 'text-red-400' : `text-green-400`}>{item.articles === 0 ? 'استفاده نشده' : `${item.articles} مرتبه`}</td>
                                                    <td>
                                                        <button className="py-1 px-2 rounded-lg text-white bg-green-500" onClick={() => seeExtrafilesHandler(item.link)}>
                                                            مشاهده
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="py-1 px-2 rounded-lg text-white bg-red-500" onClick={() => deleteExtrafilesHandler(item.id)}>
                                                            حذف
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <img className="max-w-[200px] mx-auto" src={item.link} alt="image" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </tbody>
                            </>
                        ) : null}
                    </DataTable>

                    {(((extrafilesCount - offset) > 0) && !changingStatus) ? (
                        <div className="text-center my-5">
                            <button className="bg-main-color rounded-lg p-2 min-w-[107px] hover:opacity-70" onClick={getMoreExtrafilesHandler}>
                                {gettingFiles ? (
                                    <ImSpinner3 size={20} color='#fff' className='my-1 mx-auto animate-[spin_2s_linear_infinite]' />
                                ) :
                                    (<span className="text-white">مشاهده بیشتر</span>)}
                            </button>
                        </div>
                    ) : null}


                    {extrafiles.length ? null : (
                        <div className='text-center my-10'>
                            <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
                        </div>
                    )}
                </>)}
        </div>
    )
}

export default Extrafile
