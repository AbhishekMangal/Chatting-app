import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import userContext from '../Context/userContext';
import Logo from '../Assets/logo.svg';

const Contacts = ({ contacts, currUser, changeChat, length, setLength, notifications , setNotification}) => {
  const [currUserName, setCurrUserName] = useState(undefined);
  const [currentUserImage, setCurrentImage] = useState({});
  const [currSelected, setcurrSelected] = useState(undefined);

  useEffect(() => {
    if (currUser) {
      setCurrUserName(currUser.username);
      setCurrentImage(currUser.avtarImage);
    }
  }, [currUser]);

  const changeCurrentChat = (index, contact) => {
    setNotification((prevNotifications) => 
      prevNotifications.filter((notif) => notif.from !== contact._id))
    setcurrSelected(index);
    changeChat(contact, index);

  };

  return (
    <>
    
      {currentUserImage && currUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="" />
            <h3>snappy</h3>
          </div>
          <div className="contacts">
            {contacts &&
              contacts.map((contact, index) => {
                console.log(contact.avtarImage)
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
          <div className="current-user">
            <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avtar" />
            </div>
            <div className="username">
              <h2>{currUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
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
