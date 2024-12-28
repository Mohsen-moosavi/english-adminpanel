import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import levelReducer from './features/levelSlice';
import tagReducer from './features/tagSlice';

const store = configureStore({
  reducer: {
    userData : userReducer,
    levelData : levelReducer,
    tagData : tagReducer
  },
});

export default store;
