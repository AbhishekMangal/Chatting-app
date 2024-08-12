import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    
    user: undefined,
    
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
        }
    }
});
export const {
    setUser,
    setUserDetails
} = userSlice.actions
export default userSlice.reducer