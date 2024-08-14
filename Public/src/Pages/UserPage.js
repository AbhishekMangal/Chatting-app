import React, { useContext, useRef, useState } from 'react'
import { GoArrowLeft, GoPencil } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setUserDetails } from '../Features/user/userSlice';
import LogOut from '../components/LogOut';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { setAvtarRoute } from '../util/ApiRoute';
import userContext from '../Context/userContext';
import LoadingBar from 'react-top-loading-bar'

const UserPage = () => {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const {user} = useSelector(state=> state.user)
    const {getImageMimeType} = useContext(userContext)
    const [hovered, setHovered] = useState(false);
    const [progress, setProgress] = useState(0)
 
    const toastOption = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme:"dark"
  }
    const handleImageChange =async(e)=>
    {
      const file = e.target.files[0];
      if(file)
      {
        const reader = new FileReader();
        reader.onload =async ()=>
        {
          setProgress(10);
          const base64String = reader.result.split(',')[1]
          if(user ){
            const response = await axios.post(`${setAvtarRoute}/${user._id}`,{
                image: base64String,
            });
            setProgress(50);
            if(response.data.success){
                dispatch(setUser(({
                  ...user,
                  avtarImage: base64String
                })));
                toast.success("image updated Successfully", toastOption)
               
            }
            }
            else
            {
                toast.error("Some Error Occurred. Please try again !!",toastOption)
            }
          setProgress(100);

        }
        reader.readAsDataURL(file);
       
        

      }
    }
  return (
  
    
    <div className='text-white bg-[#080420] grid grid-rows-[20%_35%_25%_20%] h-[90vh]  '>
         <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="flex items-center pt-7 bg-[rgba(8,38,76,0.37)]" >
        <GoArrowLeft className='text-2xl place-content-center mx-5 cursor-pointer' onClick={()=>dispatch(setUserDetails(false))}/>
        <span className='px-6 font-sans text-xl'>Profile</span>
      </div>
      <div 
      className="flex items-end justify-center pb-2 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {user.avtarImage && (
        <img
          src={`data:${getImageMimeType(user.avtarImage)};base64,${user.avtarImage}`}
          alt="avatar"
          className={`h-48 w-48 rounded-full object-cover cursor-pointer transition duration-300 ease-in-out ${hovered ? 'opacity-70' : ''}`}
          onClick={() => ref.current.click()}
          title='change image'
        />
      )}

      {hovered && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 rounded-full p-2 flex justify-center items-center">
      <GoPencil color="rgba(255, 255, 255, 0.7)" size={16} onClick={() => ref.current.click()} />
        </div>
      )}

      <input 
        type='file' 
        className='text-white hidden' 
        ref={ref} 
        onChange={handleImageChange} 
      />
    </div>
      <div className="b rounded flex flex-col justify-evenly gap-2 px-3">
       <div className='userName  p-2 bg-[#ffffff34] rounded-md  text-center'> Name: {user.username}</div>
       <div className='userEmail  p-2 bg-[#ffffff34] rounded-md text-center'> Email: {user.email}</div>
       <div className='userEmail  p-2 bg-[#ffffff34] rounded-md text-center'> About: Hii! i am using Snappy</div>
      </div>
      <div className="  rounded bg-[#08264c5e] mt-1">
        <LogOut/>
        
      </div>
      <ToastContainer/>
    </div>
    
  )
}

export default UserPage
