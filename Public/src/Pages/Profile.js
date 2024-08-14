import React, { useContext } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { setCurrChatDetails } from '../Features/chat/ChatSlice'
import { GoArrowLeft } from 'react-icons/go'
import { setUserDetails } from '../Features/user/userSlice'
import null_image from '../Images/null images.jpg'
import userContext from '../Context/userContext'

const Profile = () => {
    const {currentChat, currChatDetails} = useSelector(state =>state.chat)
   const dispatch =  useDispatch();
   const {getImageMimeType} = useContext(userContext)
  console.log(currentChat)
  return (
    <div className='text-white bg-[#080420] grid grid-rows-[20%_40%_25%_15%]'>
    <div className="flex items-center pt-7 bg-[#08264c5e]" >
      <GoArrowLeft className='text-2xl place-content-center mx-5 cursor-pointer' onClick={()=>dispatch(setCurrChatDetails(false))}/>
      <span className='px-6 font-sans text-xl'>Contact Details</span>
    </div>
    <div className=" flex items-end justify-center pb-2 ]">
    {currentChat.avtarImage ?(
            <img src={`data:${getImageMimeType(currentChat.avtarImage)};base64,${currentChat.avtarImage}`} alt="avatar" className="h-52 w-52 rounded-full object-cover" />
         ): 
         <img src={null_image} className='h-48 w-48 rounded-full object-cover'/>
        }
    
    </div>
    <div className="b rounded flex flex-col justify-evenly gap-2 px-3">
     <div className='userName  p-2 bg-[#ffffff34] rounded-md  text-center'> Name: {currentChat.username}</div>
     <div className='userEmail  p-2 bg-[#ffffff34] rounded-md text-center'> Email: {currentChat.email}</div>
     <div className='userEmail  p-2 bg-[#ffffff34] rounded-md text-center'> About: Hii! i am using Snappy</div>
    </div>
    
  </div>
  )
}

export default Profile
