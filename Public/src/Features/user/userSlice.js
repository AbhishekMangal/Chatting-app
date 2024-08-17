import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    
    user: undefined,
    onlineUsers: undefined,
    userDetails:false,
    
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setUser(state, action){
            state.user = action.payload;
        },
        setUserDetails(state, action){
            state.userDetails=action.payload
        },
        setOnlineUsers(state, action)
        {
            state.onlineUsers = action.payload
        }
    }
});
export const {
    setUser,
    setUserDetails,
    setOnlineUsers
} = userSlice.actions
export default userSlice.reducer