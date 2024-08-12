import React, {  useEffect, useState } from 'react';
import styled from 'styled-components';

import Logo from '../Assets/logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { BiPowerOff } from 'react-icons/bi';
import LogOut from './LogOut';
import { setContact, setCurrChatDetails, setCurrentChat, setcurrSelected, setNotifications } from '../Features/chat/ChatSlice';
import { setUser, setUserDetails } from '../Features/user/userSlice';
import { useNavigate } from 'react-router-dom';


const Contacts = ({ changeChat, notifications , setNotification}) => {
  const{contact, currSelected} = useSelector(state => state.chat)
  const {user} = useSelector(state=> state.user)
  const [currUserName, setCurrUserName] = useState(undefined);
  const [currentUserImage, setCurrentImage] = useState({});

 
const navigate = useNavigate();
const dispatch = useDispatch();
  useEffect(() => {
    if (user ) {
      setCurrUserName(user.username);
      setCurrentImage(user.avtarImage);
    }
  }, [user]);

  const changeCurrentChat = (index, contact) => {
    
    setNotification((prevNotifications) => 
      prevNotifications.filter((notif) => notif.from !== contact._id))
    dispatch(setcurrSelected(index));
    dispatch(setCurrentChat(contact))
    dispatch(setCurrChatDetails(false))
    console.log(contact)
    changeChat(contact, index);

  }; 
  

    
  return (
    <>
    
    <Container >
      <div className='grid grid-rows-[20%,80%] bg-[#080420] overflow-hidden h-full'>
      {currentUserImage  && (
          <div className="header flex justify-between items-center p-4  ">
            <div className='logo h-8 '>
            <img src={Logo} alt="" className='h-8' />
            </div>
          
           <div className='title text-slate-300'>
            <h4>Snappy</h4>
            </div>
            <div className="user-profile cursor-pointer">
            <div className="relative group:" onClick={()=> dispatch(setUserDetails(true))}>
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avtar"  className='h-10'  />
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
                      <img src={`data:image/svg+xml;base64,${contact.avtarImage}`} alt="avtar" />
                    </div>
                    <div className="username">
                      <h3>{contact.username}</h3>
                    
                    </div>
                    {unreadMessages > 0   && (
                      <div className="notification">
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
      .notification {
        background-color: red;
        color: white;
        border-radius: 50%;
        padding: 0.2rem 0.5rem;
        margin-left: auto;
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
