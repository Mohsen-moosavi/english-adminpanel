import { Link } from 'react-router-dom'
import notFound from './../assets/notFoundsvg.svg'
function NotFound() {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <img src={notFound} alt="not found" className='max-w-[100vw] max-h-[90vh] w-full h-full' />
      <Link to={'/'} className='p-2 rounded-lg bg-main-color !text-white text-sm hover:opacity-60 relative bottom-5'>بازگشت به صفحه اصلی</Link>
    </div>
  )
}

export default NotFound

