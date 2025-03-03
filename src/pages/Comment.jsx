import React, { useEffect, useRef, useState } from 'react'
import { createCommentsFunc } from '../services/comment.services';
import { authRequest } from '../services/authApi.service';
import { useDispatch, useSelector } from 'react-redux';
import { answerToComment, changeAccept, deleteComment, getComments, setParentStatus, setScore, setSearch, setStatus } from '../redux/features/commentSlice';
import { Link } from 'react-router-dom';
import DataTable from '../components/modules/DataTable';
import Pagination from '../components/modules/Pagination';
import Search from '../components/modules/SearchCommens';

export default function Comment() {

  const isInitialised = useRef(false)
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { comments, commentsCount, limit, offset, search, status, score, parentStatus , isLoading } = useSelector(state => state.commentData)


  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true
      dispatch(getComments({ limit: 10, offset: 0 }))
      // createComments()
    }
  }, [])

  async function createComments() {
    const comments = {
      content: 'سلام این کامنت 3 می باشد.',
      score: 5,
      courseId: 1,
      // parentId: 1
    }
    const { response, error } = await authRequest(createCommentsFunc(comments))

    console.log("result===>", error, response)
  }

  function paginationHandler(page) {
    dispatch(getComments({ limit, offset: page * limit, search, score, status, parentStatus }))
  }

  useEffect(() => {
    dispatch(getComments({ limit, offset: 0, search, score, status, parentStatus }))
  }, [score, status, parentStatus])

  function changeAcceptCommentHandler(id, accept) {
    swal({
      title: `آیا از ${accept ? 'تایید':'رد'} کامنت اطمینان دارید؟`,
      icon: 'warning',
      buttons: ['لغو', 'تایید'],
    }).then(value => {
      if (value) {
        dispatch(changeAccept({ id, accept, limit, offset, search, score, status, parentStatus }))
      }
    })
  }

  function deleteCourseHandler(id){
    swal({
          title: 'آیا از حذف اطمینان دارید؟ در صورت حذف، تمام کامنت های پاسخ به این مورد نیز، حذف می شوند.',
          icon: 'warning',
          buttons: ['لغو', 'تایید'],
        }).then(value => {
          if (value) {
            dispatch(deleteComment({ id, limit, offset: 0,  search, score, status, parentStatus }))
            setPaginatorChangerFlag(prev => !prev)
          }
        })
  }

  
  function answerCommentHandler(courseId, parentId){
    swal({
        title: 'لطفا پاسخ خود را بنویسید.',
        content : 'input',
        buttons: 'تایید',
    }).then(value => {
        if (value) {
            dispatch(answerToComment({content : value, courseId, parentId, limit, offset, search, score, status, parentStatus }))
        }
    })
}

  function showCommentContent(content){
    swal({
      title : content,
      buttons : 'تایید'
    })
  }

  return (
    <div>
      <h3 className='page-title'>لیست کامنت ها</h3>


      <div className='mb-3 grid grid-cols-1 gap-x-2'>
        <Search setPaginatorChangerFlag={setPaginatorChangerFlag} sliceName={'commentData'} setSearch={setSearch} />
      </div>

      {search !== '' && !comments.length ?
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
                  <th>دوره</th>
                  <th>
                    <select name="score" className='bg-transparent' onChange={(e) => dispatch(setScore(e.target.value))}>
                      <option value={''}>امتیاز</option>
                      <option value="5">5</option>
                      <option value="4">4</option>
                      <option value="3">3</option>
                      <option value="2">2</option>
                      <option value="1">1</option>
                      <option value="0">بدون امتیاز</option>
                    </select>
                  </th>
                  <th>کاربر</th>
                  <th>
                    <select name="type" className='bg-transparent' onChange={(e) => dispatch(setParentStatus(e.target.value))}>
                      <option value={''}>نوع</option>
                      <option value="main">اصلی</option>
                      <option value="answer">پاسخ</option>
                    </select>
                  </th>
                  <th>
                    <select name="status" className='bg-transparent' onChange={(e) => dispatch(setStatus(e.target.value))}>
                      <option value={''}>وضعیت</option>
                      <option value="accept">تایید شده</option>
                      <option value="notAccept">رد شده</option>
                      <option value="none">تعیین نشده</option>
                    </select>
                  </th>
                  <th>پیغام</th>
                  <th>حلقه</th>
                  <th>پاسخ</th>
                  <th>حذف</th>
                </tr>
              </thead>
              {comments.length ? (
                <tbody>
                  {comments?.map((comment, index) => (
                    <tr key={index}>
                      <td>{index + 1 + offset}</td>
                      <td>{comment['course.name']}</td>
                      <td>{comment.score ? comment.score : '-'}</td>
                      <td>{comment['user.name']}</td>
                      <td className={comment.parent_id ? 'text-orange-500' : 'text-blue-500'}>{comment.parent_id ? 'پاسخ' : 'اصلی'}</td>
                      <td>
                        {(comment.isAccept === 1) ? (
                          <button disabled={isLoading} className={`py-1 px-6 rounded-lg text-white hover:text-white bg-green-400`} onClick={() => changeAcceptCommentHandler(comment.id, false)}>
                            تایید شده
                          </button>
                        ) : (comment.isAccept === 0) ? (
                          <button disabled={isLoading} className={`py-1 px-6 rounded-lg text-white hover:text-white bg-red-400`} onClick={() => changeAcceptCommentHandler(comment.id, true)}>
                            رد شده
                          </button>
                        ) : (
                          <>
                            <button disabled={isLoading} className={`py-1 px-2 rounded-r-lg text-white hover:text-white bg-green-400`} onClick={() => changeAcceptCommentHandler(comment.id, true)}>
                              تایید
                            </button>
                            <button disabled={isLoading} className={`py-1 px-4 rounded-l-lg text-white hover:text-white bg-red-400`} onClick={() => changeAcceptCommentHandler(comment.id, false)}>
                              رد
                            </button>
                          </>
                        )}
                      </td>
                      <td>
                        <button disabled={isLoading} className="py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500" onClick={() => showCommentContent(comment.content)}>
                          پیغام
                        </button>
                      </td>
                      <td>
                        <Link to={`${comment.id}`} state={{courseId : comment['course.id'], courseName : comment['course.name']}} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-green-500"}>
                          مشاهده
                        </Link>
                      </td>
                      <td>
                        <button disabled={isLoading} className="py-1 px-2 rounded-lg text-white hover:text-white bg-orange-500" onClick={() =>answerCommentHandler(comment['course.id'], comment.id)}>
                          پاسخ
                        </button>
                      </td>
                      <td>
                        <button disabled={isLoading} className="py-1 px-2 rounded-lg text-white hover:text-white bg-red-500" onClick={() => deleteCourseHandler(comment.id)}>
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (<></>)}
            </DataTable>
            {comments.length ? (<></>) :
              (<div className='text-center my-5'>
                <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
              </div>
              )}
            {comments.length ? (<Pagination itemsCount={commentsCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} />) : ''}

          </>
        )
      }
    </div>
  )
}
