import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Layout from '../layout/layout';
import Users from '../pages/Users';
import Levels from '../pages/Levels';
import Tags from '../pages/tags';
import Article from '../pages/Article';
import CreateArticle from '../pages/CreateArticle';

export default function Router() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>

      <Route path='/' element={<Layout/>}>
        <Route path='users' element={<Users/>}/>
        <Route path='levels' element={<Levels/>}/>
        <Route path='tags' element={<Tags/>}/>
        <Route path='articles' element={<Article/>}/>
        <Route path='articles/create' element={<CreateArticle/>}/>
      </Route>
    </Routes>
  )
}
