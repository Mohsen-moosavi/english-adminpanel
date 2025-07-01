import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import levelReducer from './features/levelSlice';
import tagReducer from './features/tagSlice';
import articleReducer from './features/articleSlice'
import bookReducer from './features/bookSlice'
import courseReducer from './features/courseSlice'
import offReducer from './features/offSlice'
import commentReducer from './features/commentSlice'
import sessionReducer from './features/sessionSlice'
import saleReducer from './features/saleSlice'
import ticketReducer from './features/ticketSlice'
import usersReducer from './features/usersSlice'
import consoleReducer from './features/consoleSlice'
import contactReducer from './features/contactSlice'
import extrafileReducer from './features/extrafileSlice'

const store = configureStore({
  reducer: {
    userData : userReducer,
    levelData : levelReducer,
    tagData : tagReducer,
    articleData : articleReducer,
    bookData : bookReducer,
    courseData : courseReducer,
    offData : offReducer,
    commentData : commentReducer,
    sessionData : sessionReducer,
    saleData : saleReducer,
    ticketData : ticketReducer,
    usersData : usersReducer,
    consoleData : consoleReducer,
    contactData : contactReducer,
    extrafileData :extrafileReducer
  },
});

export default store;
