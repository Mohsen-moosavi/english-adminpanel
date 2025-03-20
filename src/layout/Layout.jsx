import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import  {getUserDate, setUserLoggin}  from '../redux/features/userSlice';
import Sidebar from '../components/modules/Sidebar';
import Header from '../components/modules/Header';
import { Outlet } from 'react-router-dom';

export default function Layout() {

  const { userInfo, isLoading, error } =
  useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const isInitialized = useRef(false);


    useEffect(()=>{
      if(!isInitialized.current){
        isInitialized.current = true;
        dispatch(getUserDate({}))
      }
    },[])

  return (
    <div className='container max-2xl:min-w-[100%] mx-auto'>
      <div className='w-full sm:my-3 flex min-h-[97vh]'>
        <Sidebar/>
          <div className='w-full main-content md:border-4 md:border-solid md:border-main-color rounded-l-xl p-3 md:shadow-shadow-inset flex flex-col justify-start gap-y-5px'>
            <Header/>
            <Outlet/>
          </div>
      </div>
    </div>
  )
}

