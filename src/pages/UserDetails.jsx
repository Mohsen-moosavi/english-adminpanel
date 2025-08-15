import { useEffect, useRef, useState } from 'react'
import { FaLongArrowAltRight, FaStar, FaTrash, FaUserAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { banUser, changeUserRole, getRoles, getUserDetails, resetPassword } from '../redux/features/usersSlice'
import moment from 'moment-jalaali'
import Swal from 'sweetalert2'
import { MdEdit } from 'react-icons/md'
import toast from 'react-hot-toast'
import { ImSpinner8 } from 'react-icons/im'
import userProfile from './../assets/user-profile.png'
import { removeUserProfile, updateUserAvtar } from '../redux/features/userSlice'

export default function UserDetails() {

  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const isInitialised = useRef(false)
  const profileInputElm = useRef()
  const { id } = useParams()
  const [userData, setUserData] = useState()
  const [roles, setRoles] = useState([])
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true
      dispatch(getRoles({ setRoles }))
    }
    dispatch(getUserDetails({ id, setUserData, setIsLoaded }))
  }, [])

  function removeUserProfileHandler() {
    Swal.fire({
      title: 'آیا از حذف تصویر پروفایل اطمینان دارید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(removeUserProfile({ setUserData, userId: userData.id }))
      }
    })
  }

  function changeRoleHandler() {

    Swal.fire({
      title: 'لطفا یک مورد را انتخاب کنید',
      html: `
    <div class='change-role-modal'>
      ${roles?.map(role => (
        `<input class='radio-role-input' type="radio" key={level.id} id="option${role.id}" name="choice" ${role.name === userData.roleName ? 'checked={true} disabled' : ' '} value="${role.id}">
        <label class='change-role-modal-item' for="option${role.id}">
        <span>${role.name}</span>
        <span class='custom-radio'></span>
        </label>`
      )).join('')}
    </div>`,
      confirmButtonText: 'تایید',
      preConfirm: () => {
        const selectedOption = document.querySelector('input[name="choice"]:checked');
        if (!selectedOption) {
          Swal.showValidationMessage('لطفا یکی از گزینه‌ها را انتخاب کنید!');
        }
        return selectedOption ? selectedOption.value : null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(changeUserRole({ userId: userData.id, roleId: result.value, setUserData }))
      }
    });
  }

  function banUserHandler() {

    Swal.fire({
      inputLabel: 'لطفا علت بن شدن کاربر را بنویسید.',
      input: 'text',
      confirmButtonText: 'تایید',
    }).then(result => {
      if (result.isConfirmed && result.value?.trim()) {
        dispatch(banUser({ userId: userData.id, isBan: true, description: result.value?.trim(), setUserData }))
      }
    })
  }

  function removeBanUserHandler() {

    Swal.fire({
      title: 'آیا از خارج کردن کاربر از حالت بن اطمینان دارید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(banUser({ userId: userData.id, isBan: false, setUserData }))
      }
    })
  }

  function changeUserProfileHandler(e) {
    const file = e.target.files[0]
    if (!file) {
      emtyFileInput(e)
      return toast.error("لطفا یک فایل معتبر انتخاب کنید.")
    }

    if (!['jpg', 'png', 'jpeg'].includes(file?.name?.split('.').pop())) {
      emtyFileInput(e)
      return toast.error("فقط فرمت های png، jpg و jpeg مجاز است.")
    }

    if (file.size > 300 * 1024) {
      emtyFileInput(e)
      return toast.error("حجم فایل نباید بیشتر از 300 کیلوبایت باشد.")
    }

    dispatch(updateUserAvtar({ userId: userData.id, avatar: file, setUserData, setShowLoader }))
  }

  function emtyFileInput(e) {
    e.target.type = ''
    e.target.type = 'file'
  }

  function resetPass() {
    Swal.fire({
      title: 'آیا از بازنشانی گذرواژه اطمینان دارید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(resetPassword({ phone: userData?.phone }))
      }
    })
  }

  return (
    <>
      {isLoaded ? (
        <>
          {userData ? (
            <>
            <div className='inline-block mb-3'>
              <Link to={-1} className='flex items-center gap-x-2 text-main-color font-bold hover:text-secound-color'>
                <FaLongArrowAltRight size={20}></FaLongArrowAltRight>
                  <span>بازگشت</span>
                  </Link>
            </div>
            <div className='flex max-sm:flex-col gap-x-[30px] lg:gap-x-[50px] gap-y-5 lg:px-8'>
              <div className='max-sm:order-1 sm:max-w-[180px] max-sm:max-w-full lg:max-w-[230px] flex-1'>
                <div className='flex flex-col items-center justify-start'>
                  <div className='lg:w-[230px] lg:h-[230px] sm:w-[180px] sm:h-[180px] max-sm:w-[150px] max-sm:h-[150px] overflow-hidden border-4 border-main-color rounded-xl flex items-center justify-center relative'>
                    {showLoader ? (
                      <ImSpinner8 size={50} color='#56abc9' className='animate-[spin_2s_linear_infinite] min-h-[150px]' />
                    ) : (
                      <>
                      {userData.avatar ? (
                        <img src={userData.avatar} alt="profile" className='w-full bg-main-color/40' />
                      ) : (
                        <img src={userProfile} alt="profile" className='w-full bg-main-color/40' />
                      )}
                        <div className='absolute bottom-0 left-[5%] flex gap-x-2'>
                          <button className={`p-2 rounded-full ${userData.avatar ? 'bg-red-400' : 'bg-red-300'}`} disabled={!userData.avatar} onClick={removeUserProfileHandler}>
                            <FaTrash size={15} color='#fff' />
                          </button>
                          <button className='bg-sky-400 p-2 rounded-full' onClick={() => profileInputElm.current.click()}>
                            <MdEdit size={15} color='#fff' />
                          </button>
                        </div>
                      </>
                    )}
                    <input ref={profileInputElm} type="file" className='hidden' onChange={changeUserProfileHandler} />
                  </div>
                  <ul className='list-none flex flex-col gap-y-4  w-full text-gray-500 max-sm:text-sm font-bold mt-5'>
                    <li>
                      <Link to={`user-courses`} state={{ name: userData.name }} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                        <span>دوره ها:</span>
                        <span className='flex items-center gap-x-1'>{userData.courseCount} <IoIosArrowBack /></span>
                      </Link>
                    </li>
                    <li>
                      <Link to={'user-comments'} state={{ name: userData.name }} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                        <span>کامنت ها:</span>
                        <span className='flex items-center gap-x-1'>{userData.commentCount}<IoIosArrowBack /></span>
                      </Link>
                    </li>
                    <li>
                      <Link to={'user-sales'} state={{ name: userData.name }} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                        <span>خرید ها:</span>
                        <span className='flex items-center gap-x-1'>{userData.saleCount} <IoIosArrowBack /></span>
                      </Link>
                    </li>
                    <li>
                      <Link to={'user-tickets'} state={{ name: userData.name }} className='  max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl transition flex justify-between'>
                        <span>تیکت ها:</span>
                        <span className='flex items-center gap-x-1'>{userData.ticketCount} <IoIosArrowBack /></span>
                      </Link>
                    </li>
                    <hr />
                    <li>
                      <Link to={'user-lessons'} state={{ name: userData.name }} className=' max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl text-green-700 transition flex justify-between'>
                        <span>درس ها:</span>
                        <span className='flex items-center gap-x-1'>{userData.lessonCount} <IoIosArrowBack /></span>
                      </Link>
                    </li>
                    <li>
                      <Link to={'user-articles'} state={{ name: userData.name }} className=' max-sm:shadow-shadow-low sm:hover:shadow-shadow-low p-2 rounded-xl text-green-700 transition flex justify-between'>
                        <span>مقاله ها:</span>
                        <span className='flex items-center gap-x-1'>{userData.articleCount} <IoIosArrowBack /></span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='flex-1 sm:max-w-[500px]'>
                <div className='mb-5'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <div className='flex items-center gap-x-1'>
                        <h1 className='font-bold text-lg sm:text-2xl text-main-color'>{userData.name}</h1>
                        {userData.banData ? (<span className='text-red-400 font-bold'>(بن شده)</span>) : null}
                      </div>
                      <span className='text-[12px] text-[#70987e] font-bold'>{userData.roleName}</span>
                    </div>
                    <div className='flex flex-col gap-y-1'>
                      <button className='rounded-xl bg-main-color text-white text-[12px] px-2 py-1 hover:opacity-60' onClick={changeRoleHandler}>تغییر نقش</button>
                      {
                        userData.banDate ? (
                          <button className='rounded-xl bg-green-400 text-white text-[12px] px-2 py-1 hover:opacity-70' onClick={removeBanUserHandler}>خروج از بن</button>
                        ) : (
                          <button className='rounded-xl bg-red-400 text-white text-[12px] px-2 py-1 hover:opacity-70' onClick={banUserHandler}>بن کردن</button>
                        )
                      }
                      <button className='rounded-xl bg-blue-500 text-white text-[12px] px-2 py-1 hover:opacity-70' onClick={resetPass}>بازنشانی گذرواژه</button>
                    </div>
                  </div>
                  {userData.banData ? (
                    <div>
                      <p className='mt-2 text-[14px] text-red-400'>{userData.banData}<span>({moment(userData.banDate).format('jYYYY/jMM/jDD')})</span></p>
                    </div>
                  ) : null}
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
            </>
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <h4 className='text-red-500 font-bold'>اطلاعات کاربر یافت نشد!</h4>
            </div>
          )}
        </>
      ) : (
        <div className="h-[400px] w-full flex items-center justify-center">
          <svg className='animate-spin' fill="#166d91" height="60px" width="60px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 330 330">
            <g id="XMLID_2_">
              <path id="XMLID_4_" d="M97.5,165c0-8.284-6.716-15-15-15h-60c-8.284,0-15,6.716-15,15s6.716,15,15,15h60
            C90.784,180,97.5,173.284,97.5,165z"/>
              <path id="XMLID_5_" d="M307.5,150h-30c-8.284,0-15,6.716-15,15s6.716,15,15,15h30c8.284,0,15-6.716,15-15S315.784,150,307.5,150z"
              />
              <path id="XMLID_6_" d="M172.5,90c8.284,0,15-6.716,15-15V15c0-8.284-6.716-15-15-15s-15,6.716-15,15v60
                  C157.5,83.284,164.216,90,172.5,90z"/>
              <path id="XMLID_7_" d="M172.501,240c-8.284,0-15,6.716-15,15v60c0,8.284,6.716,15,15,15c8.284,0,15-6.716,15-15v-60
                  C187.501,246.716,180.785,240,172.501,240z"/>
              <path id="XMLID_8_" d="M77.04,48.327c-5.856-5.858-15.354-5.857-21.213,0c-5.858,5.858-5.858,15.355,0,21.213l42.427,42.428
                  c2.929,2.929,6.768,4.394,10.606,4.394c3.838,0,7.678-1.465,10.606-4.393c5.858-5.858,5.858-15.355,0-21.213L77.04,48.327z"/>
              <path id="XMLID_9_" d="M246.746,218.034c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.858-5.857,15.355,0,21.213l42.428,42.426
                  c2.929,2.929,6.768,4.393,10.607,4.393c3.839,0,7.678-1.465,10.606-4.393c5.858-5.858,5.858-15.355,0-21.213L246.746,218.034z"/>
              <path id="XMLID_10_" d="M98.254,218.034L55.828,260.46c-5.858,5.858-5.858,15.355,0,21.213c2.929,2.929,6.768,4.393,10.607,4.393
                  c3.839,0,7.678-1.464,10.606-4.393l42.426-42.426c5.858-5.858,5.858-15.355,0-21.213
                  C113.609,212.176,104.111,212.176,98.254,218.034z"/>
            </g>
          </svg>
        </div>
      )}
    </>
  )
}
