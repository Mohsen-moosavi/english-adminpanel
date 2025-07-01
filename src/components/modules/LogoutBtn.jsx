import { useDispatch } from 'react-redux'
import { logout } from '../../redux/features/userSlice'
import { AiOutlineLogout } from 'react-icons/ai'
import Swal from 'sweetalert2'


function LogoutBtn() {

    const dispatch = useDispatch()

    function logoutHandler(){
    Swal.fire({
      title: `آیا از خارج شدن از حساب کاربری اطمینان دارید؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'تایید',
      cancelButtonText: 'لغو',
    }).then(result=>{
      if(result.isConfirmed){
        dispatch(logout({}))
      }
    })
    }

    return (
        <li className="block w-full p-2 rounded-lg">
            <button onClick={logoutHandler} className="flex justify-start gap-x-3 items-end sidebar-link hover:text-[#dc7718]">
                <AiOutlineLogout className='sidebar-icon' />
                <span>خروج</span>
            </button>
        </li>
    )
}

export default LogoutBtn
