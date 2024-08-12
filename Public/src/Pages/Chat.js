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
import { useDispatch, useSelector } from "react-redux";
import { setContact, setCurrentChat, setcurrSelected } from "../Features/chat/ChatSlice";
import { setUser } from "../Features/user/userSlice";
import Profile from "./Profile";
import UserPage from "./UserPage";

const Chat = () => {
  const socket = useRef();
  const { getuser } = useContext(userContext);
  const [isLoaded, setLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const{contact, currentChat, currChatDetails} = useSelector(state => state.chat);
  const{userDetails} = useSelector(state => state.user);

  const{user} = useSelector(state => state.user)

  
  
  
  const getUsers = async () => {
    const response = await getuser();
 
    if (response && response.data.User && response.data.User.isAvtarImage) {

      // If user login then get all the users except him

      const response = await axios.get(allUserRoute, {  
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      });
      dispatch(setUser(await JSON.parse(localStorage.getItem("chat-app-user"))))
      dispatch(setContact(response.data));
      setLoaded(true);
    } 
    else {
      navigate("/setAvtar");
    }
  };


  // if not login then nvaigate
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    } else {
      getUsers();
    }
  }, []);


  // For notification and socket connection 
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
    dispatch(setCurrentChat(chat));  
    console.log(currentChat, chat)
    dispatch(setcurrSelected(index));
   setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.from !== chat._id)
  );


  };

  return (
    <Container>
      
      <div className=" h-screen max-w-full grid grid-cols-[40%_60%] xl:grid-cols-[25%_75%] w-full bg-[#00000076]">
        {userDetails === true ?  (
          <UserPage/>

        ):(
        <Contacts  changeChat={handleChatchange} notifications={notifications} setNotification={setNotifications}/>
        )
        }
        {isLoaded && !currentChat ? (
          <Welcome/>
        ) : currChatDetails ?(<Profile/>) : ( <ChatContainer socket={socket} notifications={notifications} setNotifications={setNotifications}/>  )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  overflow:hidden
  
`;

export default Chat;
