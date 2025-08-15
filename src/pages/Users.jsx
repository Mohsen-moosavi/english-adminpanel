import { useEffect, useRef, useState } from 'react'
import DataTable from '../components/modules/DataTable'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../components/modules/Pagination';
import { getFinders, getUsers, setBanStatus, setDeletedUser, setLevelStatus, setOffset, setPurchaseStatus, setRoleStatus, setScorePriority, setScoreStatus } from '../redux/features/usersSlice'
import moment from 'moment-jalaali';
import SearchName from '../components/templates/SearchUserByName';
import SearchPhone from '../components/templates/SearchUserByPhone';

export default function Users() {


  const isInitialised = useRef(false)
  const dispatch = useDispatch()
  const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
  const [allRoles, setAllRoles] = useState([])
  const [allLevels, setAllLevels] = useState([])
  const { users, usersCount, searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser,banStatus, scorePriority, limit, offset } = useSelector(state => state.usersData)

  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true
      dispatch(getFinders({ setAllRoles, setAllLevels }))
    }
    setPaginatorChangerFlag(prev=>!prev)
    dispatch(getUsers({ searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority,banStatus, limit, offset:0 }))
  }, [searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser,banStatus])

  function paginationHandler(page) {
    dispatch(getUsers({ offset: page * limit, limit, searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority,banStatus }))
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
          <select className="form-input" value={deletedUser} onChange={(e) => dispatch(setDeletedUser(e.target.value))}>
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
              <select name="role" className='bg-transparent' value={Number(roleStatus)} onChange={(e) => dispatch(setRoleStatus(e.target.value))}>
                <option value="">نقش</option>
                {allRoles?.map((role, index) => (
                  <option key={index} value={role.id} >{role.name}</option>
                ))}
              </select>
            </th>
            <th>
              <select name="levels" className='bg-transparent' value={levelStatus} onChange={e => dispatch(setLevelStatus(e.target.value))}>
                <option value="">سطح</option>
                {allLevels?.map((level, index) => (
                  <option value={level.id} key={index}>{level.name}</option>
                ))}
              </select>
            </th>
            <th>
              <select name="score" className='bg-transparent' value={scoreStatus} onChange={setScoreStatusHandler}>
                <option value="">امتیاز</option>
                <option value="max">بیشترین امتیاز</option>
                <option value="min">کم ترین امتیاز</option>
              </select>
            </th>
            <th>
              <select name="price" className='bg-transparent' value={purchaseStatus} onChange={setPurchaseStatusHandler}>
                <option value="">میزان خرید</option>
                <option value="max">بیشترین خرید</option>
                <option value="min">کم ترین خرید</option>
              </select>
            </th>
            <th>تاریخ پیوستن</th>
            <th>
              <select name="ban" className='bg-transparent' value={banStatus} onChange={e=> dispatch(setBanStatus(e.target.value))}>
                <option value="">بن</option>
                <option value="ban">بن شده</option>
                <option value="notBan">بن نشده</option>
              </select>
            </th>
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
                <td className={user.banDate ? 'text-red-400' : ''}>{user.banDate ? moment(user.banDate).format('jYYYY/jMM/jDD') : '-'}</td>
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
}
