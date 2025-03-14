import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { getOffs } from '../../redux/features/offSlice'

export default function Search({setPaginatorChangerFlag , sliceName , setSearch,defaultValue=""}) {

    const [searchWord , setSearchWord] = useState(defaultValue)
    const {limit , publicStatus , orderStatus} = useSelector(state => state[sliceName])
    const dispatch = useDispatch()

    useEffect(()=>{
            dispatch(setSearch(searchWord))
            dispatch(getOffs({limit , offset:0 , search : searchWord, publicStatus , orderStatus }))
            setPaginatorChangerFlag(prev=>!prev)
    } , [searchWord])

    return (
        <div className='relative'>
            <input type="text" placeholder='جستوجو...' className='form-input' value={searchWord} onChange={(e)=>setSearchWord(e.target.value)}/>
            <IoIosSearch className='absolute sm:text-[25px] sm:left-[10px] text-[18px] top-[9px] left-[7px] text-white'/>
        </div>
    )
}
