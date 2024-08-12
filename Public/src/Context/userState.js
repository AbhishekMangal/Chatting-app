import React, { createContext, useState } from 'react'
import userContext from './userContext';
import axios from 'axios';
import { getuserRouter } from '../util/ApiRoute';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Features/user/userSlice';

const UserState = (props) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user)
 
    const [otp ,setOtp] = useState({});
    const getuser =  async()=>{
    const response = await axios.get(getuserRouter, {
      headers: {
          'auth-token': localStorage.getItem("authToken")
      }
    });
    
     dispatch(setUser(response.data.User))
    

      return response;
    
}

  return (
    <div>
  <userContext.Provider value={{ getuser, setOtp, otp}} >{props.children}</userContext.Provider>
    </div>
  )
}

export default   UserState ;;
