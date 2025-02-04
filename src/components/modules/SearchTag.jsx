import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'

export default function Search({setPaginatorChangerFlag , sliceName ,reset ,  getter, setSearch}) {

    const [searchWord , setSearchWord] = useState("")
    const {limit} = useSelector(state => state[sliceName])
    const dispatch = useDispatch()

    useEffect(()=>{
            dispatch(setSearch(searchWord))
            dispatch(getter({limit , offset:0 , search : searchWord}))
            setPaginatorChangerFlag(prev=>!prev)
    } , [searchWord])

    useEffect(()=>{
        setSearchWord('')
    } , [reset])

    return (
        <div className='relative'>
            <input type="text" placeholder='جستوجو...' className='form-input' value={searchWord} onChange={(e)=>setSearchWord(e.target.value)}/>
            <IoIosSearch className='absolute sm:text-[25px] sm:left-[10px] text-[18px] top-[9px] left-[7px] text-white'/>
        </div>
    )
}
