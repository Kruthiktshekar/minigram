import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/Auth";
import ContentLoader from "react-content-loader";
import { axiosApi } from "../../axios";
import { host } from "../../host";

function ShowUsers() {
  const { loginUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [sorting , setSorting] = useState([])
  const [searchWord, setSearchWord] = useState('')
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    async function getUsers() {
      const response = await axiosApi.get(`/get-users`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const result = response.data;
      setUsers(result);
      setSorting(result)
    }
    getUsers();
  }, []);

  // serching handler
  useEffect(()=>{
      const result = users.filter((ele)=>{
        if(ele.username.startsWith(searchWord)){
          return ele
        }
      })
      setSorting(result)
  },[searchWord])
  // follow handler
  const followHandler = async (id) => {
    const response = await axiosApi.put(
      `/follow/${id}`,
      {},
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    if (response) {
      dispatch({ type: "FOLLOW", payload: response.data });
    }
  };

  // loader fragment
  const Loader = () => {
    return (
      <ContentLoader
        speed={2}
        width={400}
        height={150}
        viewBox="0 0 400 150"
        backgroundColor="#55555"
        foregroundColor="#f3f3f3"
      >
        <circle cx="10" cy="20" r="8" />
        <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
        <circle cx="10" cy="50" r="8" />
        <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
        <circle cx="10" cy="80" r="8" />
        <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
        <circle cx="10" cy="110" r="8" />
        <rect x="25" y="105" rx="5" ry="5" width="220" height="10" />
      </ContentLoader>
    );
  };

  // users list
  const UsersList = ({ ele }) => {
    const following = loginUser.user.following.includes(ele._id);

    return (
      <li
        key={ele._id}
        className="list-group-item d-flex justify-content-between align-items-start"
      >
          <img
            src={ ele.profilePic ?  `${host}/${ele.profilePic}` : "/Assests/default-profile.jpg"}
            alt={`${ele.username}'s profile`}
            className="rounded-circle"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
        <div className="ms-2 me-auto">
          <div className="fw-bold">{ele.username}</div>
          {ele.fullname}
        </div>
        <button
          className="badge text-bg-primary rounded-pill mt-2"
          onClick={() => followHandler(ele._id)}
        >
          {following ? "Unfollow" : "Follow"}
        </button>
      </li>
    );
  };
  return (
    <div>
      <input className="ms-3" type="text" value={searchWord} onChange={e=>setSearchWord(e.target.value)}/>
      {Object.keys(loginUser.user).length !== 0 && users.length > 0 ? (
        <div className="ms-3 mt-3">
          <ul className="list-group list-group col-6 ">
            {sorting.length>0 ? (sorting.map((ele) => {
              return <UsersList key={ele._id} ele={ele} />;
            })):(<p style={{color:'white'}}>No Result</p>)}
          </ul>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default ShowUsers;
