import React, { useContext, useEffect, useRef, useState } from "react";


import { AuthContext } from "../../contexts/Auth";
import { axiosApi } from "../../axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { host } from "../../host";

function ChatArea({ currentChat, socket }) {
  const { loginUser } = useContext(AuthContext);

  const [chats, setChats] = useState([]);
  const chatRef = useRef(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate()

  useEffect(() => {
    if (socket) {
      socket.emit("add-user", loginUser.user._id);
    }
  }, [socket]);


  const handleSend = async (e) => {
    e.preventDefault();
    const formData = {
      message: message,
      to: currentChat._id,
    };
    try {
      const response = await axiosApi.post(
        "/message",
        formData,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      if (response) {
        setChats([...chats, { fromSelf: true, message: message }]);
        socket.emit("send-msgs", {
          fromSelf: false,
          message: message,
          to: currentChat._id,
        });
      }
      if (socket) setMessage("");
    } catch (err) {
      toast.error('cant send messages..!')
        navigate('/dashboard')
      throw err;
    }
  };

  socket.on("receive-msg", (data) => {
    console.log(data);
    setChats([...chats, data]);
  });

  useEffect(() => {
    async function getMsgs() {
      try {
        const response = await axiosApi.post(
          "/messages",
          { to: currentChat._id },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        setChats(response.data);
      } catch (err) {
        toast.error('cant fetch messages..!')
        navigate('/dashboard')
        throw err;
      }
    }
    getMsgs();
  }, [currentChat]);

  useEffect(() => {
    if (chatRef.current) {
      const lastMessage = chatRef.current.lastChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [chats]);

  return (
    <div className="chatarea">
      {Object.keys(currentChat).length > 0 ? (
        <div>
          <div className="chat-container">
            <div className="chat-header">
            <img
                    src={
                        currentChat.profilePic
                        ? `${host}/${currentChat.profilePic}`
                        : "/Assests/default-profile.jpg"
                    }
                    alt={`${currentChat.username}'s profile`}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
            />
              <h2>{currentChat.username}</h2>
            </div>
            <div className="chat-messages" ref={chatRef}>
              {chats.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${msg.fromSelf ? "sent" : "received"}`}
                >
                  <div className="content">{msg.message}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend}>
              <div className="chat-input">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit">Send</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <p style={{color:'white'}}>start messageing</p>
      )}
    </div>
  );
}

export default ChatArea;
