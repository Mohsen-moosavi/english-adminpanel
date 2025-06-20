import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <p className='text-main-color font-bold text-[lg] sm:text-[20px]'>صفحه مورد نظر یافت نشد!</p>
        <h1 className='text-main-color font-bold text-[100px] sm:text-[200px] sm:leading-[210px] not-found-404 not-found-text-shadow'>404</h1>
        <Link to={'/'} className='p-2 rounded-lg bg-main-color !text-white mt-10 max-sm:text-sm hover:opacity-60'>بازگشت به صفحه اصلی</Link>
    </div>
  )
}

export default NotFound

