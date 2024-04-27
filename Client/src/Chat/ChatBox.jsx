import React, { useState } from 'react';

const ChatBox = ({ selectedChat, chatMessages, setChatMessages }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const updatedMessages = [...(chatMessages[selectedChat] || []), { id: Date.now(), content: newMessage, sender: 'You' }];
      setChatMessages((prevMessages) => ({
        ...prevMessages,
        [selectedChat]: updatedMessages,
      }));
      setNewMessage('');
    }
  };

  const messages = chatMessages[selectedChat] || [];

  return (
    <div className="chat-box">
      {selectedChat !== null ? (
        <>
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      ) : (
        <div className="no-chat-selected">Your chat will be displayed here.</div>
      )}
    </div>
  );
};

export default ChatBox;
