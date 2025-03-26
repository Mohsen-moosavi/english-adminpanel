import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import FormErrorMsg from '../components/modules/FormErrorMessag';
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import gregorian from 'react-date-object/calendars/gregorian'
import { getCourses, getCreatingData, setBookId, setLevelId, setOffset, setPriceStatus, setScoreStatus, setSearch, setStatus, setTeacherId } from '../redux/features/courseSlice'
import DataTable from '../components/modules/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../components/modules/Pagination';
import DatePicker from 'react-multi-date-picker';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { createNewOff} from '../redux/features/offSlice';
import Searcher from '../components/modules/Searcher';



export default function CreateOff() {

    const { courses, coursesCount, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus, offset, limit, isLoading, teachers, levels, bookCollections } = useSelector(state => state.courseData)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [onAllCourse, setOnAllCourse] = useState(false)
    const [selectedCoursesId, setSelectedCoursesId] = useState([])
    const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)

    useEffect(() => {
        dispatch(getCreatingData({}))
        
        return ()=>{resetCourseFinders()}
    }, [])
    

    useEffect(() => {
        dispatch(getCourses({ limit, offset: 0, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus }))
    }, [search, status, teacherId, bookId, levelId, priceStatus, scoreStatus])

    function resetCourseFinders(){
        dispatch(setSearch(''))
        dispatch(setStatus(''))
        dispatch(setTeacherId(''))
        dispatch(setBookId(''))
        dispatch(setLevelId(''))
        dispatch(setPriceStatus(''))
        dispatch(setScoreStatus(''))
    }


    const FormValidation = Yup.object({
        percent: Yup.number().required("لطفا درصد تخفیف را وارد کنید!.").max(100, 'درصد تخفیف نمی تواند از 100 بیشتر باشد.').min(1, 'درصد تخفیف نمی تواند از 1 کمتر باشد.'),
        times: Yup.number().min(-1,'میزان استفاده از 1 دفعه کمتر نمی تواند باشد.').max(1000, 'میزان استفاده از 1000 دفعه بیشتر نمی تواند باشد.').test({message : "مقدار وارد شده، معتبر نمی باشد.", test:(times=>times===0 ? false : true)}),
        isPublic: Yup.number().required("لطفا نوع تخفیف را مشخص کنید.").max(1,'لطفا نوع تخفیف را وارد کنید.').min(0,'لطفا نوع تخفیف را وارد کنید.'),
        code: Yup.string().min(8, 'کد تخفیف حداقل باید 8 کاراکتر باشد.').test({
            message: 'لطفا یک کد برای اعمال تخفیف بنویسید.',
            test: (code) => {
                if (Number(formik.values.isPublic) === 1 || code !=='') return true;
                return false;
            }
        }).optional()
    });

    const formik = useFormik({
        initialValues: {
            percent: '',
            times: '',
            isPublic: -1,
            code: '',
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {
            if (!selectedDate) {
                return toast.error("لطفا یک تاریخ انقضاء برای تخفیف مشخص کنید.")
            }
            const inputDate = new Date(selectedDate);
            const today = new Date();

            today.setHours(0, 0, 0, 0)
            inputDate.setHours(0, 0, 0, 0)

            if (inputDate < today) {
                return toast.error("تاریخ وارد شده، نمی تواند از امروز قبل تر باشد.")
            }

            if (!selectedCoursesId.length && !onAllCourse) {
                return toast.error("حداقل یک دوره را جهت اعمال تخفیف مشخص کنید.")
            }

            dispatch(createNewOff({ percent: values.percent, expire:new Date(selectedDate.convert(gregorian)), isPublic: values.isPublic, code: values.code, times: values.times === -1 ? null : values.times, courses: selectedCoursesId , isForAllCourses : onAllCourse ,navigate }))
        },
    });

    function paginationHandler(page) {
        dispatch(getCourses({ limit, offset: page * limit, search, status, teacherId, bookId, levelId, priceStatus, scoreStatus }))
    }

    function selectCourseChangeHandler(e, id) {
        if (e.target.checked) {
            setSelectedCoursesId(prev => [...prev, id])
            return;
        }
        setSelectedCoursesId(prev => prev.filter(item => item !== id))
    }

    function selectAllCoursesHandler(e) {
        if (e.target.checked) {
            setOnAllCourse(true)
            return
        }
        setOnAllCourse(false)
    }

    return (
        <div>
            <h4 className='page-title'>ایجاد تخفیف</h4>
            <form className='mb-4' onSubmit={formik.handleSubmit}>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-x-2 items-start">
                    <div className="form-btn-group">
                        <label htmlFor="create-off-input-1" className="form-label">در صد تخفیف:</label>
                        <input
                            type="number"
                            name='percent'
                            placeholder="درصد تخفیف را وارد کنید..."
                            className="form-input" id="create-off-input-1"
                            value={formik.values.percent}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                        {formik.touched.percent && formik.errors.percent ? (
                            <div className="w-full text-start">
                                <FormErrorMsg msg={formik.errors.percent} />
                            </div>
                        ) : null}
                    </div>


                    <div className="form-btn-group !items-stretch">
                        <label htmlFor="create-off-datapicker-input" className="form-label">انقضاء:</label>
                        <DatePicker
                            placeholder='YYYY/MM/DD'
                            name='expire'
                            id="create-off-datapicker-input"
                            value={selectedDate}
                            onChange={setSelectedDate}
                            calendar={persian}
                            locale={persian_fa}
                            minDate={new Date()}
                        />
                    </div>

                    <div className="form-btn-group">
                        <label htmlFor="create-off-input-3" className="form-label">تعداد مجاز استفاده:</label>
                        <input
                            type="number"
                            name='times'
                            placeholder="1- به معنای بی نهایت می باشد..."
                            className="form-input" id="create-off-input-3"
                            value={formik.values.times}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                        {formik.touched.times && formik.errors.times ? (
                            <div className="w-full text-start">
                                <FormErrorMsg msg={formik.errors.times} />
                            </div>
                        ) : null}
                    </div>

                    <div className="form-btn-group">
                        <label htmlFor="create-off-input-4" className="form-label">نوع تخفیف:</label>
                        <select
                        defaultValue={''}
                            name='isPublic'
                            className="form-input"
                            id="create-off-input-4"
                            value={formik.values.isPublic}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}>
                            <option value="">یک مورد را انتخاب کنید</option>
                            <option value={0} >تخفیف اختصاصی</option>
                            <option value={1}>تخفیف عمومی</option>
                        </select>
                        {formik.touched.isPublic && formik.errors.isPublic ? (
                            <div className="w-full text-start">
                                <FormErrorMsg msg={formik.errors.isPublic} />
                            </div>
                        ) : null}
                    </div>
                </div>

                {Number(formik?.values?.isPublic) === 0 ?
                (
                    <div className='grid grid-cols-1'>
                    <div className="form-btn-group">
                        <label htmlFor="create-off-input-5" className="form-label">کد تخفیف:</label>
                        <input
                            type="text"
                            name='code'
                            placeholder="یک کد تخفیف بسازید..."
                            className="form-input" id="create-off-input-5"
                            value={formik.values.code}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                        {formik.touched.code && formik.errors.code ? (
                            <div className="w-full text-start">
                                <FormErrorMsg msg={formik.errors.code} />
                            </div>
                        ) : null}
                    </div>
                </div>
                ) :null }

                <div className='mt-5'>
                    <h6 className='text-main-color font-bold font-lg mb-1'>لیست دوره ها:</h6>
                    <span className='text-main-color font-sm'>لطفا دوره های مد نظر برای اعمال تخفیف را مشخص کنید.</span>
                    <div className='mb-3 grid grid-cols-1 mt-3'>
                        
                        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ status, teacherId, bookId, levelId, priceStatus, scoreStatus, limit }} getter={getCourses} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
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
                                            <th>
                                                <input type="checkbox" name='all-course' onChange={selectAllCoursesHandler} />
                                            </th>
                                            <th>شماره</th>
                                            <th>نام</th>
                                            <th>
                                                <select name="teachers" className='bg-transparent' defaultValue={teacherId} onChange={(e) => dispatch(setTeacherId(e.target.value))}>
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
                                                <select name="bookCollections" className='bg-transparent' defaultValue={bookId} onChange={(e) => dispatch(setBookId(e.target.value))}>
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
                                                <select name="status" className='bg-transparent' defaultValue={status} onChange={(e) => dispatch(setStatus(e.target.value))}>
                                                    <option value={''}>وضعیت</option>
                                                    <option value="completed">کامل شده</option>
                                                    <option value="notCompleted">درحال برگزاری</option>
                                                </select>
                                            </th>
                                            <th>
                                                <select name="score" className='bg-transparent' defaultValue={scoreStatus} onChange={(e) => dispatch(setScoreStatus(e.target.value))}>
                                                    <option value={''}>امتیاز</option>
                                                    <option value="5">5</option>
                                                    <option value="4">4</option>
                                                    <option value="3">3</option>
                                                    <option value="2">2</option>
                                                    <option value="1">1</option>
                                                </select>
                                            </th>
                                        </tr>
                                    </thead>
                                    {courses.length ? (
                                        <tbody>
                                            {courses?.map((course, index) => (
                                                <tr key={index} className={`${Number(course.price)===0 ? '!text-red-300' : ''}`}>
                                                    <td>
                                                        <input type="checkbox" checked={Number(course.price)===0 ? false : onAllCourse ? course['offs.percent'] ? false : true : selectedCoursesId.includes[course.id]} disabled={Number(course.price)===0 ? true : onAllCourse ? true : course['offs.percent'] ? true : false} onChange={(e) => selectCourseChangeHandler(e, course.id)} />
                                                    </td>
                                                    <td>{index + 1 + offset}</td>
                                                    <td>{course.name}</td>
                                                    <td>{course['user.name']}</td>
                                                    <td>{course['level.name']}</td>
                                                    <td>{course['book_collection.name']}</td>
                                                    <td>{Number(course.price) === 0 ? "رایگان" : course.price}</td>
                                                    <td>{course.off === 0 ? '-' : course.off}</td>
                                                    <td className={course.isCompleted ? "text-green-600" : "text-red-500"}>{course.isCompleted ? 'تکمیل شده' : "در حال برگزاری"}</td>
                                                    <td>{course.score}</td>
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
                                {courses.length ? (<Pagination itemsCount={coursesCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} />) : ''}

                            </>
                        )
                    }
                </div>

                <div className="grid md:grid-cols-2 gap-x-2 gap-y-2 mt-5">
                    <Link to='/offs' className="form-submit !py-2 block w-full text-center !text-black !bg-gray-200 hover:!bg-gray-400">بازگشت</Link>
                    <input type="submit" disabled={isLoading} value={0 ? 'ویرایش نخفیف' : 'ایجاد تخفیف'}
                        className="form-submit !py-2 block w-full hover:opacity-70 transition-all" />
                </div>
            </form>
        </div>
    )
}
