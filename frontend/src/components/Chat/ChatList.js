import axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosApi } from "../../axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ChatList({ setCurrentChat }) {
  const [contacts, setContacts] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {
    async function getContacts() {
      try{
        const response = await axiosApi.get("/get-users", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        const result = response.data;
        setContacts(result);

      }catch(error){
        console.log(error)
        toast.error('something went wrong..!')
        navigate('/dashboard')
        
      }
    }
    getContacts();
  }, []);
  return (
    <div className="chatlist-container">
      <h2>Messages</h2>
      <div className="">
        {contacts.length > 0 && (
          <ul className="list-group list-group ">
            {contacts.map((users) => {
              return (
                <li
                  key={users._id}
                  className=" chatlist list-group-item d-flex justify-content-between align-items-start"
                  onClick={() => {
                    setCurrentChat(users);
                  }}
                >
                  <img
                    src={
                      users.profilePic
                        ? `http://localhost:3030/${users.profilePic}`
                        : "/Assests/default-profile.jpg"
                    }
                    alt={`${users.username}'s profile`}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{users.username}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChatList;
