import React from 'react'
import { useNavigate } from 'react-router-dom'
import {BiPowerOff} from 'react-icons/bi';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setUser, setUserDetails } from '../Features/user/userSlice';
import { MdOutlineAutoDelete } from "react-icons/md";

import { setContact, setCurrChatDetails, setCurrentChat, setcurrSelected, setNotifications } from '../Features/chat/ChatSlice';
const LogOut = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick= async()=>
    {
      dispatch(setUser(undefined));
      dispatch(setNotifications([]));
      dispatch((setCurrentChat(undefined)));
      dispatch((setContact([])));
      dispatch(setcurrSelected(undefined));
        localStorage.clear();
      dispatch(setUserDetails(false));
      dispatch(setCurrChatDetails(false))
        navigate('/login');
    }
  return (
<>
              <div className='.logout flex justify-center text-white cursor-pointer hover:bg-[#9a86f3] py-3 rounded-lg gap-2 w-full ' onClick={handleClick} >
              <BiPowerOff className='logout-icon mb-1 text-xl text-[#59dfca]'/>
                <span>Logout</span> 
                 </div> 
                 <div className='.delete flex justify-center text-white cursor-pointer hover:bg-[#9a86f3] py-3 rounded-lg gap-2' onClick={handleClick} >
              <MdOutlineAutoDelete className='delete-icon mb-1 text-xl  text-red-300'/>
                <span>Delete Your Account</span> 
                 </div> 
                 </>
                 
              
    
  )
}



export default LogOut
