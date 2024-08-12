import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    contact: [],
    currentChat: null,
    notifications: [],
    currSelected: undefined,
    currChatDetails: false,
   
}

const ChatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers:{
        setContact(state, action){
            state.contact = action.payload;
        },
        setCurrentChat(state, action){
            state.currentChat= action.payload
        },
        setNotifications(state, action){
            state.notifications = action.payload
        },
        setcurrSelected(state, action){
            state.currSelected = action.payload
        },
        setCurrChatDetails(state, action){
            state.currChatDetails = action.payload
        },
       
    }
});
export const {
    setContact,
    setCurrentChat,
    setNotifications,
    setcurrSelected,
    setCurrChatDetails
} = ChatSlice.actions
export default ChatSlice.reducer