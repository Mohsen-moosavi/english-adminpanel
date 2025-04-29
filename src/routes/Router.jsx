import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Layout from '../layout/Layout';
import Users from '../pages/Users';
import Levels from '../pages/Levels';
import Tags from '../pages/Tags';
import Article from '../pages/Article';
import CreateArticle from '../pages/CreateArticle';
import BookCollections from '../pages/BookCollections';
import CreateBookCollection from '../pages/CreateBookCollection';
import Course from '../pages/Course';
import CreateCourse from '../pages/CreateCourse';
import Video from '../pages/Video';
import Off from '../pages/Off';
import CreateOff from '../pages/CreateOff';
import Comment from '../pages/Comment';
import CommentLoop from '../pages/CommentLoop';
import Session from '../pages/Session';
import CreateSession from '../pages/CreateSession';
import Sale from "../pages/Sale";
import CreateSaleByAdmin from '../pages/CreateSaleByAdmin';
import Ticket from '../pages/Ticket';
import TicketDetails from '../pages/TicketDetails';
import UserDetails from '../pages/UserDetails';
import Console from '../pages/Console';

export default function Router() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>

      <Route path='/' element={<Layout/>}>
        <Route path='' element={<Console/>}/>
        <Route path='users' element={<Users/>}/>
        <Route path='users/:id' element={<UserDetails/>}/>
        <Route path='levels' element={<Levels/>}/>
        <Route path='tags' element={<Tags/>}/>
        <Route path='tags/:tagId/tag-courses' element={<Course/>}/>
        <Route path='tags/:tagId/tag-books' element={<BookCollections/>}/>
        <Route path='tags/:tagId/tag-articles' element={<Article/>}/>
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
        <Route path='offs' element={<Off/>}/>
        <Route path='offs/create' element={<CreateOff/>}/>
        <Route path='offs/edit/:id' element={<CreateOff/>}/>
        <Route path='comments' element={<Comment/>}/>
        <Route path='comments/:id' element={<CommentLoop/>}/>
        <Route path='sessions/:id' element={<Session/>}/>
        <Route path='sessions/:id/create' element={<CreateSession/>}/>
        <Route path='sessions/:id/edit/:sessionId' element={<CreateSession/>}/>
        <Route path='sales' element={<Sale/>}/>
        <Route path='tickets' element={<Ticket/>}/>
        <Route path='tickets/:id' element={<TicketDetails/>}/>


        <Route path='users/:id/create-sale' element={<CreateSaleByAdmin/>}/>
        <Route path='users/:id/user-courses' element={<Course/>}/>
        <Route path='users/:id/user-sales' element={<Sale/>}/>
        <Route path='users/:id/user-comments' element={<Comment/>}/>
        <Route path='users/:id/user-tickets' element={<Ticket/>}/>
        <Route path='users/:id/user-articles' element={<Article/>}/>
        <Route path='users/:id/user-lessons' element={<Course/>}/>
      </Route>
    </Routes>
  )
}
