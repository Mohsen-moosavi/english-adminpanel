import { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { useDispatch } from 'react-redux'

export default function Searcher({ setPaginatorChangerFlag, defaultgetterValuesObj, reset, getter, setSearch, defaultValue = "",setOffset }) {

    const [searchWord, setSearchWord] = useState(defaultValue)
    const [isFirstRender, setIsFirstRender] = useState(true)

    // const {limit} = useSelector(state => state[sliceName])
    const dispatch = useDispatch()

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return
        }
        dispatch(setSearch(searchWord))
        dispatch(getter({ offset: 0, search: searchWord, ...defaultgetterValuesObj }))
        dispatch(setOffset(0))
        setPaginatorChangerFlag(prev => !prev)
    }, [searchWord])

    useEffect(() => {
        if (!!reset) {
            setSearchWord('')
        }
    }, [reset])

    return (
        <div className='relative'>
            <input type="text" placeholder='جستوجو...' className='form-input' value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
            <IoIosSearch className='absolute sm:text-[25px] sm:left-[10px] text-[18px] top-[9px] left-[7px] text-white' />
        </div>
    )
}
