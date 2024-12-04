import React from 'react'
import user from './../../assets/user.jpg'
import { FaBars } from 'react-icons/fa6'

export default function Header() {
    return (
        <div class="flex justify-between items-center my-3 text-main-color font-bold max-md:text-xs">
            <div className='flex items-center gap-x-3'>
                <label htmlFor='sidebar-btn' className="max-md:flex hidden bg-main-color items-center justify-center h-[35px] w-[35px] md:h-[45px] md:w-[45px] rounded-xl shadow-shadow cursor-pointer" >
                    <FaBars className='text-white' />
                </label>
                <h1 className='max-sm:hidden'>به پنل مدیریت خوش آمدید</h1>
            </div>
            <div class="flex justify-end items-center gap-x-2 md:gap-x-5">
                <div class="flex flex-col justify-center items-end">
                    <span>سید محسن موسوی ساعی</span>
                    <span>ADMIN</span>
                </div>
                <img src={user} class="w-[35px] md:w-[50px] rounded-full" alt="user" />
            </div>
        </div>
    )
}
