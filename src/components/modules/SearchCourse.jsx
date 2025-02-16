import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { getArticles } from '../../redux/features/articleSlice'

export default function Search({setPaginatorChangerFlag , sliceName , setSearch}) {

    const [searchWord , setSearchWord] = useState("")
    const {status, teacherId, bookId, levelId, priceStatus, scoreStatus, limit} = useSelector(state => state[sliceName])
    const dispatch = useDispatch()

    useEffect(()=>{
            dispatch(setSearch(searchWord))
            dispatch(getArticles({limit , offset:0 ,status, teacherId, bookId, levelId, priceStatus, scoreStatus, search : searchWord}))
            setPaginatorChangerFlag(prev=>!prev)
    } , [searchWord])


    return (
        <div className='relative'>
            <input type="text" placeholder='جستوجو...' className='form-input' value={searchWord} onChange={(e)=>setSearchWord(e.target.value)}/>
            <IoIosSearch className='absolute sm:text-[25px] sm:left-[10px] text-[18px] top-[9px] left-[7px] text-white'/>
        </div>
    )
}
