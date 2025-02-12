import React, { useState } from 'react'
import ChatList from './ChatList'
import ChatArea from './ChatArea'
import { io } from 'socket.io-client';
import { host } from '../../host'

function ChatContainer() {
  
  const [currentChat, setCurrentChat] = useState({})

  const socket = io('https://minigram-un5y.onrender.com:10000')

  return (
    <div>
        <div className='d-flex'>
          <ChatList setCurrentChat={setCurrentChat}/>
          <ChatArea currentChat={currentChat} socket={socket}/>
        </div>
    </div>
  )
}

export default ChatContainer
