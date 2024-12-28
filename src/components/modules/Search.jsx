import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { getTags, setSearch } from '../../redux/features/tagSlice'

export default function Search({setPaginatorChangerFlag , sliceName ,reset}) {

    const [searchWord , setSearchWord] = useState("")
    const {limit} = useSelector(state => state[sliceName])
    const dispatch = useDispatch()

    useEffect(()=>{
            dispatch(setSearch(searchWord))
            dispatch(getTags({limit , offset:0 , search : searchWord}))
            setPaginatorChangerFlag(prev=>!prev)
    } , [searchWord])

    useEffect(()=>{
        setSearchWord('')
    } , [reset])

    return (
        <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1'>
            <div className='relative'>
                <input type="text" placeholder='جستوجو...' className='form-input' value={searchWord} onChange={(e)=>setSearchWord(e.target.value)}/>
                <IoIosSearch className='absolute sm:text-[25px] sm:left-[10px] text-[18px] top-[9px] left-[7px] text-white'/>
            </div>
        </div>
    )
}
