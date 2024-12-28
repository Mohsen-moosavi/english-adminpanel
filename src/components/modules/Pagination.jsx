import React, { useEffect, useState } from 'react'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { setOffset } from '../../redux/features/tagSlice'

export default function Pagination({ itemsCount, numberOfitemInEveryPage, defaultPage = 1, paginationHandler, reseter }) {

    const paginationBtnCount = Math.ceil(itemsCount / numberOfitemInEveryPage)
    const [page, setPage] = useState(defaultPage)
    const dispatch = useDispatch()

    useEffect(()=>{
        setPage(1)
        dispatch(setOffset(0))
    } , [reseter])

    function paginationClickHandler(button) {
        paginationHandler(button - 1)
        dispatch(setOffset((button - 1) * numberOfitemInEveryPage))
        setPage(button)
    }

    function paginationPreClickHandler() {
        paginationHandler(page - 2)
        dispatch(setOffset((page - 2) * numberOfitemInEveryPage))
        setPage(prev => prev - 1)
    }

    function paginationNextClickHandler() {
        paginationHandler(page)
        dispatch(setOffset((page) * numberOfitemInEveryPage))
        setPage(prev => prev + 1)
    }
    if(paginationBtnCount > 1){
        return (
            <div className='text-center mt-5'>
                <div className='inline-block rounded-lg border border-[2px] border-main-color overflow-hidden'>
                    <div className='flex items-center justify-center'>
                        <button
                            onClick={paginationPreClickHandler}
                            disabled={page === 1}
                            className={`md:w-[45px] md:h-[45px] w-[30px] h-[30px] max-md:text-[10px] flex items-center justify-center outline outline-[1px] outline-main-color bg-[#0e4b505e] text-main-color hover:text-white hover:bg-main-color ${page === 1 ? 'opacity-50 hover:text-main-color hover:bg-[#0e4b505e]' : ''}`}
                        >
                            <FaLongArrowAltRight />
                        </button>
                        {Array.from(Array(paginationBtnCount)).map((button, index) => (
                            <button
                            type='button'
                                key={index}
                                onClick={() => paginationClickHandler(index + 1)}
                                className={`md:w-[45px] md:h-[45px] w-[30px] h-[30px] max-md:text-[10px] flex items-center justify-center outline outline-[1px] outline-main-color bg-[#0e4b505e] text-main-color hover:text-white hover:bg-main-color ${page === index + 1 ? '!bg-main-color text-white' : ''}`}>
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={paginationNextClickHandler}
                            disabled={page === paginationBtnCount}
                            className={`md:w-[45px] md:h-[45px] w-[30px] h-[30px] max-md:text-[10px] flex items-center justify-center outline outline-[1px] outline-main-color bg-[#0e4b505e] text-main-color hover:text-white hover:bg-main-color  ${page === paginationBtnCount ? 'opacity-50 hover:text-main-color hover:bg-[#0e4b505e]' : ''}`}
                        >
                            <FaLongArrowAltLeft />
                        </button>
                    </div>
                </div>
            </div>
        )
    }else{
        return null
    }
}
