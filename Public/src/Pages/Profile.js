import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrChatDetails } from '../Features/chat/ChatSlice'

const Profile = () => {
    const {currentChat, currChatDetails} = useSelector(state =>state.chat)
   const dispatch =  useDispatch();
  console.log(currentChat)
  return (
    <div className='text-white relative grid grid-rows-[10%_80%]  '>
       
        <div className='flex items-start gap-5 p-6 items-center text-2xl bg-[#080420]' >
        <IoMdClose className='cursor-pointer'   onClick={()=>dispatch(setCurrChatDetails(!currChatDetails))}/>
          Contact info
          </div>
        <div className='absolute user-details flex items-center flex-col top-48 justify-center w-full'>
        <div className='img rounded-full'>
            <img src={`data:image/svg+xml;base64,${currentChat.avtarImage}`} alt="" className='h-28' />
        </div>
   
        <div>{currentChat.username}</div>
         <div>{currentChat.email}</div>
   
   </div>
    </div>
  )
}

export default Profile
