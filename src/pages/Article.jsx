import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { deleteArticle, getArticles, setOffset, setSearch, setStatus } from '../redux/features/articleSlice'
import DataTable from '../components/modules/DataTable'
import constants from '../constant/environment'
import Pagination from '../components/modules/Pagination'
import Searcher from '../components/modules/Searcher'
import Swal from 'sweetalert2'

export default function Article() {


   const {id : userId, tagId} = useParams()
  const {state} = useLocation()
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { articles, articlesCount, search, limit, offset, isLoading, status, writerId } = useSelector(state => state.articleData)

  // useEffect(() => {
  //   if (!isInitialised.current) {
  //     isInitialised.current = true
  //     dispatch(getArticles({ limit, offset: 0 }))
  //   }
  // }, [])

  useEffect(() => {
    dispatch(getArticles({ limit, offset: 0, search, status, writerId, userId,tagId }))
  }, [status, writerId , userId])

  function paginationHandler(page) {
    dispatch(getArticles({ limit, offset: page * limit, search, status, writerId,userId, tagId }))
  }

  function deleteArticleHandler(id) {

    Swal.fire({
      title: 'آیا از حذف اطمینان دارید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then(result=>{
      if(result.isConfirmed){
        if (articles.length === 1) {
          dispatch(deleteArticle({ id, limit, offset: 0, search, status, writerId ,userId, tagId }))
          setPaginatorChangerFlag(prev => !prev)
          dispatch(setOffset(0))
        } else {
          dispatch(deleteArticle({ id, limit, offset, search, status, writerId, userId, tagId }))
        }
      }
    })
  }

  return (
    <div>
      <h3 className='page-title'>{state?.name ? `مقاله های ${state?.name}`: state?.tagName ? `مقاله ها با تگ ${state.tagName}` :"لیست مقاله ها"}</h3>

      <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2'>
        {!!userId ? null: (<Link to='/articles/create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن مقاله جدید</Link>)} 
        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ limit, status, writerId , userId, tagId}} getter={getArticles} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
      </div>

      <DataTable>
        <thead>
          <tr>
            <th>شماره</th>
            <th>نام</th>
            <th>لینک</th>
            <th>
              <select name="status" className='bg-transparent' value={status} onChange={(e)=>dispatch(setStatus(e.target.value))}>
                <option value="">وضعیت</option>
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
        {articles.length ? (
          <tbody>
            {articles?.map((article, index) => (
              <tr key={index}>
                <td>{index + 1 + offset}</td>
                <td>{article.title}</td>
                <td>{article.slug}</td>
                <td>{article.isPublished ? "منتشر شده" : "پیش نویس"}</td>
                <td>
                  <Link to={`/users/${article['user.id']}`}>
                  {article['user.name']}
                  </Link>
                  </td>
                <td>
                  <a target='_blank' href={`${constants.MAIN_URL}/articles/${article.slug}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-green-700"}>
                    مشاهده
                  </a>
                </td>
                <td>
                  <Link to={`/articles/edit/${article.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500"}>
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
        ) : (<></>)}
      </DataTable>

      {articles.length ? (<></>) :
        (<div className='text-center my-5'>
          <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
        </div>
        )}
      {articles.length ? (<Pagination itemsCount={articlesCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} setOffset={setOffset} reseter={paginatorChangerFlag} />) : null}
    </div>
  )
}
