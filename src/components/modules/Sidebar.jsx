import React, { useEffect, useRef } from 'react'
import logoImg from './../../assets/logo2.png'
import { Link, useLocation } from 'react-router-dom'
import { BsChatLeftTextFill, BsHouseGearFill, BsTicketPerforatedFill } from 'react-icons/bs'
import { FaBasketShopping, FaUser } from 'react-icons/fa6'
import { IoCloseCircleSharp } from 'react-icons/io5'
import LogoutBtn from './logoutBtn'
import { AiFillGift, AiFillMessage, AiFillTag } from 'react-icons/ai'
import { BiSolidDollarCircle } from 'react-icons/bi'
import { GrArticle } from 'react-icons/gr'
import { PiBooksDuotone, PiStepsFill } from 'react-icons/pi'
import { FaChalkboardTeacher, FaUsers } from 'react-icons/fa'

export default function Sidebar() {

    const sidebarContainer = useRef()
    const sidebarContent = useRef()
    const ulMenuElm = useRef()
    const menuCheckBox = useRef()
    const location = useLocation()

    function sidebarHandler(event){
        if(event.target.checked){
            sidebarContainer.current.classList.add("max-md:!w-[250px]");
            sidebarContent.current.classList.add("max-md:px-5");
            sidebarContainer.current.classList.add("z-[1000]");
        }else{
            sidebarContainer.current.classList.remove("max-md:!w-[250px]");
            sidebarContent.current.classList.remove("max-md:px-5");
            sidebarContainer.current.classList.remove("z-[1000]");
        }
    }

    useEffect(()=>{
        menuCheckBox.current.checked = false;

        sidebarContainer.current.classList.remove("max-md:!w-[250px]");
        sidebarContent.current.classList.remove("max-md:px-5");
        sidebarContainer.current.classList.remove("z-[1000]");
        
        for (const key in ulMenuElm.current.children) {
            if(ulMenuElm.current.children[key]?.dataset?.link === 'console'){
                ulMenuElm.current.children[key]?.classList?.add('bg-secound-color')
            }else if(location.pathname.includes( ulMenuElm.current.children[key]?.dataset?.link)){
                ulMenuElm.current.children[key]?.classList.add('bg-secound-color')
            }else{
                ulMenuElm.current.children[key]?.classList?.remove('bg-secound-color')
            }
        }
    } , [location])

  return (
    <div ref={sidebarContainer} className="bg-main-color max-md:w-0 min-md:w-[250px] rounded-r-xl relative transition-all max-md:fixed max-md:top-0 max-md:right-0">
    <input type="checkbox" ref={menuCheckBox} className='hidden' id='sidebar-btn' onChange={sidebarHandler}/>
    <label htmlFor='sidebar-btn' className="max-md:flex hidden absolute top-2 left-0 items-center justify-center h-[45px] w-[45px] cursor-pointer" >
        <IoCloseCircleSharp className='text-white text-2xl' />
    </label>
    <div ref={sidebarContent} className='overflow-x-hidden text-nowrap max-h-[100vh] overflow-y-auto max-md:px-0 px-5 md:sticky md:top-0'>
        
    <div className="text-center">
        <img src={logoImg} alt="logo" className='max-w-[150px] mx-auto my-2' />
    </div>
    <hr/>
    <ul className="text-lg w-full text-white flex flex-col gap-y-2 py-3" ref={ulMenuElm}>
        <li className="block w-full p-2 rounded-lg" data-link="/console">
            <Link to="/" className="flex justify-start gap-x-3 items-end sidebar-link">
                <BsHouseGearFill className='sidebar-icon'/>
                <span>پیشخوان</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg"  data-link="/users">
            <Link to="users" className="flex justify-start gap-x-3 items-end sidebar-link">
                <FaUsers className='sidebar-icon'/>
                <span>کاربران</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg"  data-link="/levels">
            <Link to="levels" className="flex justify-start gap-x-3 items-end sidebar-link">
            <PiStepsFill className='sidebar-icon'/>
                <span>سطح ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/tags">
            <Link to="tags" className="flex justify-start gap-x-3 items-end sidebar-link" >
            <AiFillTag className='sidebar-icon'/>
                <span>تگ ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/articles">
            <Link to="articles" className="flex justify-start gap-x-3 items-end sidebar-link">
            <GrArticle className='sidebar-icon'/>
                <span>مقاله ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/books-collection">
            <Link to="books-collection" className="flex justify-start gap-x-3 items-end sidebar-link">
            <PiBooksDuotone className='sidebar-icon'/>
                <span>کتاب ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/courses">
            <Link to="courses" className="flex justify-start gap-x-3 items-end sidebar-link">
            <FaChalkboardTeacher className='sidebar-icon'/>
                <span>دوره ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/offs">
            <Link to="offs" className="flex justify-start gap-x-3 items-end sidebar-link">
            <AiFillGift className='sidebar-icon'/>
                <span>تخفیف ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/comments">
            <Link to="comments" className="flex justify-start gap-x-3 items-end sidebar-link">
            <AiFillMessage className='sidebar-icon'/>
                <span>کامنت ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/sales">
            <Link to="sales" className="flex justify-start gap-x-3 items-end sidebar-link">
            <BiSolidDollarCircle className='sidebar-icon'/>
                <span>فروش ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/tickets">
            <Link to="tickets" className="flex justify-start gap-x-3 items-end sidebar-link">
            <BsTicketPerforatedFill className='sidebar-icon'/>
                <span>تیکت ها</span>
            </Link>
        </li>
        <li className="block w-full p-2 rounded-lg" data-link="/contacts">
            <Link to="contacts" className="flex justify-start gap-x-3 items-end sidebar-link">
            <BsChatLeftTextFill className='sidebar-icon'/>
                <span>پیغام ها</span>
            </Link>
        </li>
        <LogoutBtn/>
    </ul>
    </div>

</div>
  )
}
