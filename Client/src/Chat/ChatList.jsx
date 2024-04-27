import React, { useState, useEffect } from 'react';

const ChatList = ({ setSelectedChat, selectedChat }) => {
    const [searchText, setSearchText] = useState('');
    const [chats, setChats] = useState([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        // ...
    ]);


    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleChatClick = (chatId) => {
        setSelectedChat(chatId);
    };

   

    return (
        <div className="chat-list">
            <input
                type="text"
                placeholder="Search chat..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <ul className="chats">
                {filteredChats.map((chat) => (
                    <li
                        key={chat.id}
                        onClick={() => handleChatClick(chat.id)}
                        className={selectedChat === chat.id ? 'selected' : ''}
                    >
                        {chat.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
