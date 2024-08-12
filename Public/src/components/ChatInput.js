import React, { useState } from 'react'
import Picker from"emoji-picker-react";
import {IoMdSend} from "react-icons/io";
import {BsEmojiSmileFill} from "react-icons/bs";
import styled from 'styled-components';

const ChatInput = ({handleSendMsz}) => {
    const [showEmojiPicker, setshowEmojiPicker] = useState(false);
    const [msg, setmsg]  = useState("");
    const handleEmojiPickerHideShow= ()=>
    {
        setshowEmojiPicker(!showEmojiPicker);
    }
    const handleEmojiClick =(e,emojiObject)=>
    {
        // console.log(emojiObject);

        let message = msg;
        const emojiText = emojiObject.e;

        message = msg+ e.emoji;
        setmsg(message);
    }
    const sendChat = (e)=>
    {
        e.preventDefault();
        if(msg.length>0){
            handleSendMsz(msg);
            setmsg('');
        }
    }
    const handleChange = (e)=>
    {
        setmsg(e.target.value)
        
    }
 
  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
            <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
            {
                showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>
            }
        </div>
      </div>
      <form className='input-container' onSubmit={sendChat}>
        <input type="text" placeholder='type your message here' value={msg} onChange={handleChange} />
        <button className="submit">
            <IoMdSend/>
        </button>
      </form>
    </Container>
  )
}
const Container = styled.div`
display: grid;

grid-template-columns: 3% 75%;
place-content: center;
place-items: center;
// background-color: #080420;
padding: 0 2rem;
gap: 1rem;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  padding: 0 1rem;
  gap: 1rem;
}
.button-container {
  display: flex;
  align-items: center;
  color: white;
  gap: 1rem;
  .emoji {
    position: relative;
    svg {
      font-size: 1.5rem;
      color: #ffff00c8;
      cursor: pointer;
    }
    .EmojiPickerReact {
      position: absolute;
      top: -472px;
      background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
    *{
        background-color: transparent
    } 
        .emoji-scroll-wrapper::-webkit-scrollbar {
            background-color: #080420;
            width: 5px;
            &-thumb {
              background-color: #9a86f3;
            }
          }
      }
      
    }
  }

.input-container {
  width: 100%;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  gap: 2rem;
  background-color: #ffffff34;
  input {
    width: 90%;
    height: 60%;
    background-color: transparent;
    color: white;
    border: none;
    padding-left: 1rem;
    font-size: 1.2rem;

    &::selection {
      background-color: #9a86f3;
    }
    &:focus {
      outline: none;
    }
  }
  button {
    padding: 0 2rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #9a86f3;
    border: none;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      padding: 0.3rem 1rem;
      svg {
        font-size: 1rem;
      }
    }
    svg {
      font-size: 2rem;
      color: white;
    }
  }
}
`
export default ChatInput
