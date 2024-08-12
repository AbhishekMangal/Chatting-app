import React from 'react'
import { GoArrowLeft } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../Features/user/userSlice';
import LogOut from '../components/LogOut';
const UserPage = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(state=> state.user)
  return (
    
    <div className='text-white bg-[#080420] grid grid-rows-[20%_35%_25%_20%]'>
      <div className="flex items-center pt-7 bg-[#08264c5e]" >
        <GoArrowLeft className='text-2xl place-content-center mx-5 cursor-pointer' onClick={()=>dispatch(setUserDetails(false))}/>
        <span className='px-6 font-sans text-xl'>Profile</span>
      </div>
      <div className=" flex items-end justify-center pb-2 ]">
         
      <img src={`data:image/svg+xml;base64,${user.avtarImage}`} alt="avtar"  className='h-48'  />
        
        
      </div>
      <div className="b rounded flex flex-col justify-evenly gap-2 px-3">
       <div className='userName  p-2 bg-[#ffffff34] rounded-md  text-center'> Name: {user.username}</div>
       <div className='userEmail  p-2 bg-[#ffffff34] rounded-md text-center'> Email: {user.email}</div>
       <div className='userEmail  p-2 bg-[#ffffff34] rounded-md text-center'> About: Hii! i am using Snappy</div>
      </div>
      <div className="  rounded bg-[#08264c5e] mt-1">
        <LogOut/>
        
      </div>
    </div>
    
  )
}

export default UserPage
