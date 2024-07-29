import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LogOut from "./LogOut";
import ChatInput from "./ChatInput";

import { getAllMessageRoute, sendMessageRoute } from "../util/ApiRoute";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({
  currChat,
  currUser,
  socket,
  length,
  setLength,
  currSelected,
  notifications,
  setNotifications
}) => {
  // console.log(currUser);

  const [messages, setMessage] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // const [length ,setLenght] = useState(0);
  // console.log(currChat)
  const scrollRef = useRef();
  useEffect(() => {
    if (currUser && currChat) {
      fetchMessage();
    }
  }, [currChat]);
  const fetchMessage = async () => {
    if (currChat) {
      const response = await axios.post(getAllMessageRoute, {
        from: currUser._id,
        to: currChat._id,
      });
      
      setMessage(response.data);
    }
  };

  const handleSendMsz = async (msg) => {
  
    
    socket.current.emit("send-msg", {
      to: currChat._id,
      from: currUser._id,
      message: msg,
      length: length,
    });
    await axios.post(sendMessageRoute, {
      from: currUser._id,
      to: currChat._id,
      message: msg,
    });
    // alert(msg);
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessage(msgs);
  };

  useEffect(() => {
    if (socket.current) {

      socket.current.on("msg-recieve", (data) => {
        if(data.from == currChat._id){
        setArrivalMessage({ fromSelf: false, message: data.msg, length: data.length });
        }
      
      
      });
    }
  });
  useEffect(() => {
    if (arrivalMessage) {
      setMessage((prev) => [...prev, arrivalMessage]);
      setLength((prev) => [...prev, length + 1]);
      if(currChat)
        {
          
          setNotifications(notifications.filter((notif)=> notif.from !== currChat._id))
          console.log(notifications.length)
          console.log(notifications)
        }
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {currChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currChat.avtarImage}`}
                  alt="avtar"
                />
              </div>
              <div className="username">
                <h3>{currChat.username}</h3>
              </div>
            </div>
            <LogOut />
          </div>
          <div className="chat-messages">
            {messages.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    <div className="content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chat-input">
            <ChatInput handleSendMsz={handleSendMsz} />
          </div>
        </Container>
      )}
    </>
  );
};
const Container = styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 15%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
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
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #d1d1d1;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-col
      or: #4f04ff21;
    }
  }
  .recieved {
    justify-content: flex-start;
    .content {
      background-color: #9900ff20;
    }
  }
}

`;
export default ChatContainer;
