import { FaBars } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import userProfile from './../../assets/user-profile.png'

export default function Header() {

    const {userInfo} = useSelector(state=>state.userData)

    return (
        <div className="flex justify-between items-center my-3 text-main-color font-bold max-md:text-xs">
            <div className='flex items-center gap-x-3'>
                <label htmlFor='sidebar-btn' className="max-md:flex hidden bg-main-color items-center justify-center h-[35px] w-[35px] md:h-[45px] md:w-[45px] rounded-xl shadow-shadow cursor-pointer" >
                    <FaBars className='text-white' />
                </label>
                <h1 className='max-sm:hidden'>به پنل مدیریت خوش آمدید</h1>
            </div>
            <div className="flex justify-end items-center gap-x-2 md:gap-x-5">
                <div className="flex flex-col justify-center items-end">
                    <span>{userInfo.name}</span>
                    <span>{userInfo['role.name']}</span>
                </div>
                <div className='flex items-center justify-center overflow-hidden w-[35px] md:w-[50px] h-[35px] md:h-[50px] border-2 border-main-color rounded-full'>
                    {userInfo.avatar ? (
                        <img src={userInfo?.avatar} className="w-[35px] md:w-[50px] rounded-full" alt="user" />
                    ) : (
                        <img src={userProfile} className="w-[35px] md:w-[50px] rounded-full" alt="user" />
                    )}
                </div>
            </div>
        </div>
    )
}
