import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Layout from '../layout/layout';

export default function Router() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>

      <Route path='/' element={<Layout/>}></Route>
    </Routes>
  )
}
