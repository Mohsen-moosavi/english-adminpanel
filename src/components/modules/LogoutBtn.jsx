import { useDispatch } from 'react-redux'
import { logout } from '../../redux/features/userSlice'
import { AiOutlineLogout } from 'react-icons/ai'


function LogoutBtn() {

    const dispatch = useDispatch()

    function logoutHandler(){
        dispatch(logout({}))
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
