import React, { useEffect, useRef, useState } from 'react'
import DataTable from '../components/modules/DataTable'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../components/modules/Pagination';
import { getFinders, getUsers, setDeletedUser, setLevelStatus, setOffset, setPurchaseStatus, setRoleStatus, setScorePriority, setScoreStatus } from '../redux/features/usersSlice'
import moment from 'moment-jalaali';
import SearchName from '../components/templates/SearchUserByName';
import SearchPhone from '../components/templates/SearchUserByPhone';

export default function Users() {


  const isInitialised = useRef(false)
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const [allRoles, setAllRoles] = useState([])
  const [allLevels, setAllLevels] = useState([])
  const { users, usersCount, searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority, limit, offset } = useSelector(state => state.usersData)

  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true
      dispatch(getFinders({ setAllRoles, setAllLevels }))
    }
    dispatch(getUsers({ searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority, limit, offset }))
  }, [searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser])

  function paginationHandler(page) {
    dispatch(getUsers({ offset: page * limit, limit, searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority }))
  }

  function setScoreStatusHandler(event) {
    const newScoreStatus = event.target.value;
    dispatch(setScoreStatus(newScoreStatus))
    if (newScoreStatus === '') {
      dispatch(setScorePriority(0))
    } else if (purchaseStatus === '') {
      dispatch(setScorePriority(1))
    }
  }

  function setPurchaseStatusHandler(event) {
    const newPurchaseStatus = event.target.value;
    dispatch(setPurchaseStatus(newPurchaseStatus))

    if (newPurchaseStatus === '') {
      dispatch(setScorePriority(1))
    }
  }

  return (
    <div>
      <h3 className='page-title'>لیست کاربران</h3>

      <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-2'>
        <SearchName setPaginatorChangerFlag={setPaginatorChangerFlag} />
        <SearchPhone setPaginatorChangerFlag={setPaginatorChangerFlag} />
        <div className="form-btn-group !m-0">
          <select className="form-input" defaultValue={deletedUser} onChange={(e) => dispatch(setDeletedUser(e.target.value))}>
            <option value={0}>کاربران موجود</option>
            <option value={1}>کاربران حذف شده</option>
          </select>
        </div>
      </div>

      <DataTable>
        <thead>
          <tr>
            <th>شماره</th>
            <th>نام</th>
            <th>نام کاربری</th>
            <th>تلفن</th>
            <th>
              <select name="role" className='bg-transparent' defaultValue={Number(roleStatus)} onChange={(e) => dispatch(setRoleStatus(e.target.value))}>
                <option value="">نقش</option>
                {allRoles?.map((role, index) => (
                  <option key={index} value={role.id} selected={role.id === Number(roleStatus)}>{role.name}</option>
                ))}
              </select>
            </th>
            <th>
              <select name="levels" className='bg-transparent' defaultValue={levelStatus} onChange={e => dispatch(setLevelStatus(e.target.value))}>
                <option value="">سطح</option>
                {allLevels?.map((level, index) => (
                  <option value={level.id} key={index} selected={Number(levelStatus) === level.id}>{level.name}</option>
                ))}
              </select>
            </th>
            <th>
              <select name="score" className='bg-transparent' defaultValue={scoreStatus} onChange={setScoreStatusHandler}>
                <option value="">امتیاز</option>
                <option value="max">بیشترین امتیاز</option>
                <option value="min">کم ترین امتیاز</option>
              </select>
            </th>
            <th>
              <select name="price" className='bg-transparent' defaultValue={purchaseStatus} onChange={setPurchaseStatusHandler}>
                <option value="">میزان خرید</option>
                <option value="max">بیشترین خرید</option>
                <option value="min">کم ترین خرید</option>
              </select>
            </th>
            <th>تاریخ پیوستن</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        {users.length ? (
          <tbody>
            {users?.map((user, index) => (
              <tr key={index}>
                <td>{index + 1 + offset}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.phone}</td>
                <td className={user.roleName === 'USER' ? '' : 'text-green-500'}>{user.roleName}</td>
                <td className={user.levelName === 'No Level' ? 'text-red-500' : ''}>{user.levelName === 'No Level' ? 'تعیین نشده' : user.levelName}</td>
                <td>{user.score}</td>
                <td>{user.totalSpent}</td>
                <td>{moment(user.created_at).format('jYYYY/jMM/jDD')}</td>
                <td>
                  <Link to={`${user.id}`} className='py-1 px-2 rounded-lg text-white hover:text-white bg-green-500'>
                    مشاهده
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (<></>)}
      </DataTable>
      {users.length ? (<></>) :
        (<div className='text-center my-5'>
          <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
        </div>
        )}
      {users.length ? (<Pagination itemsCount={usersCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} setOffset={setOffset} />) : null}

    </div>
  )

  // return (
  //   <div>
  //     <h3 className='page-title'>لیست کاربران</h3>
  //     <DataTable>
  //       <thead>
  //         <tr>
  //           <th>شماره</th>
  //           <th>نام</th>
  //           <th>نام کاربری</th>
  //           <th>تلفن</th>
  //           <th>
  //             <select name="price" className='bg-transparent'>
  //               <option value="" selected>میزان خرید</option>
  //               <option value="">کم ترین خرید</option>
  //               <option value="">بیشترین خرید</option>
  //             </select>
  //           </th>
  //           <th>
  //             <select name="level" className='bg-transparent'>
  //               <option value="" selected>سطح</option>
  //               <option value="">سطح A+</option>
  //               <option value="">سطح B+</option>
  //             </select>
  //           </th>
  //           <th>
  //             <select name="score" className='bg-transparent'>
  //               <option value="" selected>امتیاز</option>
  //               <option value="">بیشترین امتیاز</option>
  //               <option value="">کم ترین امتیاز</option>
  //             </select>
  //           </th>
  //           <th>
  //             <select name="date" className='bg-transparent'>
  //               <option value="" selected>پیوستن</option>
  //               <option value="">قدیمی ترین</option>
  //               <option value="">جدید ترین</option>
  //             </select>
  //           </th>
  //           <th>افزودن دوره</th>
  //           <th>تغییر نقش</th>
  //           <th>بن</th>
  //           <th>حذف</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         <tr>
  //           <td>1</td>
  //           <td>سید محسن موسوی ساعی</td>
  //           <td>mohsen.wsx</td>
  //           <td>09382646981</td>
  //           <td>1300000</td>
  //           <td>B+</td>
  //           <td>400</td>
  //           <td>02/11/1403</td>
  //           <td>
  //             <Link to={'1/create-sale'} state={{ userName: 'محسن موسوی' }} className={"py-1 px-2 rounded-lg text-white hover:text-white bg-green-500"}>
  //               افزودن
  //             </Link>
  //           </td>
  //           <td>
  //             <button className="py-1 px-2 rounded-lg text-white bg-green-500">
  //               تغییر
  //             </button>
  //           </td>
  //           <td>
  //             <button className="py-1 px-2 rounded-lg text-white bg-orange-500">
  //               بن
  //             </button>
  //           </td>
  //           <td>
  //             <button className="py-1 px-2 rounded-lg text-white bg-red-500">
  //               حذف
  //             </button>
  //           </td>
  //         </tr>
  //       </tbody>
  //     </DataTable>
  //   </div>
  // )
}
