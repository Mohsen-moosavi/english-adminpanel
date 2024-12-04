import React, { useRef } from 'react'
import logoImg from './../../assets/logo2.png'
import { Link } from 'react-router-dom'
import { BsChatLeftTextFill, BsHouseGearFill, BsTicketPerforatedFill } from 'react-icons/bs'
import { FaBasketShopping, FaUser } from 'react-icons/fa6'
import { IoCloseCircleSharp } from 'react-icons/io5'

export default function Sidebar() {

    const sidebarContainer = useRef()
    const sidebarContent = useRef()

    function sidebarHandler(event){
        if(event.target.checked){
            sidebarContainer.current.classList.add("max-md:!w-[250px]");
            sidebarContent.current.classList.add("max-md:px-5");
        }else{
            sidebarContainer.current.classList.remove("max-md:!w-[250px]");
            sidebarContent.current.classList.remove("max-md:px-5");
        }
    }

  return (
    <div ref={sidebarContainer} class="bg-main-color max-md:w-0 min-md:w-[250px] rounded-r-xl relative transition-all max-md:fixed max-md:top-0 max-md:right-0">
    <input type="checkbox" className='hidden' id='sidebar-btn' onChange={sidebarHandler}/>
    <label htmlFor='sidebar-btn' className="max-md:flex hidden absolute top-2 left-0 items-center justify-center h-[45px] w-[45px] cursor-pointer" >
        <IoCloseCircleSharp className='text-white text-2xl' />
    </label>
    <div ref={sidebarContent} className='overflow-x-hidden text-nowrap max-md:max-h-[100vh] max-md:overflow-y-auto max-md:px-0 px-5'>
        
    <div class="text-center">
        <img src={logoImg} alt="logo" className='max-w-[150px] mx-auto my-2' />
    </div>
    <hr/>
    <ul class="text-lg w-full text-white flex flex-col gap-y-4 py-3">
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
                <BsHouseGearFill className='sidebar-icon'/>
                <span>پیشخوان</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
                <FaBasketShopping className='sidebar-icon'/>
                <span>محصولات</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
            <FaUser className='sidebar-icon'/>
                <span>کاربران</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
            <BsChatLeftTextFill className='sidebar-icon'/>
                <span>کامنت ها</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
            <BsTicketPerforatedFill className='sidebar-icon'/>
                <span>تیکت ها</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
                <FaBasketShopping className='sidebar-icon'/>
                <span>محصولات</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
            <FaUser className='sidebar-icon'/>
                <span>کاربران</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
            <BsChatLeftTextFill className='sidebar-icon'/>
                <span>کامنت ها</span>
            </Link>
        </li>
        <li class="block w-full">
            <Link to="#" class="flex justify-start gap-x-3 items-end sidebar-link" data-link="admin-page-console">
            <BsTicketPerforatedFill className='sidebar-icon'/>
                <span>تیکت ها</span>
            </Link>
        </li>
    </ul>
    </div>

</div>
  )
}
