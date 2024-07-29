import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUserRoute, host } from "../util/ApiRoute";
import axios from "axios";
import userContext from "../Context/userContext";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import io from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const [contact, setContact] = useState([]);
  const { getuser } = useContext(userContext);
  const [user, setUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setLoaded] = useState(false);
  const [length, setLength] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currSelected, setcurrSelected] = useState(undefined);
  const navigate = useNavigate();

  const getUsers = async () => {
    const response = await getuser();
    if (response.data.User.isAvtarImage) {
      const response = await axios.get(allUserRoute, {
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      });
      setUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      setContact(response.data);
      setLoaded(true);
    } else {
      navigate("/setAvtar");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    } else {
      getUsers();
    }
  }, []);

  useEffect(() => {
    if (user) {
      socket.current = io(host);
      socket.current.emit("add-user", user._id);
      socket.current.on("new-message", (data) => {
        setNotifications((prevNotifications) => [...prevNotifications, data]);
      }); 
     
      
    }

  }, [user]);

  const handleChatchange = (chat, index) => {
    setCurrentChat(chat);
    console.log(chat);
    setcurrSelected(index);
    // Clear notifications for the selected chat
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.from !== chat._id)
  );

  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contact}
          currUser={user}
          changeChat={handleChatchange}
          length={length}
          setLength={setLength}
          notifications={notifications}
          setNotification={setNotifications}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome
            contacts={contact}
            currUser={user}
            changeChat={handleChatchange}
          />
        ) : (
          <ChatContainer
            currChat={currentChat}
            currUser={user}
            socket={socket}
            length={length}
            setLength={setLength}
            currSelected={currSelected}
            notifications={notifications}
            setNotifications={setNotifications}
          
          />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) grid-template-columns: 35% 65%;
  }
`;

export default Chat;
