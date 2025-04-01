import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { changeStatus, deleteCourse, deleteCourseForUser, getCourses, getCreatingData, setBookId, setLevelId, setOffset, setPriceStatus, setScoreStatus, setSearch, setStatus, setTeacherId } from '../redux/features/courseSlice'
import DataTable from '../components/modules/DataTable'
import Pagination from '../components/modules/Pagination'
import Searcher from '../components/modules/Searcher'
import Swal from 'sweetalert2'

export default function Course() {

  const [userId , setUserId] = useState()
  const { state } = useLocation()
  const { id }= useParams()
  const {pathname}= useLocation()
  const isInitialized = useRef(false)

  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { courses, coursesCount, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, offset, limit, isLoading, teachers, levels, bookCollections } = useSelector(state => state.courseData)

  // useEffect(() => {
  //      return ()=>{
  //     dispatch(setTeacherId(''))
  //   }
  // }, [])

  useEffect(() => {
    if(!isInitialized.current){
      isInitialized.current = true

      if(pathname.endsWith('/user-lessons')){
        dispatch(setTeacherId(id))
      }else{
        setUserId(id)
      }

      dispatch(getCreatingData({}))

      dispatch(getCourses({ limit, offset: 0, search, status, teacherId : pathname.endsWith('/user-lessons') ? id : teacherId, bookId, levelId, priceStatus, scoreStatus, userId }))
    }else{
      dispatch(getCourses({ limit, offset: 0, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, userId }))
    }

  }, [search, status, teacherId, bookId, levelId, priceStatus, scoreStatus , userId,pathname])

  function paginationHandler(page) {
    dispatch(getCourses({ limit, offset: page * limit, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, userId }))
  }

  function deleteCourseHandler(id , isDeleted) {
            Swal.fire({
              title: isDeleted ? 'آیا از در دسترس کردن دوره اطمینان دارید؟' :'آیا از غیر قابل دسترس کردن دوره اطمینان دارید؟',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'تایید',
              cancelButtonText: 'لغو',
            }).then(result=>{
              if(result.isConfirmed){
                dispatch(deleteCourse({ id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, userId }))
              }
            })
  }

  function deleteCourseForUserHandler(id) {
        Swal.fire({
          title: 'آیا از حذف دوره برای این کاربر اطمینان دارید؟',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'تایید',
          cancelButtonText: 'لغو',
        }).then(result=>{
          if(result.isConfirmed){
            if (courses.length === 1) {
              dispatch(deleteCourseForUser({ id, limit, offset: 0, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, userId }))
              setPaginatorChangerFlag(prev => !prev)
              dispatch(setOffset(0))
            } else {
              dispatch(deleteCourseForUser({ id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, userId }))
            }
          }
        })
  }

  function statusChangeHandler(id) {
    dispatch(changeStatus({ id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, userId }))
  }

  return (
    <div>
      <h3 className='page-title'>{state?.name  ? `دوره های${pathname.endsWith('/user-lessons') ? ' تدریس شده ' :''} ${state.name}` : 'لیست دوره ها'}</h3>


      <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2'>
        {(state?.name && userId) ? (
          <Link to={`/users/${userId}/create-sale`} className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن دوره برای کاربر</Link>
        ) : (
          <Link to='/courses/create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن دوره جدید</Link>
        )}
        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ status, teacherId, bookId, levelId, priceStatus, scoreStatus, limit, userId }} getter={getCourses} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
      </div>

      <DataTable>
        <thead>
          <tr>
            <th>شماره</th>
            <th>نام</th>
            <th>لینک</th>
            <th>
              <select name="teachers" defaultValue={pathname.endsWith('/user-lessons') ? id : teacherId} className='bg-transparent' onChange={(e) => dispatch(setTeacherId(e.target.value))}>
                <option value={''}>مدرس</option>
                {teachers?.map((teacher, index) => (
                  <option key={index} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </th>
            <th>
              <select name="levels" className='bg-transparent' defaultValue={levelId} onChange={(e) => dispatch(setLevelId(e.target.value))}>
                <option value={''}>سطح</option>
                {levels?.map((level, index) => (
                  <option key={index} value={level.id}>{level.name}</option>
                ))}
              </select>
            </th>
            <th>
              <select name="bookCollections" defaultValue={bookId} className='bg-transparent' onChange={(e) => dispatch(setBookId(e.target.value))}>
                <option value={''}>مجموعه</option>
                {bookCollections?.map((book, index) => (
                  <option key={index} value={book.id}>{book.name}</option>
                ))}
              </select>
            </th>
            <th>
              <select name="price" className='bg-transparent' defaultValue={priceStatus} onChange={(e) => dispatch(setPriceStatus(e.target.value))}>
                <option value={''}>مبلغ</option>
                <option value="free">رایگان</option>
                <option value="max">گران ترین</option>
                <option value="min">ارزان ترین</option>
              </select>
            </th>
            <th>تخفیف</th>
            <th>
              <select name="status" defaultValue={status} className='bg-transparent' onChange={(e) => dispatch(setStatus(e.target.value))}>
                <option value={''}>وضعیت</option>
                <option value="completed">کامل شده</option>
                <option value="notCompleted">درحال برگزاری</option>
              </select>
            </th>
            <th>
              <select name="score" defaultValue={scoreStatus} className='bg-transparent' onChange={(e) => dispatch(setScoreStatus(e.target.value))}>
                <option value={''}>امتیاز</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </th>
            <th>ویدئو معارفه</th>
            <th>جلسات</th>
            <th>ویرایش</th>
            <th>دسترسی</th>
            {userId ? (<th>حذف</th>) : null}
          </tr>
        </thead>
        {courses.length ? (
          <tbody>
            {courses?.map((course, index) => (
              <tr key={index}>
                <td>{index + 1 + offset}</td>
                <td>{course.name}</td>
                <td>{course.slug}</td>
                <td>
                  <Link to={`/users/${course['user.id']}`}>
                    {course['user.name']}
                  </Link>
                </td>
                <td>{course['level.name']}</td>
                <td>{course['book_collection.name']}</td>
                <td>{Number(course.price) === 0 ? "رایگان" : course.price}</td>
                <td>{Number(course['offs.percent']) ? course['offs.percent'] : '-'}</td>
                <td>
                  <button className={`py-1 px-2 rounded-lg text-white hover:text-white ${course.isCompleted ? "bg-green-600" : "bg-red-500"}`} onClick={() => statusChangeHandler(course.id)}>
                    {course.isCompleted ? 'تکمیل شده' : "در حال برگزاری"}
                  </button>
                </td>
                <td>{course.score}</td>
                <td>
                  <Link to={`/courses/video/${course.id}`} state={{ cover: course.cover, video: course.introductionVideo }} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-amber-400"}>
                    مشاهده
                  </Link>
                </td>
                <td>
                  <Link to={`/sessions/${course.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-green-600"}>
                    مشاهده
                  </Link>
                </td>
                <td>
                  <Link to={`/courses/edit/${course.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500"}>
                    ویرایش
                  </Link>
                </td>
                <td>
                  <button disabled={isLoading} className={`py-1 px-2 rounded-lg text-white hover:text-white ${course.deleted_at ? "bg-red-500" : "bg-green-500"}`} onClick={() => deleteCourseHandler(course.id , !!course.deleted_at)}>
                    {course.deleted_at ? 'غیر فعال' : 'فعال'}
                  </button>
                </td>
                {userId ? (
                  <td>
                    <button disabled={isLoading} className="py-1 px-2 rounded-lg text-white hover:text-white bg-red-500" onClick={() => deleteCourseForUserHandler(course.id)}>
                      حذف
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        ) : (<></>)}
      </DataTable>
      {courses.length ? (<></>) :
        (<div className='text-center my-5'>
          <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
        </div>
        )}
      {courses.length ? (<Pagination itemsCount={coursesCount} numberOfitemInEveryPage={limit} setOffset={setOffset} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} />) : ''}

    </div>
  )
}
