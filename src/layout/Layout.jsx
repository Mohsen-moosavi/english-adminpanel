import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import  {getUserDate, setUserLoggin}  from '../redux/features/userSlice';

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
    <div>
    </div>
  )
}

