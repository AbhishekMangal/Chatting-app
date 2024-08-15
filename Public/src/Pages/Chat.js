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
import Profile from "./Profile";
import UserPage from "./UserPage";
import LoadingBar from "react-top-loading-bar";
import recieveMsz from '../Sound/recieve.wav'
const Chat = () => {
  const socket = useRef();
  const { getuser } = useContext(userContext);
  const [isLoaded, setLoaded] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const{ currentChat, currChatDetails, currSelected} = useSelector(state => state.chat);
  const{userDetails} = useSelector(state => state.user);
  const [progress, setProgress] = useState(0);

  const{user} = useSelector(state => state.user)
  const recieveMessage = new Audio(recieveMsz);
  
  
  
  const getUsers = async () => {
    setProgress(20);
    const response = await getuser();
    setProgress(90);
  if (response && response.data.User && response.data.User.isAvtarImage) {
    
      const response = await axios.get(allUserRoute, {  
        headers: {
          "auth-token": localStorage.getItem("authToken"),
        },
      });
      dispatch(setContact(response.data));
      setLoaded(true);
    } 
    else {
      navigate("/setAvtar");
    }
    setProgress(100);
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
        console.log(data.from)
        console.log(currentChat)
        if(currentChat == null || data.from != currentChat._id)
        {
          recieveMessage.play();
        }
      }); 
     
      
    }

  }, [user]);

  const handleChatchange = (chat, index) => {
    dispatch(setCurrentChat(chat));  
 
    dispatch(setcurrSelected(index));
   setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.from !== chat._id)
  );


  };

  return (
    <Container>
        <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="h-[90vh]  w-full grid sm:grid-cols-[40%_60%] xl:grid-cols-[25%_75%] w-full bg-[#00000076]  overflow-hidden">
        {userDetails === true ?  (
          <UserPage/>

        ):(
          <div className={`${currSelected!== undefined ? 'hidden': 'contents'} sm:contents h-screen bg-[#000223]`}>
        <Contacts  changeChat={handleChatchange} notifications={notifications} setNotification={setNotifications} />
        </div>
        )
        }
        {isLoaded && !currentChat ? (
          <div className="hidden sm:contents">
          <Welcome/>
          </div>
        ) : currChatDetails ?(<Profile/>) : (
          
           <div className={`${currSelected !== undefined? 'contents':'hidden'} sm:contents`}> 
           <ChatContainer socket={socket} notifications={notifications} setNotifications={setNotifications} handleChatchange={handleChatchange}/> 
             </div>
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
  overflow:hidden
  
`;

export default Chat;
