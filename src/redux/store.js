import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import levelReducer from './features/levelSlice';
import tagReducer from './features/tagSlice';
import articleReducer from './features/articleSlice'
import bookReducer from './features/bookSlice'
import courseReducer from './features/courseSlice'
import offReducer from './features/offSlice'

const store = configureStore({
  reducer: {
    userData : userReducer,
    levelData : levelReducer,
    tagData : tagReducer,
    articleData : articleReducer,
    bookData : bookReducer,
    courseData : courseReducer,
    offData : offReducer
  },
});

export default store;
