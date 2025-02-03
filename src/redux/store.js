import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import levelReducer from './features/levelSlice';
import tagReducer from './features/tagSlice';
import articleReducer from './features/articleSlice'

const store = configureStore({
  reducer: {
    userData : userReducer,
    levelData : levelReducer,
    tagData : tagReducer,
    articleData : articleReducer
  },
});

export default store;
