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
const getImageMimeType = (base64String) => {
  // Check the prefix of the base64 string to determine the image type
  if (base64String.startsWith('/9j/')) {
    // JPEG
    return 'image/jpeg';
  } else if (base64String.startsWith('iVBORw0KGgo')) {
    // PNG
    return 'image/png';
  } 
  else if (base64String.startsWith('data:image/heic')) {
    // HEIC
    return 'image/heic';
  } else {
    // Default fallback or unknown type
    return 'image/svg+xml';
  }
};


  return (
    <div>
  <userContext.Provider value={{ getuser, setOtp, otp, getImageMimeType}} >{props.children}</userContext.Provider>
    </div>
  )
}

export default   UserState ;;
