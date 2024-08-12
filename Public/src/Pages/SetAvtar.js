import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';


import loader from '../Assets/loader.gif'
import { getuserRouter, setAvtarRoute } from '../util/ApiRoute';
import userContext from '../Context/userContext';
import { Buffer } from 'buffer';


const SetAvtar = () => {
    const context = useContext(userContext);
    const {user, setUser, getuser} = context;
    const api = "https://api.multiavatar.com/45678945";
    const [avatars, setAvatar] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [SelectedAvatars, setSelectedAvatars] = useState(undefined);
    
    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme:"dark"
    }
    const setProfilePicture = async()=>{
      
        if(SelectedAvatars === undefined)
        {
            toast.error("please select an avatar", toastOption);
        }
        else
        {
        
           
          
           
            
               
                
            if(user ){
                const {data} = await axios.post(`${setAvtarRoute}/${user._id}`,{
                    image: avatars[SelectedAvatars],
                });
                if(data.isSet){
                    user.isAvtarImage = true;
                    user.avtarImage = avatars[SelectedAvatars];
                    localStorage.setItem('chat-app-user', JSON.stringify(user));
                    setUser(user);
                    
                    navigate("/");
                }
                }
                else
                {
                    toast.error("Some Error Occurred. Please try again !!",toastOption)
                }
            
           


        }
        
    };
    
    // useEffect(async()=>{
       const fetchData = async()=>{
        const response =  await getuser();
        if(response.data.success){
        if(!response.data.User.isAvtarImage){
        const data = [];
        for(let i=0 ; i<10; i++)
        {
            try{
            const image = await axios.get(
            `${api}/${Math.round(Math.random()*1000)}`
            );
            if(image && image.data){
                
                
            const buffer = Buffer.from(image.data);

            // Convert the buffer to a base64 string
            const base64String = buffer.toString('base64');
            
            // Push the base64 string into the 'data' array
            data.push(base64String);
            }
        }catch(error)
        {
            console.error(error)
        }
          
          
       

        }
       
        setAvatar(data);
        setLoading(false);
    }
    else
    {
        toast.error("Bro You had Already Selected Your Avtar")
        navigate("/");
    }
}
else
{
    toast.error("Some error Occurred!! Please refresh the Page")
}

        // toast.dismiss();
    }
        

        useEffect(()=>
        {
             fetchData();
           
        }, [api])
        
       

    const navigate = useNavigate();

  return (
    <>    
    {
        Loading ? <Container>
            <img src={loader} alt="loader" className='loader' />
        </Container>:  (
            <Container>
            <div className="title-container">
               <h1>Pick an avtar as your profile picture </h1>
               <div className="avatars">
                  { avatars.map((avatar,index)=>{
                       return (
                           <div key={index} className={`avatar ${SelectedAvatars=== index?"selected": ""}`}>
                               <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
                               onClick={()=>setSelectedAvatars(index)} />
                           </div>
                       )
                   }
                   )}
       
               </div>
            </div>
            <button className='submit-btn 'onClick={setProfilePicture}>set As Profile Picture</button>
             <ToastContainer/>
           </Container>
        )
    }
    
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
