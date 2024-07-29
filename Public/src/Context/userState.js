import React, { createContext, useState } from 'react'
import userContext from './userContext';
import axios from 'axios';
import { getuserRouter } from '../util/ApiRoute';

const UserState = (props) => {
    const [user, setUser] = useState({});
    const [otp ,setOtp] = useState({});
    const getuser =  async()=>{
    const response = await axios.get(getuserRouter, {
      headers: {
          'auth-token': localStorage.getItem("authToken")
      }
    });
    
    await setUser(response.data.User)
    

      return response;
    
}

  return (
    <div>
  <userContext.Provider value={{user, setUser, getuser, setOtp, otp}} >{props.children}</userContext.Provider>
    </div>
  )
}

export default   UserState ;;
