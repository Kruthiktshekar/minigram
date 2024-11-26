import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/Auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosApi } from "../../axios";
import { host } from "../../host";

function EditProfile() {
  const { loginUser , dispatch} = useContext(AuthContext);
  const profileUrl = `${host}/${loginUser.user.profilePic}`;

  const [profilePic, setProfilePic] = useState(profileUrl);
  const [newPic , setNewPic] = useState('')
  const [bio, setBio] = useState(loginUser.user.bio);
  const [email, setEmail] = useState(loginUser.user.email);
  const [username, setUserName] = useState(loginUser.user.username);

  const navigate = useNavigate()

  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setNewPic(file)
        const fileUrl = URL.createObjectURL(file);
        setProfilePic(fileUrl);
  };
  }

  const handleUpdateProfile = async(e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('media', newPic ? newPic : loginUser.user.profilePic)
    formData.append('email', email)
    formData.append('username', username)
    formData.append('bio', bio)
    try{
        const response = await axiosApi.put('/user-update', formData , {headers : {'Authorization' : localStorage.getItem('token')}})
        if(response){
            toast.info('profile updated successfully')
            dispatch({type:'UPDATE_USER', payload:response.data})
            navigate('/dashboard/profile')
            setNewPic('')
        }
    }
    catch(error){
        console.log('error in updating profile',error)
        throw error
    }
  }

  return (
    <div className="edit-profile-container">
        {loginUser && <>
        
      <h2>Edit Profile</h2>
      <div className="edit-profile-header">
        <h2>Edit Profile</h2>
      </div>

      <div className="edit-profile-form">
        <div className="edit-profile-picture">
          <img src={loginUser.user.profilePic ?  profilePic : "/Assests/default-profile.jpg"} alt="Profile Picture" />
          <button  className="upload-button" onClick={triggerFileInput}>Change Profile Picture</button>
          <input type="file" id="file-input" accept="image/*" style={{display: 'none'}} onChange={handleImageChange}/>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div className="edit-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={e=>setUserName(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          <div className="edit-form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={e=>setBio(e.target.value)}
              placeholder="Tell something about yourself"
            ></textarea>
          </div>

          <div className="edit-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              name="email"
              onChange={e=>setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>


          <div className="edit-form-buttons">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button type="button" className="cancel-button" onClick={()=>{navigate('/dashboard/profile')}}>
              Cancel
            </button>
          </div>
        </form>
      </div>
        </>}
    </div>
  );
}

export default EditProfile;
