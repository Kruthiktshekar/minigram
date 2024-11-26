import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/Auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { axiosApi } from "../axios";
import { host } from "../host";

function Profile() {
  const { loginUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletePost , setDeletePost] = useState(null)

  const user = loginUser.user;
  const navigate = useNavigate();

  useEffect(() => {
    async function getPosts() {
      try{
        const response = await axiosApi.get(`/user-posts`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        const data = response.data;
        setPosts(data);
      }
      catch(error){
        console.log(error, 'error in getting user posts')
        if(error.response.data = 'jwt expired'){
          navigate('/login')
        }
      }
    }
    getPosts();
  }, [deletePost]);

  const editHandler = () => {
    navigate("/dashboard/edit");
  };

  // Loadre Fragment
  const Loader = () => {
    return (
      <ContentLoader 
      speed={2}
      width={476}
      height={124}
      viewBox="0 0 476 124"
      backgroundColor="#555555"
      foregroundColor="#f3f3f3"
     
    >
      <rect x="48" y="8" rx="3" ry="3" width="88" height="6" /> 
      <rect x="48" y="26" rx="3" ry="3" width="52" height="6" /> 
      <rect x="0" y="56" rx="3" ry="3" width="410" height="6" /> 
      <rect x="0" y="72" rx="3" ry="3" width="380" height="6" /> 
      <rect x="0" y="88" rx="3" ry="3" width="178" height="6" /> 
      <circle cx="20" cy="20" r="20" />
    </ContentLoader>
    );
  };

  // Post Delete Functionality
  const deleteFunction = (id) => {
    setDeletePost(id)
    setShowModal(true)
  }

 
  const DeletePostModal = () => {
    if (!showModal) return null; 
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Delete Post</h2>
          <p>Are you sure you want to delete this post?</p>
          <div className="modal-actions">
            <button onClick={()=>{setShowModal(false)}} className="cancel-button">Cancel</button>
            <button onClick={handleDelete} className="delete-button">Delete</button>
          </div>
        </div>
      </div>
    );
  };
  const handleDelete = async() => {
    try{
       const response = await axiosApi.delete(`/post/${deletePost}` , {headers:{'Authorization' : localStorage.getItem('token')}})
       if(response)
       setShowModal(false)
       setDeletePost(null)
     }
    catch(err){
      console.log(err)
    }
  };

 
  const ProfileHeader = () => {
    return (
      <div className="">
          <div className="profile-header">
            <div className="profile-picture">
              <img src={user.profilePic ?  `${host}/${user.profilePic}` : "/Assests/default-profile.jpg"} alt={`${user.username}'s profile`} />
            </div>
            <div className="profile-details">
              <h2>{user.username}</h2>
              <span>{user.fullname}</span>
              <div className="profile-stats">
                <span>
                  <strong>{posts.length}</strong> posts
                </span>
                <span>
                  <strong>{user.followers.length}</strong> followers
                </span>
                <span>
                  <strong>{user.following.length}</strong> following
                </span>
                <button onClick={editHandler}>Edit Profile</button>
              </div>
              <p className="profile-bio">{user.bio  ? user.bio : 'No Bio'}</p>
            </div>
          </div>
      </div>
    );
  };


  const UserPosts = () => {
    return (
      <div className="">
        <h2>Posts</h2>
        <div className="">
          <div className="post-grid">
            { posts.length > 0 ? (posts.map((post) => (
              <div key={post._id} className="post-item" >
                <img
                  src={`${host}/${post.mediaUrl}`}
                  alt={post.caption}
                  onClick={()=>{deleteFunction(post._id)}}
                />
              </div>
            ))):(<p>No Posts</p>)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dark text-white">
      {Object.keys(user).length > 0 ? (
        <>
          <ProfileHeader />
          <UserPosts />
          {showModal && <DeletePostModal/>}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default Profile;
