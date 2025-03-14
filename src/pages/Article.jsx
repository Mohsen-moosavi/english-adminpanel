import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteArticle, getArticles, setOffset, setSearch, setStatus } from '../redux/features/articleSlice'
import DataTable from '../components/modules/DataTable'
import Search from '../components/modules/SearchArticle'
import constants from '../constant/environment'
import Pagination from '../components/modules/Pagination'

export default function Article() {

  const isInitialised = useRef(false)
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { articles, articlesCount, search, limit, offset, isLoading, status, writerId } = useSelector(state => state.articleData)

  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true
      dispatch(getArticles({ limit, offset: 0 }))
    }
  }, [])

  useEffect(() => {
    dispatch(getArticles({ limit, offset: 0 , search, status, writerId}))
  }, [status , writerId])

  function paginationHandler(page) {
    dispatch(getArticles({ limit, offset: page * limit, search, status, writerId }))
  }

  function deleteArticleHandler(id) {
    swal({
      title: 'آیا از حذف اطمینان دارید؟',
      icon: 'warning',
      buttons: ['لغو', 'تایید'],
    }).then(value => {
      if (value) {
        if (articles.length === 1) {
          dispatch(deleteArticle({ id, limit, offset: 0, search, status, writerId }))
          setPaginatorChangerFlag(prev => !prev)
          dispatch(setOffset(0))
        } else {
          dispatch(deleteArticle({ id, limit, offset, search, status, writerId }))
        }
      }
    })
  }

  function statusChangeHandler(e){
    dispatch(setStatus(e.target.value))
  }

  return (
    <div>
      <h3 className='page-title'>لیست مقاله ها</h3>
      {!articles.length && search === '' ?
        (
          <>
            <div className='text-center mb-5'>
              <h5 className='text-red-400 text-lg'>هنوز موردی وجود ندارد!</h5>
            </div>
            <div className='mb-3 grid grid-cols-1'>
              <Link to='create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن مقاله جدید</Link>
            </div>
          </>
        )
        : (<>
          <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2'>
            <Link to='create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن مقاله جدید</Link>
            <Search setPaginatorChangerFlag={setPaginatorChangerFlag} sliceName={'articleData'} setSearch={setSearch} defaultValue={search} />
          </div>
          {articles.length ? (
            <>
              <DataTable>
                <thead>
                  <tr>
                    <th>شماره</th>
                    <th>نام</th>
                    <th>لینک</th>
                    <th>
                      <select name="status" className='bg-transparent' defaultValue={status} onChange={statusChangeHandler}>
                        <option value="" selected>وضعیت</option>
                        <option value="draft">پیش نویس</option>
                        <option value="published">منتشر شده</option>
                      </select>
                    </th>
                    <th>نویسنده</th>
                    <th>مشاهده</th>
                    <th>ویرایش</th>
                    <th>حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {articles?.map((article, index) => (
                    <tr key={index}>
                      <td>{index + 1 + offset}</td>
                      <td>{article.title}</td>
                      <td>{article.slug}</td>
                      <td>{article.isPublished ? "منتشر شده" : "پیش نویس"}</td>
                      <td>{article['user.name']}</td>
                      <td>
                        <a target='_blank' href={`${constants.MAIN_URL}/article/${article.slug}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-green-700"}>
                          مشاهده
                        </a>
                      </td>
                      <td>
                        <Link to={`edit/${article.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500"}>
                          ویرایش
                        </Link>
                      </td>
                      <td>
                        <button className="py-1 px-2 rounded-lg text-white hover:text-white bg-red-500" onClick={() => deleteArticleHandler(article.id)}>
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
              <Pagination itemsCount={articlesCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} setOffset={setOffset} reseter={paginatorChangerFlag} />
            </>
          ) :
            (<div className='text-center my-5'>
              <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
            </div>)}
        </>)}
    </div>
  )
}
