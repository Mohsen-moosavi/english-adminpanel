import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { answerToContact, changeStatusContact, deleteContact, getContacts, setAnswering, setOffset, setStatus } from '../redux/features/contactSlice'
import DataTable from '../components/modules/DataTable'
import { Link } from 'react-router-dom'
import moment from 'moment-jalaali'
import Pagination from '../components/modules/Pagination'
import Swal from 'sweetalert2'

export default function Contact() {

    const { contacts, contactCount, status, answering, offset, limit, isLoading } = useSelector(state => state.contactData)
    const dispatch = useDispatch()
    const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)

    useEffect(() => {
        dispatch(getContacts({ offset, limit, status, answering }))
    }, [status, answering])

    function paginationHandler(page) {
        dispatch(getContacts({ offset: page * limit, limit, status, answering }))
    }


    function showContactContent(content) {
        Swal.fire({
            text: content,
            confirmButtonText: 'تایید',
        })
    }

    function answerContactHandler(contactId, email) {
        Swal.fire({
            inputLabel: 'لطفا پاسخ خود را بنویسید.',
            input: 'text',
            confirmButtonText: 'تایید',
        }).then(result => {
            if (result.isConfirmed && result.value?.trim()) {
                dispatch(answerToContact({ limit, offset, status, answering, contactId, email, message: result.value.trim() }))
            }
        })
    }

    function deleteContactHandler(id) {
        Swal.fire({
            title: 'آیا از حذف اطمینان دارید؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'تایید',
            cancelButtonText: 'لغو',
        }).then(result => {
            if (result.isConfirmed) {
                if (contacts.length === 1) {
                    dispatch(deleteContact({ offset: 0, limit, status, answering, contactId: id }))
                    dispatch(setOffset(0))
                    setPaginatorChangerFlag(prev => !prev)
                } else {
                    dispatch(deleteContact({ offset, limit, status, answering, contactId: id }))
                }
            }
        })
    }


    function changeStatusContactHandler(id, newStatus) {
        Swal.fire({
            title: `آیا از تغییر به حالت ${newStatus === 'seen' ? 'خوانده شده' : 'خوانده نشده'} اطمینان دارید؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'تایید',
            cancelButtonText: 'لغو',
        }).then(result => {
            if (result.isConfirmed) {
                dispatch(changeStatusContact({ limit , offset , status ,answering ,contactId:id,newStatus }))
            }
        })
    }

    return (
        <div>
            <h3 className='page-title'>لیست پیغام ها</h3>

            <DataTable>
                <thead>
                    <tr>
                        <th>شماره</th>
                        <th>کاربر</th>
                        <th>ایمیل</th>
                        <th>تاریخ</th>
                        <th>پیغام</th>
                        <th>
                            <select name="status" className='bg-transparent' defaultValue={status} onChange={(e) => dispatch(setStatus(e.target.value))}>
                                <option value={''}>وضعیت</option>
                                <option value="seen">خوانده شده</option>
                                <option value="notSeen">خوانده نشده</option>
                            </select>
                        </th>
                        <th>
                            <select name="answering" className='bg-transparent' defaultValue={answering} onChange={(e) => dispatch(setAnswering(e.target.value))}>
                                <option value={''}>پاسخگویی</option>
                                <option value="answered">پاسخ داده شده</option>
                                <option value="notAnswered">بدون پاسخ</option>
                            </select>
                        </th>
                        <th>پاسخ</th>
                        <th>حذف</th>
                    </tr>
                </thead>
                {contacts.length ? (
                    <tbody>
                        {contacts?.map((contact, index) => (
                            <tr key={index}>
                                <td>{index + 1 + offset}</td>
                                <td>
                                    <Link to={`/users/${contact.user_id}`} >
                                        {contact.user?.name}
                                    </Link>
                                </td>
                                <td>{contact.email}</td>
                                <td>{moment(contact.created_at).format('jYYYY/jMM/jDD')}</td>
                                <td>
                                    <button disabled={isLoading} className='py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500' onClick={() => showContactContent(contact.message)}>
                                        مشاهده
                                    </button>
                                </td>
                                <td>
                                    {console.log("status=============================>" , contact.seen)}
                                    {contact.seen ? (
                                        <button disabled={isLoading} className='py-1 px-2 rounded-lg text-white hover:text-white bg-green-500' onClick={() => changeStatusContactHandler(contact.id,'notSeen')}>
                                            خوانده شده
                                        </button>
                                    ) : (
                                        <button disabled={isLoading} className='py-1 px-2 rounded-lg text-white hover:text-white bg-red-500' onClick={() => changeStatusContactHandler(contact.id,'seen')}>
                                            خوانده نشده
                                        </button>
                                    )}
                                </td>
                                <td className={contact.answered ? 'text-green-500':'text-red-500'}>{contact.answered ? 'پاسخ داده شده':'بدون پاسخ'}</td>
                                <td>
                                    <button disabled={isLoading} className='py-1 px-2 rounded-lg text-white hover:text-white bg-sky-500' onClick={() => answerContactHandler(contact.id, contact.email)}>
                                        پاسخ
                                    </button>
                                </td>
                                <td>
                                    <button disabled={isLoading} className='py-1 px-2 rounded-lg text-white hover:text-white bg-red-500' onClick={() => deleteContactHandler(contact.id)}>
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                ) : (<></>)}
            </DataTable>
            {contacts.length ? (<></>) :
                (<div className='text-center my-5'>
                    <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
                </div>
                )}
            {contacts.length ? (<Pagination itemsCount={contactCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} setOffset={setOffset} />) : null}
        </div>
    )
}
