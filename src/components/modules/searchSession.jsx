import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { getSessions } from '../../redux/features/sessionSlice'

export default function Search({setPaginatorChangerFlag , sliceName , setSearch, courseId, defaultValue}) {

    const [searchWord , setSearchWord] = useState(defaultValue)
    const [isFirstRender, setIsFirstRender] = useState(true)
    const {status,limit,fileStatus } = useSelector(state => state[sliceName])
    const dispatch = useDispatch()

    useEffect(()=>{
        if(isFirstRender){
            setIsFirstRender(false);
            return
        }
            dispatch(setSearch(searchWord))
            dispatch(getSessions({id: courseId,limit , offset:0,status,search : searchWord,fileStatus}))
            setPaginatorChangerFlag(prev=>!prev)
    } , [searchWord])


    return (
        <div className='relative'>
            <input type="text" placeholder='جستوجو...' className='form-input' value={searchWord} onChange={(e)=>setSearchWord(e.target.value)}/>
            <IoIosSearch className='absolute sm:text-[25px] sm:left-[10px] text-[18px] top-[9px] left-[7px] text-white'/>
        </div>
    )
}
