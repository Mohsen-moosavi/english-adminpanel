import { useEffect, useState } from 'react'
import Searcher from '../modules/Searcher'
import { deleteSale, getSales, setEndDate, setOffset, setPriceStatus, setSaleStatus, setSearch, setStartDate, setStatus } from '../../redux/features/saleSlice'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '../modules/DataTable'
import moment from 'moment-jalaali'
import Pagination from '../modules/Pagination'
import { Link, useLocation, useParams } from 'react-router-dom'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import Swal from 'sweetalert2'
import { FaLongArrowAltRight } from 'react-icons/fa'


export default function ALlSales() {

  const dispatch = useDispatch()

  const {id : userId} = useParams()
  const { state } = useLocation()

  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const { sales, salesCount,totalPrice, search, status, startDate, endDate, saleStatus, offset, priceStatus, limit, isLoading } = useSelector(state => state.saleData)

  useEffect(() => {
    setPaginatorChangerFlag(prevValue=>!prevValue)
    dispatch(getSales({ limit, offset:0, search, status, saleStatus, priceStatus, userId, startDate, endDate }))
  }, [status, userId, startDate, endDate, saleStatus, priceStatus])

  function deleteSaleHandler(id) {
    Swal.fire({
      title: 'آیا از حذف اطمینان دارید؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then(result=>{
      if(result.isConfirmed){
        if (sales.length === 1) {
          dispatch(deleteSale({ id, limit, offset:0, search, status, saleStatus, priceStatus, userId, startDate, endDate }))
          setPaginatorChangerFlag(prev => !prev)
          dispatch(setOffset(0))
        } else {
          dispatch(deleteSale({ id,limit, offset, search, status, saleStatus, priceStatus, userId, startDate, endDate }))
        }
      }
    })
  }

  function paginationHandler(page) {
    dispatch(getSales({ limit, offset: page * limit, search, status, saleStatus, priceStatus, userId, startDate, endDate }))
  }

  function setStartDateHandler(date) {
    const formattedDate = new DateObject(date).set('hour', 0).set("minute", 0).set('second', 0).toDate().toISOString()
    dispatch(setStartDate(formattedDate))
  }

  function setEndDateHandler(date) {
    const formattedDate = new DateObject(date).set('hour', 23).set("minute", 59).set('second', 59).toDate().toISOString()
    dispatch(setEndDate(formattedDate))
  }

  return (
    <div>
      {state?.name ? (
        <div className='inline-block'>
          <Link to={-1} className='flex items-center gap-x-2 text-main-color font-bold hover:text-secound-color'>
            <FaLongArrowAltRight size={20}></FaLongArrowAltRight>
            <span>بازگشت</span>
          </Link>
        </div>
      ) :null}
      <h3 className='page-title'>{state?.name ? `لیست خرید ${state?.name}` :'لیست فروش دوره ها'}</h3>


      <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2 gap-y-2'>
        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ saleStatus, priceStatus, status, userId, startDate, endDate, limit }} getter={getSales} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
        <DatePicker
          placeholder='تاریخ شروع'
          name='startDate'
          id="create-off-datapicker-input"
          value={startDate}
          onChange={setStartDateHandler}
          calendar={persian}
          locale={persian_fa}
          maxDate={endDate ? new Date(endDate) : new Date()}
        />
        <DatePicker
          placeholder='تاریخ پایان'
          name='endDate'
          id="create-off-datapicker-input"
          value={endDate}
          onChange={setEndDateHandler}
          calendar={persian}
          locale={persian_fa}
          minDate={startDate ? new Date(startDate) : null}
        />
      </div>
      <>
        <DataTable>
          <thead>
            <tr>
              <th>شماره</th>
              <th>دوره</th>
              <th>کاربر</th>
              <th>تاریخ</th>
              <th>مبلغ پرداخت شده</th>
              <th>
                <select name="priceStatus" className='bg-transparent' value={priceStatus} onChange={(e) => dispatch(setPriceStatus(e.target.value))}>
                  <option value={''}>مبلغ اصلی</option>
                  <option value="free">رایگان</option>
                  <option value="notFree">غیر رایگان</option>
                </select>
              </th>
              <th>
                <select name="status" className='bg-transparent' value={status} onChange={(e) => dispatch(setStatus(e.target.value))}>
                  <option value={''}>تخفیف</option>
                  <option value="hasOff">تخفیف دار</option>
                  <option value="hasNotOff">بدون تخفیف</option>
                </select>
              </th>
              <th>درصد تخفیف</th>
              <th>
                <select name="saleStatus" className='bg-transparent' value={saleStatus} onChange={(e) => dispatch(setSaleStatus(e.target.value))}>
                  <option value={''}>خریدار</option>
                  <option value="user">کاربر</option>
                  <option value="admin">ادمین</option>
                </select>
              </th>
              <th>حذف</th>
            </tr>
          </thead>
          {sales.length ? (
            <tbody>
              {sales?.map((sale, index) => (
                <tr key={index}>
                  <td>{index + 1 + offset}</td>
                  <td>{sale.course_name}</td>
                  <td>
                    <Link to={`/users/${sale.user_id}`}>
                      {sale.user_name}
                    </Link>
                  </td>
                  <td>{moment(sale.created_at).format('jYYYY/jMM/jDD')}</td>
                  <td>{Number(sale.price)?.toLocaleString()}</td>
                  <td className={sale.mainPrice === 0 ? 'text-green-500' : ''}>{sale.mainPrice === 0 ? 'رایگان' : Number(sale.mainPrice)?.toLocaleString()}</td>
                  <td className={sale.off === 0 ? 'text-red-500' : ''}>{sale.off === 0 ? 'بدون تخفیف' : Number(sale.off)?.toLocaleString()}</td>
                  <td>{sale.offPercent === 0 ? '-' : sale.offPercent}</td>
                  <td>{sale.admin_id ?
                    (<Link className={"py-1 px-2 rounded-lg text-white hover:text-white bg-orange-400"} to={`/users/${sale.admin_id}`}>
                      {sale.admin_name}
                    </Link>)
                    : 'کاربر'}</td>
                  <td>
                    <button disabled={isLoading ||sale.admin_id} className={`py-1 px-2 rounded-lg text-white hover:text-white bg-red-500 ${sale.admin_id ? 'opacity-60' : ''}`} onClick={() => deleteSaleHandler(sale.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
              {sales.length ? (
                <tr className='bg-main-color/30'>
                  <td  colSpan={5}>مجموع مبالغ پرداختی</td>
                  <td  colSpan={5}>{Number(totalPrice).toLocaleString()}</td>
                </tr>
              ) : null}
            </tbody>
          ) : (<></>)}
        </DataTable>
        {sales.length ? (<></>) :
          (<div className='text-center my-5'>
            <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
          </div>
          )}
        {sales.length ? (<Pagination itemsCount={salesCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} setOffset={setOffset} />) : null}

      </>
    </div>
  )
}
