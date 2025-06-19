import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeStatus, deleteTicketMessage, getTicketDetails, sendAnswerToTicket } from '../redux/features/ticketSlice'
import { Link, useNavigate, useParams } from 'react-router-dom'
import TicketBox from '../components/modules/TicketBox'
import TextBox from '../components/modules/TextBox'
import toast from 'react-hot-toast'
import { FaLongArrowAltRight } from 'react-icons/fa'
import Swal from 'sweetalert2'


export default function TicketDetails() {

    const dispatch = useDispatch()
    const { id } = useParams()
    const navigate = useNavigate()
    const { isLoading } = useSelector(state => state.ticketData)
    const [ticketDetails, setTicketDetails] = useState({})
    const [textBoxReseter, setTextBoxReseter] = useState(false)

    useEffect(() => {
        dispatch(getTicketDetails({ id, setTicketDetails, navigate }))
    }, [])

    function sendAnswerHandler(message) {
        if (!message?.trim()) {
            return toast.error("ابتدا یک متنی جهت ارسال پاسخ، وارد کنید!")
        }
        dispatch(sendAnswerToTicket({ id: ticketDetails.id, message, setTicketDetails, setTextBoxReseter }))
    }

    function deleteMessageHandler(messageId) {
                Swal.fire({
                  title: 'آیا از حذف اطمینان دارید؟',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'تایید',
                  cancelButtonText: 'لغو',
                }).then(result=>{
                  if(result.isConfirmed){
                    dispatch(deleteTicketMessage({ ticketId: ticketDetails.id, messageId, setTicketDetails, navigate }))
                  }
                })
    }

    function changeStatusHandler(){
        Swal.fire({
            title: `آیا از ${ticketDetails.status === 'closed' ? 'باز کردن تیکت' : 'بستن تیکت'} اطمینان دارید؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'تایید',
            cancelButtonText: 'لغو',
          }).then(result=>{
            if(result.isConfirmed){
                dispatch(changeStatus({ id : ticketDetails.id, setTicketDetails}))
            }
          })
    }


    return (
        <div className='relative flex flex-col justify-start flex-1'>
            <div className='inline-block'>
                <Link to={-1} className='flex items-center gap-x-2 text-main-color font-bold hover:text-secound-color'>
                    <FaLongArrowAltRight size={20}></FaLongArrowAltRight>
                    <span>بازگشت</span>
                </Link>
            </div>
            <h3 className='page-title !mb-1'>
                {ticketDetails?.subject === 'fiscal' ? 'تیکت مالی' :
                    ticketDetails?.subject === 'scholastic' ? 'تیکت درسی' :
                        ticketDetails?.subject === 'counseling' ? 'تیکت مشاوره' :
                            ticketDetails?.subject === 'offer' ? 'تیکت پیشنهادات و انتقادات' :
                                ticketDetails?.subject === 'support' ? 'تیکت پشتیانی سایت' :
                                    'غیره'
                }
            </h3>
            <h4 className='text-main-color mb-8 mx-auto'>{ticketDetails.title}</h4>

            <div>
                {ticketDetails.messages?.map((message, index) => (
                    <TicketBox key={index} message={message} isloading={isLoading} deleteMessageHandler={deleteMessageHandler} isUser={ticketDetails.user_id === (message.sender?.id)} />
                ))}

                <button
                    disabled={isLoading || ticketDetails.status === 'pending' || ticketDetails.status === 'open'}
                    className={`form-submitd text-white text-[12px] sm:text-sm rounded-xl py-2 md:py-3 my-4 mx-auto block max-w-[400px] w-full transition-all ${(ticketDetails.status === 'pending' || ticketDetails.status === 'open') ? 'opacity-50 !cursor-not-allowed' : 'hover:opacity-70'}  ${(ticketDetails.status === 'closed') ? 'bg-[#42855b]' : 'bg-[#a94646]'}`}
                    onClick={changeStatusHandler}
                    >
                        {ticketDetails.status === 'closed' ? 'باز کردن تیکت' : 'بستن تیکت'}
                    </button>
            </div>
            <div className='sticky bottom-2 left-0 w-full mt-auto'>
                <TextBox sendAnswerHandler={sendAnswerHandler} textBoxReseter={textBoxReseter} isloading={isLoading} />
            </div>
        </div>
    )
}
