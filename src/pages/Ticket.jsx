import React, { useEffect,  useState } from 'react'
import DataTable from '../components/modules/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../components/modules/Pagination';
import { deleteTicket, getTickets, setOffset, setStatus, setSubjecth } from '../redux/features/ticketSlice';
import moment from 'moment-jalaali';
import { Link, useLocation, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Ticket() {

    const {id : userId} = useParams()
    const {state} = useLocation()
    const { tickets, ticketsCount, status, subject, offset, limit, isLoading } = useSelector(state => state.ticketData)
    const dispatch = useDispatch()
    const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)

    useEffect(() => {
        dispatch(getTickets({ offset, limit, status, subject, userId }))
    }, [status, subject, userId])

    // async function createTicket() {
    //     try {
    //         const response = await apiPrivate(appJsonPostApi).post('/ticket', {subject : 'پول می خوام', message: 'این تیکت، شماره 10 است.' });
    //         console.log("response==============>", response)
    //     } catch (error) {
    //         console.log("error==============>", error)
    //     }
    // }

    function paginationHandler(page) {
        dispatch(getTickets({ offset: page * limit, limit, status, subject, userId }))
    }

    function deleteTicketHandler(id) {
        Swal.fire({
          title: 'آیا از حذف اطمینان دارید؟',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'تایید',
          cancelButtonText: 'لغو',
        }).then(result=>{
          if(result.isConfirmed){
            if (tickets.length === 1) {
                dispatch(deleteTicket({ id, offset: 0, limit, status, subject, userId }))
                dispatch(setOffset(0))
                setPaginatorChangerFlag(prev => !prev)
            } else {
                dispatch(deleteTicket({ id, offset, limit, status, subject, userId }))
            }
          }
        })
    }

    return (
        <div>
            <h3 className='page-title'>{state?.name ? `تیکت های ${state?.name}`:"لیست تیکت ها"}</h3>

            <DataTable>
                <thead>
                    <tr>
                        <th>شماره</th>
                        <th>کاربر</th>
                        <th>
                            <select name="Subject" className='bg-transparent' defaultValue={subject} onChange={(e) => dispatch(setSubjecth(e.target.value))}>
                                <option value={''}>موضوع</option>
                                <option value="fiscal">مالی</option>
                                <option value="scholastic">درسی</option>
                                <option value="counseling">مشاوره</option>
                                <option value="offer">پیشنهادات و انتقادات</option>
                                <option value="support">پشتیبانی سایت</option>
                                <option value="other">غیره</option>
                            </select>
                        </th>
                        <th>
                            <select name="status" className='bg-transparent' defaultValue={status} onChange={(e) => dispatch(setStatus(e.target.value))}>
                                <option value={''}>وضعیت</option>
                                <option value="open">انتظار</option>
                                <option value="pending">انتظار مجدد</option>
                                <option value="answered">پاسخ داده شده</option>
                                <option value="closed">بسته شده</option>
                            </select>
                        </th>
                        <th>عنوان</th>
                        <th>تاریخ ایجاد</th>
                        <th>آخرین تغییر</th>
                        <th>مشاهده</th>
                        <th>حذف</th>
                    </tr>
                </thead>
                {tickets.length ? (
                    <tbody>
                        {tickets?.map((ticket, index) => (
                            <tr key={index}>
                                <td>{index + 1 + offset}</td>
                                <td>
                                    <Link to={`/users/${ticket.user_id}`} >
                                        {ticket['user.name']}
                                    </Link>
                                </td>
                                <td>
                                    {ticket.subject === 'fiscal' ? 'مالی' :
                                        ticket.subject === 'scholastic' ? 'درسی' :
                                            ticket.subject === 'counseling' ? 'مشاوره' :
                                                ticket.subject === 'offer' ? 'پیشنهادات و انتقادات' :
                                                    ticket.subject === 'support' ? 'پشتیانی سایت' :
                                                        'غیره'
                                    }
                                </td>
                                <td className={
                                    ticket.status === 'open' ? 'text-red-500' :
                                        ticket.status === 'pending' ? 'text-orange-500' :
                                            ticket.status === 'answered' ? 'text-green-500' :
                                                'text-black'
                                }>
                                    {ticket.status === 'open' ? 'انتظار' :
                                        ticket.status === 'pending' ? 'انتظار مجدد' :
                                            ticket.status === 'answered' ? 'پاسخ داده شده' :
                                                'بسته شده'
                                    }
                                </td>
                                <td>{`${ticket.title?.slice(0,20)}...`}</td>
                                <td>{moment(ticket.created_at).format('jYYYY/jMM/jDD')}</td>
                                <td>{moment(ticket.updated_at).format('jYYYY/jMM/jDD')}</td>
                                <td>
                                    <Link to={`/tickets/${ticket.id}`} className='py-1 px-2 rounded-lg text-white hover:text-white bg-green-500'>
                                        مشاهده
                                    </Link>
                                </td>
                                <td>
                                    <button disabled={isLoading} className='py-1 px-2 rounded-lg text-white hover:text-white bg-red-500' onClick={() => deleteTicketHandler(ticket.id)}>
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (<></>)}
            </DataTable>
            {tickets.length ? (<></>) :
                (<div className='text-center my-5'>
                    <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
                </div>
                )}
            {tickets.length ? (<Pagination itemsCount={ticketsCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} setOffset={setOffset} />) : null}

        </div>
    )
}
