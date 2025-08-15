import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteSession, getSessions, setFileStatus, setOffset, setSearch, setStatus } from '../redux/features/sessionSlice'
import { Link, useLocation, useParams } from 'react-router-dom'
import DataTable from '../components/modules/DataTable'
import Pagination from '../components/modules/Pagination'
import Searcher from '../components/modules/Searcher'
import Swal from 'sweetalert2'
import { ImSpinner6 } from 'react-icons/im'
import { FaLongArrowAltRight } from 'react-icons/fa'

export default function Session() {

  const { id } = useParams()
  const location = useLocation()
  const courseName = new URLSearchParams(location?.search)?.get("courseName")
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { sessions, sessionsCount, status, fileStatus, search, offset, limit, isLoading } = useSelector(state => state.sessionData)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    getter()
  }, [status, fileStatus])

  async function getter() {
    await dispatch(getSessions({ id, limit, offset, search, status, fileStatus }))
    if (!isPageLoaded) {
      setIsPageLoaded(true)
    }
  }

  function paginationHandler(page) {
    dispatch(getSessions({ id, limit, offset: page * limit, search, status, fileStatus }))
  }

  function deleteSessionHandler(sessionId) {
    Swal.fire({
      title: 'آیا از حذف اطمینان دارید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then(result => {
      if (result.isConfirmed) {
        if (sessions.length === 1) {
          dispatch(deleteSession({ id: sessionId, courseId: id, limit, offset: 0, search, status, fileStatus }))
          dispatch(setOffset(0))
          setPaginatorChangerFlag(prev => !prev)
        } else {
          dispatch(deleteSession({ id: sessionId, courseId: id, limit, offset, search, status, fileStatus }))
        }
      }
    })
  }


  return (
    <div>
      <div className='inline-block'>
        <Link to={'/courses'} className='flex items-center gap-x-2 text-main-color font-bold hover:text-secound-color'>
          <FaLongArrowAltRight size={20}></FaLongArrowAltRight>
          <span>لیست دوره ها</span>
        </Link>
      </div>
      <h3 className='page-title'>
        <span>{`جلسات ${courseName ? "دوره ی" :""}`}</span><br />
        <span>{courseName || ""}</span>
      </h3>


      <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
        <Link to='create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن جلسه جدید</Link>
        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ id, limit, status, fileStatus }} getter={getSessions} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
      </div>

      {isPageLoaded ? (
        <>
          <DataTable>
            <thead>
              <tr>
                <th>شماره</th>
                <th>عنوان</th>
                <th>
                  <select name="status" className='bg-transparent' value={status} onChange={(e) => dispatch(setStatus(e.target.value))}>
                    <option value={''}>وضعیت</option>
                    <option value="free">رایگان</option>
                    <option value="notFree">غیر رایگان</option>
                  </select>
                </th>
                <th>مدت</th>
                <th>
                  <select name="fileStatus" className='bg-transparent' value={fileStatus} onChange={(e) => dispatch(setFileStatus(e.target.value))}>
                    <option value={''}>فایل پیوست</option>
                    <option value="fileExist">با پیوست</option>
                    <option value="fileNotExist">بدون پیوست</option>
                  </select>
                </th>
                <th>مشاهده</th>
                <th>حذف</th>
              </tr>
            </thead>
            {sessions.length ? (
              <tbody>
                {sessions?.map((session, index) => (
                  <tr key={index}>
                    <td>{index + 1 + offset}</td>
                    <td>{session.name}</td>
                    <td className={session.isFree ? 'text-green-500' : 'text-red-500'}>{session.isFree ? 'رایگان' : 'غیر رایگان'}</td>
                    <td>{String(session.time).split(":").map(i => { if (Number(i) < 10) { return `0${i}` } else { return i } }).join(':')}</td>
                    <td className={session.file ? 'text-green-500' : 'text-red-500'}>{session.file ? 'دارد' : 'ندارد'}</td>
                    <td>
                      <Link to={`edit/${session.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-green-500"}>
                        مشاهده
                      </Link>
                    </td>
                    <td>
                      <button disabled={isLoading} className="py-1 px-2 rounded-lg text-white hover:text-white bg-red-500" onClick={() => deleteSessionHandler(session.id)}>
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (<></>)}
          </DataTable>
          {sessions.length ? (<></>) :
            (<div className='text-center my-5'>
              <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
            </div>
            )}
          {sessions.length ? (<Pagination itemsCount={sessionsCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} setOffset={setOffset} reseter={paginatorChangerFlag} />) : ''}
        </>
      ) : (
        <div className='flex justify-center mt-5'>
          <ImSpinner6 size={50} color='#56abc9' className='animate-[spin_2s_linear_infinite]' />
        </div>
      )}

    </div>
  )
}
