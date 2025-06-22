import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { deleteBook, getBooks, setOffset, setSearch } from '../redux/features/bookSlice'
import DataTable from '../components/modules/DataTable'
import Pagination from '../components/modules/Pagination'
import Searcher from '../components/modules/Searcher'
import Swal from 'sweetalert2'

export default function BookCollections() {
  const isInitialised = useRef(false)
  const {tagId} = useParams()
  const {state} = useLocation()
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { books, booksCount, search, limit, offset, isLoading } = useSelector(state => state.bookData)

  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true
      dispatch(getBooks({ limit, offset: 0, tagId }))
    }
  }, [])

  // useEffect(() => {
  //   dispatch(getArticles({ limit, offset: 0 , search, status, writerId}))
  // }, [status , writerId])

  function paginationHandler(page) {
    dispatch(getBooks({ limit, offset: page * limit, search, tagId }))
  }

  function deleteBookHandler(id) {
        Swal.fire({
          title: 'آیا از حذف اطمینان دارید؟',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'تایید',
          cancelButtonText: 'لغو',
        }).then(result=>{
          if(result.isConfirmed){
            if (books.length === 1) {
              dispatch(deleteBook({ id, limit, offset: 0, search, tagId }))
              setPaginatorChangerFlag(prev => !prev)
              dispatch(setOffset(0))
            } else {
              dispatch(deleteBook({ id, limit, offset, search, tagId }))
            }
          }
        })
  }

  // function statusChangeHandler(e){
  //   dispatch(setStatus(e.target.value))
  // }

  return (
    <div>
      <h3 className='page-title'>{`مجموعه کتاب ها ${state?.tagName ? `با تگ ${state.tagName}` : ''}`}</h3>


      <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
        <Link to='create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>ایجاد مجموعه کتاب جدید</Link>
        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ limit }} getter={getBooks} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
      </div>
      <>
        <DataTable>
          <thead>
            <tr>
              <th>شماره</th>
              <th>نام</th>
              <th>لینک</th>
              <th>گروه سنی</th>
              <th>مخصوص کودکان</th>
              <th>سطح</th>
              <th>ویرایش</th>
              <th>حذف</th>
            </tr>
          </thead>
          {books.length ? (
            <tbody>
              {books?.map((book, index) => (
                <tr key={index}>
                  <td>{index + 1 + offset}</td>
                  <td>{book.name}</td>
                  <td>{book.slug}</td>
                  <td>{book.ageGrate}</td>
                  <td>{book.forChildren === 1 ? "کودکان": '-'}</td>
                  <td>{book.grate}</td>
                  <td>
                    <Link to={`/books-collection/edit/${book.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500"}>
                      ویرایش
                    </Link>
                  </td>
                  <td>
                    <button className="py-1 px-2 rounded-lg text-white hover:text-white bg-red-500" onClick={() => deleteBookHandler(book.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (<></>)}
        </DataTable>
        {books.length ? (<></>) :
          (<div className='text-center my-5'>
            <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
          </div>
          )}
        {books.length ? (<Pagination itemsCount={booksCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} setOffset={setOffset} reseter={paginatorChangerFlag} />) : null}

      </>
    </div>
  )
}
