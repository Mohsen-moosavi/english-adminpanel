import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Layout from '../layout/layout';
import Users from '../pages/Users';
import Levels from '../pages/Levels';

export default function Router() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>

      <Route path='/' element={<Layout/>}>
        <Route path='users' element={<Users/>}/>
        <Route path='levels' element={<Levels/>}/>
      </Route>
    </Routes>
  )
}
