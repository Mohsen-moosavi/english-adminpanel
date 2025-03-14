import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Search from '../components/modules/SearchCourse'
import { changeStatus, deleteCourse, getCourses, getCreatingData, setBookId, setLevelId, setOffset, setPriceStatus, setScoreStatus, setSearch, setStatus, setTeacherId } from '../redux/features/courseSlice'
import DataTable from '../components/modules/DataTable'
import Pagination from '../components/modules/Pagination'

export default function Course() {

  const isInitialised = useRef(false)
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { courses, coursesCount, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, offset, limit, isLoading, teachers, levels, bookCollections } = useSelector(state => state.courseData)

  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true
      dispatch(getCourses({ limit, offset: 0}))
      dispatch(getCreatingData({}))
    }
  }, [])

  useEffect(() => {
    dispatch(getCourses({ limit, offset: 0, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus }))
  }, [search, status, teacherId, bookId, levelId, priceStatus, scoreStatus])

  function paginationHandler(page) {
    dispatch(getCourses({ limit, offset: page * limit, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus }))
  }

  function deleteCourseHandler(id) {
    swal({
      title: 'آیا از حذف اطمینان دارید؟',
      icon: 'warning',
      buttons: ['لغو', 'تایید'],
    }).then(value => {
      if (value) {
        if (courses.length === 1) {
          dispatch(deleteCourse({ id, limit, offset: 0, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus }))
          setPaginatorChangerFlag(prev => !prev)
          dispatch(setOffset(0))
        } else {
          dispatch(deleteCourse({ id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus }))
        }
      }
    })
  }

  function statusChangeHandler(id){
    dispatch(changeStatus({ id, limit, offset, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus }))
  }

  return (
    <div>
      <h3 className='page-title'>لیست دوره ها</h3>


      <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2'>
        <Link to='create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن دوره جدید</Link>
        <Search setPaginatorChangerFlag={setPaginatorChangerFlag} sliceName={'courseData'} setSearch={setSearch} defaultValue={search}/>
      </div>

      {search !== '' && !courses.length ?
        (<div className='text-center my-5'>
          <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
        </div>
        ) :
        (
          <>
            <DataTable>
              <thead>
                <tr>
                  <th>شماره</th>
                  <th>نام</th>
                  <th>لینک</th>
                  <th>
                    <select name="teachers" defaultValue={teacherId} className='bg-transparent' onChange={(e) => dispatch(setTeacherId(e.target.value))}>
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
                  <th>حذف</th>
                </tr>
              </thead>
              {courses.length ? (
                <tbody>
                  {courses?.map((course, index) => (
                    <tr key={index}>
                      <td>{index + 1 + offset}</td>
                      <td>{course.name}</td>
                      <td>{course.slug}</td>
                      <td>{course['user.name']}</td>
                      <td>{course['level.name']}</td>
                      <td>{course['book_collection.name']}</td>
                      <td>{Number(course.price) === 0 ? "رایگان" : course.price}</td>
                      <td>{Number(course['offs.percent']) ? course['offs.percent'] : '-'}</td>
                      <td>
                      <button className={`py-1 px-2 rounded-lg text-white hover:text-white ${course.isCompleted ? "bg-green-600" : "bg-red-500"}`} onClick={()=>statusChangeHandler(course.id)}>
                        {course.isCompleted ? 'تکمیل شده' : "در حال برگزاری"}
                        </button>
                        </td>
                      <td>{course.score}</td>
                      <td>
                        <Link to={`video/${course.id}`} state={{cover : course.cover,video : course.introductionVideo}} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-amber-400"}>
                          مشاهده
                        </Link>
                      </td>
                      <td>
                        <Link to={`/sessions/${course.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-green-600"}>
                          مشاهده
                        </Link>
                      </td>
                      <td>
                        <Link to={`edit/${course.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500"}>
                          ویرایش
                        </Link>
                      </td>
                      <td>
                        <button className="py-1 px-2 rounded-lg text-white hover:text-white bg-red-500" onClick={()=>deleteCourseHandler(course.id)}>
                          حذف
                        </button>
                      </td>
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

          </>
        )
      }
    </div>
  )
}
