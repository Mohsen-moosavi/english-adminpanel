import moment from 'moment-jalaali'
import React, { useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaStar, FaTrash } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import { MdFileDownloadDone } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { answerToCommentInCommentLoop, changeAccept, changeAcceptInCommentLoop, deleteCommentInCommentLoop } from '../../redux/features/commentSlice'
import { useNavigate } from 'react-router-dom'
import { FaPencil } from 'react-icons/fa6'

export default function CommentBox({ comment, mainCommentId , courseId }) {

    const menuElm = useRef()
    const dispatch = useDispatch()
    const navigator = useNavigate()

    function showingMenuHandler() {
        menuElm.current.classList.toggle('display-none')
        menuElm.current.classList.toggle('h-[0]')
    }

    function hideMenuHandler(e) {
        if (e.target.id !== `menu_buuton_${comment.id}` && e.target.parentElement.id !== `menu_buuton_${comment.id}`) {
            menuElm.current.classList.add('display-none')
            menuElm.current.classList.add('h-[0]')
        }
    }

    function changeAcceptCommentHandler(id, accept) {
        swal({
            title: `آیا از ${accept ? 'تایید' : 'رد'} کامنت اطمینان دارید؟`,
            icon: 'warning',
            buttons: ['لغو', 'تایید'],
        }).then(value => {
            if (value) {
                dispatch(changeAcceptInCommentLoop({ id, accept }))
            }
        })
    }

    function deleteCommentHandler(id , mainCommentId) {
        swal({
            title: 'آیا از حذف اطمینان دارید؟ در صورت حذف، تمام کامنت های پاسخ به این مورد نیز، حذف می شوند.',
            icon: 'warning',
            buttons: ['لغو', 'تایید'],
        }).then(value => {
            if (value) {
                dispatch(deleteCommentInCommentLoop({ id, mainCommentId, navigator }))
            }
        })
    }

    function answerCommentHandler(mainCommentId,courseId, parentId){
        swal({
            title: 'لطفا پاسخ خود را بنویسید.',
            content : 'input',
            buttons: 'تایید',
        }).then(value => {
            if (value) {
                dispatch(answerToCommentInCommentLoop({id : mainCommentId, content : value, courseId, parentId, navigator }))
            }
        })
    }

    return (
        <>
            <div className={`relative border-[3px] border-solid rounded-xl mb-3 ${comment.isAccept === 1 ? 'border-main-color bg-green-800/30' : comment.isAccept === 0 ? 'border-red-500 bg-red-500/10' : 'border-sky-800 bg-sky-400/10'} ${Number(mainCommentId) === Number(comment.id) ? '!border-yellow-800 !bg-yellow-500/20' : ''} mb-5`} onClick={hideMenuHandler}>
                <div
                    className="flex items-center gap-x-2 border-b border-solid border-gray-400 mx-2 py-2">
                    <img src={comment?.user?.avatar} alt="user"
                        className="rounded-full w-[50px] max-md:w-[30px] bg-green-800/50" />
                    <div className="flex flex-col">
                        <span className="text-main-color max-md:text-[12px] font-bold">{comment?.user?.name}</span>
                        <div className='flex items-center gap-x-3'>
                            <span className="text-[12px] max-md:text-[8px] text-gray-500">{moment(comment.created_at).format('jYYYY/jMM/jDD')}</span>
                            <div className='flex'>
                                {comment.score ? Array(comment.score).fill(0).map((n, i) => (<FaStar key={i} className='w-[12px] max-md:w-[8px]' color='#cfbd4f' />)): null}
                            </div>
                        </div>
                    </div>
                    <HiDotsVertical id={`menu_buuton_${comment.id}`} className='mr-auto cursor-pointer' onClick={showingMenuHandler} />
                    <ul className='absolute left-5 top-10 rounded-xl bg-[#b5d1d1] shadow-shadow-low z-10 overflow-hidden display-none h-[0]' ref={menuElm}>
                        {(comment.isAccept === 0 || comment.isAccept === null) ? (
                            <li>
                                <button className='flex justify-between items-center w-[100px] px-2 py-1 border-b border-solid border-gray-400 hover:shadow-shadow-low' onClick={() => changeAcceptCommentHandler(comment.id, true)}>
                                    <span>تایید</span>
                                    <MdFileDownloadDone />
                                </button>
                            </li>
                        ) : null}
                        {(comment.isAccept === 1 || comment.isAccept === null) ? (
                            <li>
                                <button className='flex justify-between items-center w-[100px] px-2 py-1 border-b border-solid border-gray-400 hover:shadow-shadow-low' onClick={() => changeAcceptCommentHandler(comment.id, false)}>
                                    <span>رد</span>
                                    <AiOutlineClose />
                                </button>
                            </li>
                        ) : null}

                        <li>
                            <button className='flex justify-between items-center w-[100px] px-2 py-1 border-b border-solid border-gray-400 hover:shadow-shadow-low' onClick={() => answerCommentHandler(mainCommentId, courseId, comment.id)}>
                                <span>پاسخ</span>
                                <FaPencil />
                            </button>
                        </li>

                        <li>
                            <button className='flex justify-between items-center w-[100px] px-2 py-1 hover:shadow-shadow-low' onClick={() => deleteCommentHandler(comment.id, mainCommentId)}>
                                <span>حذف</span>
                                <FaTrash />
                            </button>
                        </li>
                    </ul>
                </div>
                <p className="text-gray-700 text-[16px] max-md:text-[12px] my-2 px-2">{comment.content}</p>
            </div>

            <div className='mr-2 md:mr-10 rounded-xl border-solid border-r-2 border-main-color'>
                {comment.children?.map((comment, index) => <CommentBox key={index} mainCommentId={mainCommentId} comment={comment} />)}
            </div>
        </>
    )
}
