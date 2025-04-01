import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteOff, getOffs, setOffset, setOrderStatus, setPublicStatus, setSearch } from '../redux/features/offSlice'
import DataTable from '../components/modules/DataTable'
import Pagination from '../components/modules/Pagination'
import moment from 'moment-jalaali'
import Searcher from '../components/modules/Searcher'
import Swal from 'sweetalert2'

export default function Off() {

  const { offs, offsCount, offset, limit, search, orderStatus, publicStatus, isLoading } = useSelector(state => state.offData)
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)

  useEffect(() => {
    dispatch(getOffs({ limit, offset: 0, search, publicStatus, orderStatus }))
  }, [publicStatus, orderStatus])

  function paginationHandler(page) {
    dispatch(getOffs({ limit, offset: page * limit, search, orderStatus, publicStatus }))
  }

  function deleteOffHandler(id) {
        Swal.fire({
          title: 'آیا از حذف اطمینان دارید؟',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'تایید',
          cancelButtonText: 'لغو',
        }).then(result=>{
          if(result.isConfirmed){
            if (offs.length === 1) {
              dispatch(deleteOff({ id, limit, offset: 0, search, publicStatus, orderStatus }))
              setPaginatorChangerFlag(prev => !prev)
              dispatch(setOffset(0))
            } else {
              dispatch(deleteOff({ id, limit, offset: 0, search, publicStatus, orderStatus }))
            }
          }
        })
  }

  return (
    <div>
      <h3 className='page-title'>لیست تخفیف ها</h3>

      <div className='mb-3 grid md:grid-cols-3 grid-cols-1 gap-x-2 gap-y-2'>
        <Link to='create' className='bg-main-color rounded-[10px] text-center text-white hover:bg-main-color/70 hover:text-white p-2'>افزودن تخفیف جدید</Link>
        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ publicStatus, orderStatus, limit }} getter={getOffs} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
        <div className="form-btn-group !m-0">
          <select className="form-input" defaultValue={orderStatus} onChange={(e) => dispatch(setOrderStatus(e.target.value))}>
            <option value="">مرتب سازی</option>
            <option value="expired">منقضی شده</option>
            <option value="maxPercent">بیشترین درصد تخفیف</option>
            <option value="minPercent">کمترین درصد تخفیف</option>
            <option value="maxExpire">بیشترین فرصت باقی مانده</option>
            <option value="minExpire">کمترین فرصت باقی مانده</option>
            <option value="maxTimes">بیشترین دفعات مجاز</option>
            <option value="minTimes">کمترین دفعات مجاز</option>
            <option value="infinity">بدون محدودیت استفاده</option>
            <option value="maxRemaining">بیشترین دفعات باقی مانده</option>
            <option value="minRemaining">کمترین دفعات باقی مانده</option>
            <option value="finishRemaining">پایان دفعات باقی مانده</option>
          </select>
        </div>
      </div>

      <DataTable>
        <thead>
          <tr>
            <th>شماره</th>
            <th>دوره</th>
            <th>درصد</th>
            <th>کد</th>
            <th>انقضاء</th>
            <th>مقدار استفاده</th>
            <th>مقدار باقی مانده</th>
            <th>
              <select className='bg-transparent' defaultValue={publicStatus} onChange={(e) => dispatch(setPublicStatus(e.target.value))}>
                <option value={''}>وضعیت</option>
                <option value={"public"}>عمومی</option>
                <option value={"private"}>اختصاصی</option>
              </select>
            </th>
            <th>سازنده</th>
            <th>ویرایش</th>
            <th>حذف</th>
          </tr>
        </thead>
        {offs.length ? (
          <tbody>
            {offs?.map((off, index) => (
              <tr key={index}>
                <td>{index + 1 + offset}</td>
                <td>{off['course.name']}</td>
                <td>{off.percent}</td>
                <td>{off.code ? off.code : '-'}</td>
                <td className={`${moment(off.expire).format('jYYYY/jMM/jDD') >= moment(new Date()).format('jYYYY/jMM/jDD') ? "text-green-600" : "text-red-500"}`}>{moment(off.expire).format('jYYYY/jMM/jDD')}</td>
                <td className={`${off.times ? "text-red-500" : "text-green-600"}`}>{off.times ? off.times : 'نامحدود'}</td>
                <td className={`${off.remainingTimes === 0 ? "text-red-500" : "text-green-600"}`}>{(off.remainingTimes === 0 || off.remainingTimes > 0) ? off.remainingTimes : 'نامحدود'}</td>
                <td className={`${off.public ? "text-green-600" : "text-red-500"}`}>{off.public === 1 ? 'عمومی' : "اختصاصی"}</td>
                <td>{off['creator.name']}</td>
                <td>
                  <Link to={`edit/${off.id}`} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-blue-500"}>
                    ویرایش
                  </Link>
                </td>
                <td>
                  <button className="py-1 px-2 rounded-lg text-white hover:text-white bg-red-500" onClick={() => deleteOffHandler(off.id)}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (<></>)}
      </DataTable>
      {offs.length ? (<></>) :
        (<div className='text-center my-5'>
          <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
        </div>
        )}
      {offs.length ? (<Pagination itemsCount={offsCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} setOffset={setOffset} reseter={paginatorChangerFlag} />) : ''}
    </div>
  )
}
