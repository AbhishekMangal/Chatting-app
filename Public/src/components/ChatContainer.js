import React, { useEffect, useRef, useState } from "react";
import LogOut from "./LogOut";
import ChatInput from "./ChatInput";
import { blockUser, getAllMessageRoute, sendMessageRoute, unBlockUser } from "../util/ApiRoute";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrChatDetails, setCurrentChat } from "../Features/chat/ChatSlice";
import { GoArrowLeft } from "react-icons/go";
import { MdBlockFlipped } from "react-icons/md";

const ChatContainer = ({
  socket,
  notifications,
  setNotifications,
  handleChatchange,
}) => {
  const { currentChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const [messages, setMessage] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const scrollRef = useRef();

  const dispatch = useDispatch();
  useEffect(() => {
    if (user && currentChat) {
      fetchMessage();
    }
  }, [currentChat]);

  const fetchMessage = async () => {
    if (currentChat) {
      const response = await axios.post(getAllMessageRoute, {
        from: user._id,
        to: currentChat._id,
      });
      setMessage(response.data);
      console.log(response.data)
      const lastmess = response.data[response.data.length -1];
      if(lastmess.canSend === false)
      {
        setIsBlocked(true);
      }
      else
      {
        setIsBlocked(false)
      }
    }
  };

  const handleSendMsz = async (msg) => {
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: user._id,
      message: msg,
    });
    await axios.post(sendMessageRoute, {
      from: user._id,
      to: currentChat._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessage(msgs);
  };
  const handleBlock = async (msg)=>
  {
    if(isBlocked)
    {
      const response = await axios.post(unBlockUser, {
        from: user._id,
        to: currentChat._id,
      })
      if(response.data.success)
      {
        setIsBlocked(false);
      }
    }
    else
    {
      const response = await axios.post(blockUser, {
        from: user._id,
        to: currentChat._id,
      })
      console.log(response.data)
      if(response.data.success)
      {
        setIsBlocked(true);
      }
    }
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({
          fromSelf: false,
          message: data.message,
          length: data.length,
          from: data.from,
        });
      });
    }
    setMessage([]);
  }, [currentChat]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat &&
      arrivalMessage.from === currentChat._id
    ) {
      setMessage((prev) => [...prev, arrivalMessage]);
      setNotifications(
        notifications.filter((notif) => notif.from !== currentChat._id)
      );
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <div className="grid  grid-rows-[20%,70%,10%] gap-[0.1rem] overflow-hidden">
          <div className="flex justify-between items-center px-8 ">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => dispatch(setCurrChatDetails(true))}>
              <GoArrowLeft className="text-2xl mx-5 text-white sm:hidden" onClick={() => handleChatchange(null, undefined)} />
              <div className="avatar">
                <img src={`data:image/svg+xml;base64,${currentChat.avtarImage}`} alt="avatar" className="h-8"/>
              </div>
              <div className="username">
                <h3 className="text-white">{currentChat.username}</h3>
              </div>
              <div>
              </div>
            </div>
              <MdBlockFlipped className={`text-2xl mx-5 ${isBlocked? "text-red-500": "text-white"} cursor-pointer`} onClick={handleBlock}/>
          </div>
          <div className="chat-messages flex flex-col gap-4 p-4 overflow-auto ">
            {messages.map((message) => {
              return (
                <div
                  ref={scrollRef}
                  key={uuidv4()}
                  className={`flex items-center ${message.fromSelf ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`content max-w-[40%] break-words p-4 text-[1.1rem] rounded-xl text-[#d1d1d1] ${message.fromSelf ? "bg-[#4f04ff21]" : "bg-[#9900ff20]"
                      }`}
                  >
                    <p>{message.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {!isBlocked? (
          <div className={`chat-input `}>
            <ChatInput handleSendMsz={handleSendMsz} />
          </div>
          ): 
          <h1 className="text-center text-white pt-3">
            Blocked Chat!!
          </h1>

         }
        </div>
      )}
    </>
  );
};

export default ChatContainer;