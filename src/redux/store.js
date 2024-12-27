import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import levelReducer from './features/levelSlice';

const store = configureStore({
  reducer: {
    userData : userReducer,
    levelData : levelReducer
  },
});

export default store;
