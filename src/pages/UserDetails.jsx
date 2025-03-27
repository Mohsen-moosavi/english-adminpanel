import React, { useEffect, useState } from 'react'
import userProfile from './../../public/user-profile.png'
import { FaStar, FaUserAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import { MdManageAccounts } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { getUserDetails } from '../redux/features/usersSlice'
import moment from 'moment-jalaali'

export default function UserDetails() {

  const dispatch = useDispatch()
  const { id } = useParams()
  const [userData, setUserData] = useState({})

  useEffect(() => {
    dispatch(getUserDetails({ id, setUserData }))
  }, [])

  return (
    <div className='flex max-sm:flex-col gap-x-[30px] lg:gap-x-[50px] gap-y-5 lg:px-8'>
      <div className='max-sm:order-1 sm:max-w-[180px] max-sm:max-w-full lg:max-w-[230px] flex-1'>
        <div className='flex flex-col items-center justify-start'>
          <img src={userData.avatar || userProfile} alt="profile" className='max-sm:max-w-[150px] w-full bg-main-color/40 border-4 border-main-color rounded-xl' />
          <ul className='list-none flex flex-col gap-y-4  w-full text-gray-500 max-sm:text-sm font-bold mt-5'>
            <li>
              <Link to={`user-courses`} state={{name : userData.name}} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                <span>دوره ها:</span>
                <span className='flex items-center gap-x-1'>{userData.courseCount} <IoIosArrowBack /></span>
              </Link>
            </li>
            <li>
              <Link to={'#'} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                <span>کامنت ها:</span>
                <span className='flex items-center gap-x-1'>{userData.commentCount}<IoIosArrowBack /></span>
              </Link>
            </li>
            <li>
              <Link to={'#'} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                <span>خرید ها:</span>
                <span className='flex items-center gap-x-1'>{userData.saleCount} <IoIosArrowBack /></span>
              </Link>
            </li>
            <li>
              <Link to={'#'} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                <span>تیکت ها:</span>
                <span className='flex items-center gap-x-1'>{userData.ticketCount} <IoIosArrowBack /></span>
              </Link>
            </li>
            <hr />
            <li>
              <Link to={'#'} className=' max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl text-green-700 transition flex justify-between'>
                <span>درس ها:</span>
                <span className='flex items-center gap-x-1'>{userData.lessonCount} <IoIosArrowBack /></span>
              </Link>
            </li>
            <li>
              <Link to={'#'} className=' max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl text-green-700 transition flex justify-between'>
                <span>مقاله ها:</span>
                <span className='flex items-center gap-x-1'>{userData.articleCount} <IoIosArrowBack /></span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className='flex-1 sm:max-w-[500px]'>
        <div className='mb-5'>
          <h1 className='font-bold text-lg sm:text-2xl text-main-color'>{userData.name}</h1>
          <span className='text-[12px] text-[#70987e] font-bold'>{userData.role?.name}</span>
        </div>

        <div className='mb-8'>
          <span className='text-gray-400 max-sm:text-[12px]'>میانگین نظرات:</span>
          <div className='flex items-enter'>
            <span className='font-bold text-main-color max-sm:text-[16px] text-xl ml-3'>{Number(userData.avgScore) > 0 ? Number(userData.avgScore).toFixed(1) : 'بدون نظر'}</span>
            {Number(userData.avgScore) > 0 ? (
              <>
                {Array(Math.ceil(userData.avgScore)).fill(0).map((e, index) => (
                  <FaStar className='h-[20px] w-auto max-sm:h-[15px]' color='#ffe43f' key={index} />
                ))}
                {Array(5 - Math.ceil(userData.avgScore)).fill(0).map((e, index) => (
                  <FaStar className='h-[20px] w-auto max-sm:h-[15px]' color='#aaa' key={index} />
                ))}
              </>
            ) : (<>
              <FaStar className='h-[20px] w-auto max-sm:h-[15px]' stroke='#000' strokeWidth={10} color='#eff' />
              <FaStar className='h-[20px] w-auto max-sm:h-[15px]' stroke='#000' strokeWidth={10} color='#eff' />
              <FaStar className='h-[20px] w-auto max-sm:h-[15px]' stroke='#000' strokeWidth={10} color='#eff' />
              <FaStar className='h-[20px] w-auto max-sm:h-[15px]' stroke='#000' strokeWidth={10} color='#eff' />
              <FaStar className='h-[20px] w-auto max-sm:h-[15px]' stroke='#000' strokeWidth={10} color='#eff' />
            </>)}
          </div>
        </div>

        <div>
          <div className='flex items-start border-b border-gray-400 pb-1 mb-2'>
            <FaUserAlt className='text-main-color max-sm:w-[15px] w-[20px] h-auto' />
            <span className='text-gray-500 font-bold max-sm:text-sm text-lg mr-2'>اطلاعات کاربر</span>
          </div>

          <div className='flex justify-between'>
            <div className='flex flex-col text-gray-500 max-sm:text-sm text-lg gap-y-5 font-bold'>
              <span>تلفن :</span>
              <span>نام کاربری :</span>
              <span>سطح :</span>
              <span>میزان خرید :</span>
              <span>امتیاز :</span>
              <span>تاریخ پیوستن :</span>
              <span>آخرین بازدید :</span>
            </div>

            <div className='flex flex-col text-gray-600 max-sm:text-sm text-lg font-bold gap-y-5'>
              <span dir='ltr' >{userData.phone}</span>
              <span>{userData.username}</span>
              <span className='text-[#289b65]'>{userData.level?.name || "تعیین نشده"}</span>
              <span className='text-[#289b65]'>{userData.sumSales}</span>
              <span className='text-[#289b65]'>{userData.score}</span>
              <span>{moment(userData.created_at).format('jYYYY/jMM/jDD')}</span>
              <span>{moment(userData.updated_at).format('jYYYY/jMM/jDD')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // return (
  //   <div className='grid grid-cols-11 xl:grid-cols-9 gap-x-10 2xl:gap-x-16 px-8'>
  //     <div className=' col-span-3 xl:col-span-2'>
  //       <div className='flex flex-col items-start justify-start'>
  //         <img src={userProfile} alt="profile" className='w-full bg-main-color/40 border-4 border-main-color rounded-xl' />
  //         <ul className='list-none flex flex-col gap-y-7 w-full text-gray-500 font-bold mt-5'>
  //             <li>
  //               <Link to={'#'} className=' transition flex justify-between'>
  //                 <span>دوره ها:</span>
  //                 <span className='flex items-center gap-x-1'>6 <IoIosArrowBack /></span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link to={'#'} className=' transition flex justify-between'>
  //                 <span>کامنت ها:</span>
  //                 <span className='flex items-center gap-x-1'>13 <IoIosArrowBack /></span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link to={'#'} className=' transition flex justify-between'>
  //                 <span>خرید ها:</span>
  //                 <span className='flex items-center gap-x-1'>20 <IoIosArrowBack /></span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link to={'#'} className=' transition flex justify-between'>
  //                 <span>تیکت ها:</span>
  //                 <span className='flex items-center gap-x-1'>2 <IoIosArrowBack /></span>
  //               </Link>
  //             </li>
  //             <hr />
  //             <li>
  //               <Link to={'#'} className='text-green-700 transition flex justify-between'>
  //                 <span>درس ها:</span>
  //                 <span className='flex items-center gap-x-1'>2 <IoIosArrowBack /></span>
  //               </Link>
  //             </li>
  //             <li>
  //               <Link to={'#'} className='text-green-700 transition flex justify-between'>
  //                 <span>مقاله ها:</span>
  //                 <span className='flex items-center gap-x-1'>2 <IoIosArrowBack /></span>
  //               </Link>
  //             </li>
  //           </ul>
  //       </div>
  //     </div>
  //     <div className='col-span-6 xl:col-span-5 2xl:col-span-4'>
  //       <div className='mb-5'>
  //         <h1 className='font-bold text-2xl text-main-color'>سید محسن موسوی</h1>
  //         <span className='text-[12px] text-[#70987e] font-bold'>ADMIN</span>
  //       </div>

  //       <div className='mb-8'>
  //         <span className='text-gray-400'>میانگین نظرات:</span>
  //         <div className='flex items-enter'>
  //           <span className='font-bold text-main-color text-xl ml-3'>4.2</span>
  //           <FaStar className='h-[20px] w-auto max-md:w-[15px]' color='#ffe43f' />
  //           <FaStar className='h-[20px] w-auto max-md:w-[15px]' color='#ffe43f' />
  //           <FaStar className='h-[20px] w-auto max-md:w-[15px]' color='#ffe43f' />
  //           <FaStar className='h-[20px] w-auto max-md:w-[15px]' color='#ffe43f' />
  //           <FaStar className='h-[20px] w-auto max-md:w-[15px]' color='#aaa' />
  //         </div>
  //       </div>

  //       <div>
  //         <div className='flex items-start border-b border-gray-400 pb-1 mb-2'>
  //           <FaUserAlt className='text-main-color w-[20px] h-auto' />
  //           <span className='text-gray-500 font-bold text-lg mr-2'>اطلاعات کاربر</span>
  //         </div>

  //         <div className='flex justify-between'>
  //           <div className='flex flex-col'>
  //             <span className='text-gray-500 text-lg mb-5'>تلفن :</span>
  //             <span className='text-gray-500 text-lg mb-5'>ایمیل :</span>
  //             <span className='text-gray-500 text-lg mb-5'>نام کاربری :</span>
  //             <span className='text-gray-500 text-lg mb-5'>سطح :</span>
  //             <span className='text-gray-500 text-lg mb-5'>میزان خرید :</span>
  //             <span className='text-gray-500 text-lg mb-5'>امتیاز :</span>
  //             <span className='text-gray-500 text-lg mb-5'>تاریخ پیوستن :</span>
  //             <span className='text-gray-500 text-lg mb-5'>آخرین بازدید :</span>
  //           </div>

  //           <div className='flex flex-col text-gray-600'>
  //             <span className='font-bold text-lg mb-5' dir='ltr' >+989382646981</span>
  //             <span className='font-bold text-lg mb-5'>test@gmail.com</span>
  //             <span className='font-bold text-lg mb-5'>mohsen.wsx</span>
  //             <span className='font-bold text-lg mb-5 text-[#289b65]'>+A</span>
  //             <span className='font-bold text-lg mb-5 text-[#289b65]'>2,345,000</span>
  //             <span className='font-bold text-lg mb-5 text-[#289b65]'>300</span>
  //             <span className='font-bold text-lg mb-5'>1403/08/22</span>
  //             <span className='font-bold text-lg mb-5'>1403/08/22</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}
