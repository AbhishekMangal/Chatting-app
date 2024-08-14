import React, {  useContext} from 'react';
import styled from 'styled-components';
import Logo from '../Assets/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrChatDetails, setCurrentChat, setcurrSelected } from '../Features/chat/ChatSlice';
import {  setUserDetails } from '../Features/user/userSlice';
import null_image from '../Images/null images.jpg'
import userContext from '../Context/userContext';


const Contacts = ({ changeChat, notifications , setNotification}) => {
  const{contact, currSelected} = useSelector(state => state.chat)
  const {user} = useSelector(state=> state.user)
  const {getImageMimeType} = useContext(userContext)
  const dispatch = useDispatch();
  

  const changeCurrentChat = (index, contact) => {
    
    setNotification((prevNotifications) => 
      prevNotifications.filter((notif) => notif.from !== contact._id))
    dispatch(setcurrSelected(index));
    dispatch(setCurrentChat(contact))
    dispatch(setCurrChatDetails(false))
    changeChat(contact, index);

  }; 
  

    
  return (
    <>
    
    <Container >
      <div className='grid grid-rows-[15%,85%] bg-[#080420] overflow-hidden h-[90vh] '>
      {user  && (
          <div className="header flex justify-between items-center p-4  ">
            <div className='logo h-8 '>
            <img src={Logo} alt="Logo" className='h-8' />
            </div>
          
           <div className='title text-slate-300'>
            <h4>Snappy</h4>
            </div>
            <div className="user-profile cursor-pointer">
            <div className="relative group:" onClick={()=> dispatch(setUserDetails(true))}>
              {(user && user.avtarImage !== undefined) ?(
             <img  
             src={`data:${getImageMimeType(user.avtarImage)};base64,${user.avtarImage}`} 
             alt="avatar" 
             className="h-12 w-12 rounded-full object-cover"
             title='profile'
             />
              ):
              (
              <img src={null_image} className="h-12 w-12 rounded-full object-cover"/>
              )
            }
            </div>
          </div>
          </div>
        )}
          <div className="contacts mt-2 bg-[#000223]">
            {contact &&
              contact.map((contact, index) => {
             
                const unreadMessages = notifications.filter(
                  (notif) => notif.from === contact._id
                ).length;

                return (
                  <div
                    key={contact._id}
                    className={`contact ${index === currSelected ? 'selected' : ''}`}
                    onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="avatar">
                      { contact.avtarImage ? (
                      <img  src={`data:${getImageMimeType(contact.avtarImage)};base64,${contact.avtarImage}`} alt="avatar" className="h-12 w-12 rounded-full object-cover"/>

                      ):<img src={null_image} alt="avtar" className='h-12 w-12 rounded-full object-cover' />
              }
                    </div>
                    <div className="username">
                      <h3>{contact.username}</h3>
                    
                    </div>
                    {unreadMessages > 0   && (
                      <div className="notification rounded-full object-cover flex justify-center bg-red-600 h-7 w-7 items-center text-white ml-auto">
                        {unreadMessages}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          </div>
        </Container>
        
    </>
  );
};

const Container = styled.div`
  background-color: #000223;
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
     
    }
    .selected {
      background-color: #9a86f3;
    }
  }
  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;
