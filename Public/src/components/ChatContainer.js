import React, { useContext, useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { blockUser, getAllMessageRoute, sendMessageRoute, unBlockUser } from "../util/ApiRoute";
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

const ChatContainer = ({ socket, notifications, setNotifications, handleChatchange }) => {
  const { currentChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const [groupedMessages, setGroupedMessages] = useState({});
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const { getImageMimeType } = useContext(userContext);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef();
  const toastOption = {
    position: "top-right",
    autoClose: 5000,
    pauseOnHover: true,
    closeOnClick: true,
    draggable: true,
    theme: "dark"
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && currentChat) {
      fetchMessage();
    }
  }, [currentChat]);

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
        setProgress(100);
      } else {
        setIsBlocked(false);
        setGroupedMessages({});
      }
    }
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString([], options);
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
        [todayDate]: [...(prev[todayDate] || []), { fromSelf: true, message: msg, createdAt: new Date().toISOString() }],
      };
    });
  };

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

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        const date = new Date(data.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        setArrivalMessage({
          fromSelf: false,
          message: data.message,
          from: data.from,
          createdAt: data.createdAt,
          date,
        });
      });
    }
  }, [currentChat]);

  useEffect(() => {
    if (arrivalMessage && currentChat && arrivalMessage.from === currentChat._id) {
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
  }, [arrivalMessage]);

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
              <div className="username">
                <h3 className="text-white">{currentChat.username}</h3>
              </div>
            </div>
            <FaUserSlash
              className={`text-2xl mx-5 ${progress ? 'pointer-events-none' : ''} ${isBlocked ? "text-red-500" : "text-[#59dfca]"} cursor-pointer`}
              onClick={handleBlock}
              title={isBlocked ? 'Unblock' : 'Block'}
            />
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
                      <p className="message text-white">{message.message}</p>
                      <p className="time text-right mt-2 text-xs text-[#b0b0b0] italic">{formatTime(message.createdAt)}</p>
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
