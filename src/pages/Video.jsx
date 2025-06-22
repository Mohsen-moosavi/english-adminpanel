import { useEffect, useRef, useState } from 'react'
import { FaLongArrowAltRight, FaPhotoVideo, FaTrashAlt } from 'react-icons/fa'
import { HiOutlineUpload } from 'react-icons/hi'
import { MdVideoLibrary } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { updateVideo } from '../redux/features/courseSlice'
import toast from 'react-hot-toast'

export default function Video() {

    const { isLoading } = useSelector(state => state.courseData)
    const { userInfo } = useSelector(state => state.userData)

    const location = useLocation()
    const {id} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isInitialised = useRef(false)
    const fileInputElm = useRef()
    const [video, setVideo] = useState(location.state?.video)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!isInitialised.current) {
            isInitialised.current = true
            if (!location.state?.cover || !location.state?.video) {
                navigate('/courses')
            }
        }
    }, [])

    function deleteVideoHandler() {
        setVideo('')
    }

    function fileInputClickHandler() {
        if (!isLoading) {
            fileInputElm.current.click()
        }
    }

    function videoSelectedHandler(e) {
        const file = e.target.files[0]
        if(!file){
            return
        }
        if(!['mp4'].includes(file?.name?.split('.').pop())){
            return toast.error("فقط فرمت mp4 مجاز است.")
        }
        if(file.size > 300 * 1024 * 1024){
            return toast.error('حجم فایل آپلود شده نباید از 300 مگابایت بیشتر باشد.')
        }
        dispatch(updateVideo({id,video : file,filename : `${userInfo.id}___${Date.now()}___${file.name}`,prevLink : location.state?.video,setProgress,setVideo,navigator:navigate}))
    }

    return (
        <div>
            <div className='inline-block'>
                <Link to={-1} className='flex items-center gap-x-2 text-main-color font-bold hover:text-secound-color'>
                    <FaLongArrowAltRight size={20}></FaLongArrowAltRight>
                    <span>بازگشت</span>
                </Link>
            </div>

            {(video && (progress === 0)) ? (
                <div className='relative mt-5 max-w-[400px] w-full mx-auto'>
                    <video className='w-full rounded-xl border-4 border-main-color' src={video} poster={location.state?.cover} controls>
                    </video>
                    <button className='absolute top-5 right-5 p-3 text-white rounded-full bg-red-600' onClick={deleteVideoHandler}>
                        <FaTrashAlt></FaTrashAlt>
                    </button>
                </div>
            ) : (
                <>
                    <input
                        id="create-course-input-4"
                        type="file"
                        ref={fileInputElm}
                        onChange={videoSelectedHandler}
                        className="hidden"
                        rows={3}
                    />
                    <div className="cursor-pointer flex flex-col justify-center gap-y-4 items-center md:w-[70%] w-[full] p-8 mt-4 mx-auto rounded-2xl bg-blue-100 border-4 border-main-color border-dashed">
                        <FaPhotoVideo size={150} color='#0e4b50'></FaPhotoVideo>
                        {(progress !== 0) ? (
                            <div className='w-full text-center'>
                                <span className='font-black text-gray-600'>درحال آپلود</span>
                                <div className='my-3 w-full'>
                                    <div className='rounded-2xl h-[25px] overflow-hidden bg-gray-300'>
                                        <div className='h-[25px] bg-main-color rounded-2xl text-white text-end pl-1 leading-[25px]' style={{ width: `${progress}%` }}>{`${progress.toFixed(0)}%`}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                            <div className="rounded-full bg-blue-300 p-3 max-w-[400px] w-[90%] text-center text-main-color text-lg font-semibold flex items-center justify-center gap-x-3" onClick={fileInputClickHandler}>
                                <span>آپلود فایل</span>
                                <MdVideoLibrary size={30}></MdVideoLibrary>
                            </div>
                            <HiOutlineUpload size={60} color="#0e4b50" className="rounded-full p-3 shadow-shadow-inset shadow-blue-300" />
                            </>
                        )}
                    </div>
                </>
            )}
            <div></div>
        </div>
    )
}
