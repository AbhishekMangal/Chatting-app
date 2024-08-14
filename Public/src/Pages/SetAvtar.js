import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import { getuserRouter, setAvtarRoute } from '../util/ApiRoute';
import userContext from '../Context/userContext';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Features/user/userSlice';
import null_image from '../Images/null images.jpg'
import LoadingBar from 'react-top-loading-bar';



const SetAvtar = () => {
    const context = useContext(userContext);
    const {getImageMimeType} = context;
    const api = "https://api.multiavatar.com/45678945";
    const {user} = useSelector(state=> state.user)
    const [avatars, setAvatar] = useState();
    const [progress, setProgress] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme:"dark"
    }
    const ref = useRef(null)
    const setProfilePicture = async()=>{
      setProgress(10);
        if(!avatars)
        {
            toast.error("please select an avatar", toastOption);
            return
        }
        else
        {
            if(user ){
                const response = await axios.post(`${setAvtarRoute}/${user._id}`,{
                    image: avatars,
                });
                setProgress(60);
                if(response.data.success){
                   
                    dispatch(setUser(({ ...user,  avtarImage: avatars })));
                    toast.success("Image Update SuccessFully", toastOption);
                    navigate("/");
                }
                }
                else
                {
                    toast.error("Some Error Occurred. Please try again !!",toastOption)
                }
        }
        setProgress(100);
        
    };
    useEffect(()=>
    {
        if(user  === undefined)
        {
            navigate('/')
        }
    }, [])
    
   
const handleImageChange =async(e)=>
    {
        
      const file = e.target.files[0];
      if(file)
      {
        const reader = new FileReader();
        reader.onload =async ()=>
        {
          const base64String = reader.result.split(',')[1]
          setAvatar(base64String)

        }
        reader.readAsDataURL(file);
       
        

      }
    }


       


  return (
    <>    
    
    <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
           
         
            <Container>
            <div className="title-container">
               <h1>Pick an avtar as your profile picture </h1>
                    <div className="avatars justify-center pt-5">
               {avatars ?(
                
                    <img src={`data:${getImageMimeType(avatars)};base64,${avatars}`}alt="avatar" className="h-48 w-48 rounded-full object-cover" onClick={() => ref.current.click()} />
                  
                ):
                <img src = {null_image} className='h-48 w-48 rounded-full object-cover' onClick={()=> ref.current.click()}/>
            }
            <input type='file' className='hidden' ref = {ref} onChange={handleImageChange}/>
                     </div>  
       
            </div>
            <button className='submit-btn 'onClick={setProfilePicture}>set As Profile Picture</button>
             <ToastContainer/>
           </Container>
        
    
    
    </>

  )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;
    .loader {
        max-inline-size: 100%;
    }
    .title-container {
        h1 {
            color: white
        }
    }
    .avatars {
        display: flex;
        gap: 2rem;
        .avatar{
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img{
                height: 6rem;
                

            }
        }
        .selected {
            border: 0.4rem solid #4e0eff;
        }
       
    }
    .submit-btn {
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.2s ease-in-out;
        &:hover{
            background-color: #4e0eff;

        }
    }


`
export default SetAvtar;
