import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Layout from '../layout/Layout';
import Users from '../pages/Users';
import Levels from '../pages/Levels';
import Tags from '../pages/tags';
import Article from '../pages/Article';
import CreateArticle from '../pages/CreateArticle';
import BookCollections from '../pages/BookCollections';
import CreateBookCollection from '../pages/CreateBookCollection';
import Course from '../pages/Course';
import CreateCourse from '../pages/CreateCourse';
import Video from '../pages/Video';

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
        <Route path='articles/edit/:id' element={<CreateArticle/>}/>
        <Route path='books-collection' element={<BookCollections/>}/>
        <Route path='books-collection/create' element={<CreateBookCollection/>}/>
        <Route path='books-collection/edit/:id' element={<CreateBookCollection/>}/>
        <Route path='courses' element={<Course/>}/>
        <Route path='courses/create' element={<CreateCourse/>}/>
        <Route path='courses/edit/:id' element={<CreateCourse/>}/>
        <Route path='courses/video/:id' element={<Video/>}/>
      </Route>
    </Routes>
  )
}
