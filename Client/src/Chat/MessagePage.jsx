import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import './MessagesPage.css';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});

  return (
    <div className="messages-page">
      <ChatList setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
      <ChatBox selectedChat={selectedChat} chatMessages={chatMessages} setChatMessages={setChatMessages} />
    </div>
  );
};

export default MessagesPage;
