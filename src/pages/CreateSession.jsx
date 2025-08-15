import { useEffect, useRef, useState } from 'react'
import { FaLongArrowAltRight, FaPhotoVideo, FaTrashAlt } from 'react-icons/fa'
import { HiOutlineUpload } from 'react-icons/hi'
import { MdVideoLibrary } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getSingleSession, updateVideo, uploadVideo } from '../redux/features/sessionSlice'
import { RiFolderVideoFill } from 'react-icons/ri'
import SessionDetailsForm from '../components/templates/SessionDetailsForm'
import { ImSpinner6 } from 'react-icons/im'

export default function CreateSession() {

    const { id, sessionId } = useParams()
    const isInitialised = useRef(false)
    const { isLoading } = useSelector(state => state.sessionData)
    const location = useLocation()
    const dispatch = useDispatch()
    const [video, setVideo] = useState(location.state?.video)
    const [progress, setProgress] = useState(0)
    const [videoFile, setVideoFile] = useState()
    const fileInputElm = useRef()
    const [videoDetails, setVideoDetails] = useState()
    const { userInfo } = useSelector(state => state.userData)
    


    useEffect(() => {
        if (sessionId && !isInitialised.current) {
            isInitialised.current = true
            dispatch(getSingleSession({ id: sessionId, setVideo, setVideoDetails }))
        }
    }, [])

    function videoSelectedHandler() {
        if (!videoFile) {
            return
        }
        if (!['mp4', 'mkv'].includes(videoFile?.name?.split('.').pop())) {
            return toast.error("فقط فرمت mp4 و mkv مجاز است.")
        }
        if (videoFile.size > 600 * 1024 * 1024) {
            return toast.error('حجم فایل آپلود شده نباید از 600 مگابایت بیشتر باشد.')
        }

        if (!videoDetails) {
            const videoDuc = document.createElement('video')
            videoDuc.preload = 'metadata';
            videoDuc.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoDuc.src)
                const time = `${Math.floor(videoDuc.duration / 60)}:${Math.floor(videoDuc.duration) % 60}`
                dispatch(uploadVideo({ video: videoFile, videoName: `${userInfo.id}___${Date.now()}___${videoFile.name}`, courseId: id, time, setProgress, setVideo, setVideoDetails }))
            }
            videoDuc.src = URL.createObjectURL(videoFile)
        }else{
            const videoDuc = document.createElement('video')
            videoDuc.preload = 'metadata';
            videoDuc.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoDuc.src)
                const time = `${Math.floor(videoDuc.duration / 60)}:${Math.floor(videoDuc.duration) % 60}`
                dispatch(updateVideo({ video: videoFile, videoName: `${userInfo.id}___${Date.now()}___${videoFile.name}`, sessionId, time, setProgress, setVideo, setVideoDetails }))
            }
            videoDuc.src = URL.createObjectURL(videoFile)
        }
    }


    function fileInputClickHandler() {
        if (!isLoading) {
            fileInputElm.current.click()
        }
    }

    function deletedVideoHandler() {
        setVideo(null)
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
                    <video className='w-full rounded-xl border-4 border-main-color' src={video} controls>
                    </video>
                    <button className='absolute top-5 right-5 p-3 text-white rounded-full bg-red-600' onClick={deletedVideoHandler}>
                        <FaTrashAlt></FaTrashAlt>
                    </button>
                </div>
            ) : (
                <>
                    {(sessionId && !videoDetails) ? (
                        <>
                            <div className='flex justify-center'>
                                <ImSpinner6 size={50} color='#56abc9' className='animate-[spin_2s_linear_infinite]' />
                            </div>
                        </>) : (
                        <>
                            <input
                                id="create-course-input-4"
                                type="file"
                                ref={fileInputElm}
                                onChange={(e) => setVideoFile(e.target.files[0])}
                                className="hidden"
                                rows={3}
                            />
                            <div className="flex flex-col justify-center gap-y-4 items-center md:w-[70%] w-[full] p-8 mt-4 mx-auto rounded-2xl bg-blue-100 border-4 border-main-color border-dashed">
                                {videoFile ? (
                                    <RiFolderVideoFill size={150} color='#0e4b50' />
                                ) : (
                                    <FaPhotoVideo size={150} color='#0e4b50'></FaPhotoVideo>
                                )}
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
                                        <div className="cursor-pointer rounded-full bg-blue-300 p-3 max-w-[400px] w-[90%] text-center text-main-color text-lg font-semibold flex items-center justify-center gap-x-3" onClick={fileInputClickHandler}>
                                            <span>آپلود فایل</span>
                                            <MdVideoLibrary size={30}></MdVideoLibrary>
                                        </div>
                                        <HiOutlineUpload size={60} color="#0e4b50" className={`rounded-full p-3 ${videoFile ? 'shadow-shadow transition-all animate-[zoomAnimation_2s_linear_infinite] cursor-pointer' : 'shadow-shadow-inset'} transition-all shadow-blue-300`} onClick={videoSelectedHandler} />
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}

            {videoDetails ? (
                <SessionDetailsForm videoDetails={videoDetails} />
            ) : null}
        </div>
    )
}
