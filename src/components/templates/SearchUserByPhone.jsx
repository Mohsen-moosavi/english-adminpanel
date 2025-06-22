import { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, setOffset, setSearchPhone } from '../../redux/features/usersSlice'

export default function SearchPhone({ setPaginatorChangerFlag }) {

    const { searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority, limit } = useSelector(state => state.usersData)
    const [searchWord, setSearchWord] = useState(searchPhone)
    const [isFirstRender, setIsFirstRender] = useState(true)

    // const {limit} = useSelector(state => state[sliceName])
    const dispatch = useDispatch()

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return
        }
        dispatch(setSearchPhone(searchWord))
        dispatch(getUsers({ searchName, searchPhone : searchWord, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority, limit, offset : 0 }))
        
        dispatch(setOffset(0))
        setPaginatorChangerFlag(prev => !prev)
    }, [searchWord])

    return (
        <div className='relative'>
            <input type="text" placeholder='جستوجو بر اساس تلفن...' className='form-input' value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
            <IoIosSearch className='absolute sm:text-[25px] sm:left-[10px] text-[18px] top-[9px] left-[7px] text-white' />
        </div>
    )
}
