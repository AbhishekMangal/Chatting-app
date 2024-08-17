import React, { useContext, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { blockUser, getAllMessageRoute, seenMessageRoute, sendMessageRoute, unBlockUser } from "../util/ApiRoute";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { setCurrChatDetails } from "../Features/chat/ChatSlice";
import { GoArrowLeft } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import userContext from "../Context/userContext";
import LoadingBar from "react-top-loading-bar";
import null_image from '../Images/null images.jpg';
import { FaUserSlash } from "react-icons/fa";
import sendMsz from "../Sound/send.mp3"

import CryptoJS from "crypto-js";

const ChatContainer = ({ socket, notifications, setNotifications, handleChatchange }) => {
  const { currentChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const { getImageMimeType } = useContext(userContext);
  const [progress, setProgress] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isUserOnline, setIsUserOnline] = useState(false);
  const scrollRef = useRef();
  const toastOption = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    closeOnClick: true,
    draggable: true,
    theme: "dark"
  };
  const secret = process.env.REACT_APP_SECRET_KEY;
  const sendmsz = new Audio(sendMsz);
 
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && currentChat) {
      fetchMessage();
      setIsUserOnline(onlineUsers.has(currentChat._id))
    }
  }, [currentChat,onlineUsers]);

  const fetchMessage = async () => {
    setProgress(10);
    if (currentChat) {
      const response = await axios.post(getAllMessageRoute, {
        from: user._id,
        to: currentChat._id,
      });
      setProgress(50);

      if (response.data.length > 0) {
        const lastMessage = response.data[response.data.length - 1];
        if (lastMessage.canSend === false) {
          response.data.pop();
          setIsBlocked(true);
        } else {
          setIsBlocked(false);
        }
        const grouped = response.data.reduce((acc, msg) => {
          const date = new Date(msg.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(msg);
          return acc;
        }, {});

        setGroupedMessages(grouped);
      } else {
        setIsBlocked(false);
        setGroupedMessages({});
      }
      setProgress(100);
    }
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString([], options);
  };
  const decryption = (msg)=>{
    const secretKey = secret; // Must match the key used for encryption
      const bytes = CryptoJS.AES.decrypt(msg, secretKey);
      const decryptedMsg = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedMsg;
  }


  // For sending Message
  const handleSendMsz = async (msg) => {
    const secretKey = secret; 
    const encryptedMsg = CryptoJS.AES.encrypt(msg, secretKey).toString();
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: user._id,
      message: encryptedMsg,
    });
    console.log(currentChat)
    await axios.post(sendMessageRoute, {
      from: user._id,
      to: currentChat._id,
      message: encryptedMsg,
    });
    setGroupedMessages(prev => {
      const todayDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      if (!prev[todayDate]) {
        prev[todayDate] = [];
      }
      return {
        ...prev,
        [todayDate]: [...(prev[todayDate] || []), { fromSelf: true, message: encryptedMsg, createdAt: new Date().toISOString() }],
      };
    });
    sendmsz.play();
  };


  // For handle Block Functionality

  const handleBlock = async () => {
    const action = isBlocked ? "Unblock" : "Block";
    const message = isBlocked ? `Are you sure you want to unblock ${currentChat.username}?` : `Are you sure you want to block ${currentChat.username}?`;
    if (window.confirm(message)) {
      try {
        setProgress(20);
        const response = await axios.post(isBlocked ? unBlockUser : blockUser, {
          from: user._id,
          to: currentChat._id,
        });
        setProgress(50);
        if (response.data.success) {
          toast[isBlocked ? "info" : "warning"](response.data.msz, toastOption);
          setIsBlocked(!isBlocked);
        } else {
          toast.error(response.data.msz, toastOption);
        }
      } catch (error) {
        console.error("Error blocking/unblocking user", error);
      }
      setProgress(100);
    }
  };

  


  // Handle Message recieving
  useEffect(() => {

    const handleMessageReceive = (data) => {
      const date = new Date(data.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
  
      setArrivalMessage(prev => {
        const newDate = new Date(data.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
  
        return {
          fromSelf: false,
          message: data.message,
          from: data.from,
          createdAt: new Date().toISOString(), // Use the received createdAt instead of new Date().toISOString()
          date: newDate,
        };
      });
    };
  
    if (socket.current) {
      socket.current.on("msg-recieve", handleMessageReceive);
    }
  
    // Cleanup the event listener when the component unmounts
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve", handleMessageReceive);
      }
    };
  }, [currentChat]);
  

  useEffect(() => {
    if (arrivalMessage ){
      if(currentChat && arrivalMessage.from === currentChat._id) {
      setGroupedMessages(prev => {
        const date = new Date(arrivalMessage.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        if (!prev[date]) {
          prev[date] = [];
        }
        return {
          ...prev,
          [date]: [...(prev[date] || []), arrivalMessage],
        };
      });
      setNotifications(prev =>
        prev.filter((notif) => notif.from !== currentChat._id)
      );
    }
    
  }
  }, [arrivalMessage]);

  useEffect(() => {
    // Handle when a user comes online
    const handleUserOnline = ({ userId }) => {
      
      setOnlineUsers(prev => new Set(prev).add(userId));
    };
  


    // Handle when a user goes offline
    const handleUserOffline = ({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    };

    if (socket.current) {
      socket.current.on("user-online", handleUserOnline);
      socket.current.on("user-offline", handleUserOffline);
    }

    return () => {
      if (socket.current) {
        socket.current.off("user-online", handleUserOnline);
        socket.current.off("user-offline", handleUserOffline);
      }
    };
  }, [socket]);


  
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      
    }, [groupedMessages]);
  

  return (
    <>
      <LoadingBar
        color='#f11946'
        progress={progress} 
        onLoaderFinished={() => setProgress(0)}
      />
      {currentChat && (
        <div className="grid grid-rows-[15%,75%,10%] gap-[0.1rem] overflow-hidden h-[90vh]">
          <div className="flex justify-between items-center px-8">
            <div className={`flex items-center gap-4 cursor-pointer ${progress ? 'pointer-events-none' : ''}`} title="Contact Details" onClick={() => dispatch(setCurrChatDetails(true))}>
              <GoArrowLeft className="text-2xl mx-5 text-white sm:hidden" onClick={() => handleChatchange(null, undefined)} />
              <div className="avatar">
                {currentChat.avtarImage ? (
                  <img src={`data:${getImageMimeType(currentChat.avtarImage)};base64,${currentChat.avtarImage}`} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <img src={null_image} className="h-12 w-12 rounded-full object-cover" />
                )}
              </div>
              <div className="username flex flex-col justify-center">
                <h3 className="text-white">{currentChat.username}</h3>
                <p className="text-xs text-gray-500">
                  {isBlocked?'Blocked': isUserOnline? 'Online': 'Offline'}
                </p>
              </div>
            </div>
            <button className="ml-auto p-2 text-gray-500"  onClick={handleBlock}>
            <FaUserSlash
              className={`text-2xl mx-5 ${progress ? 'pointer-events-none' : ''} ${isBlocked ? "text-red-500" : "text-[#59dfca]"} cursor-pointer`}
             
              title={isBlocked ? 'Unblock' : 'Block'}
            />
            {isBlocked ? 'Unblock' : ''}
            </button>
          </div> 
          <div className="chat-messages flex flex-col gap-4 p-4 overflow-auto">
            {Object.keys(groupedMessages).map((date) => (
              <div key={date}>
                <div className="date-separator text-center text-[#b0b0b0] mt-4 mb-2">
                  <p>{date}</p>
                </div>
                {groupedMessages[date].map((message, index) => (
                  <div
                    ref={scrollRef}
                    key={uuidv4()}
                    className={`flex items-center ${message.fromSelf ? "justify-end" : "justify-start"} mb-3`} // Added margin-bottom
                  >
                    <div
                      className={`content max-w-[80%] md:min-w-[20%] md:max-w-[60%] min-w-[35%] break-words p-4 text-[1.1rem] rounded-xl ${message.fromSelf ? "bg-[#4f04ff21]" : "bg-[#9900ff20]"}`}
                    >
                      <p className="message text-white">{decryption(message.message)}</p>
                      <div className="flex gap-1 justify-end">
                      <div>
                      <p className="time text-right mt-2 text-xs pr-1 mr-1 text-[#b0b0b0] italic">{formatTime(message.createdAt)}
                          
                      </p> </div>
                        <div className={`text-sm gap-0 ${message.seen?'text-[#9a86f3]':'text-gray-500 '}`}>
                          {message.fromSelf && 
                               <> &#10004; </>
                              }
                          {message.fromSelf && message.seen && 
                               <> &#10004; </>
                          }
                          </div>
                     
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {!isBlocked ? (
            <div className={`chat-input flex items-center justify-center`}>
              <ChatInput handleSendMsz={handleSendMsz} />
            </div>
          ) : (
            <h1 className="text-center text-white pt-3">Blocked Chat!!</h1>
          )}
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default ChatContainer;
