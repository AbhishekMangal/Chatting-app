import { configureStore } from '@reduxjs/toolkit';
import ChatReducer from '../Features/chat/ChatSlice';
import userReducer from '../Features/user/userSlice';


export const store = configureStore({
  reducer: {
    chat: ChatReducer,
    user: userReducer
  },
});
