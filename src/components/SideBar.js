
import React from 'react'
import {  NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function SideBar() {
  
  const navigate = useNavigate()
  const logoutHandler = () => {
    toast.warn('Logged out!')
    localStorage.removeItem('token')
    navigate('/login')
  }
  return (
    <div id="sidebar" className=" bg-dark text-white p-4">
      <h4 className='title mb-4'>Minigram</h4>
      <ul className=" sidebarList nav flex-column">
        <li className="nav-item">
          <h2 className='nav-link'><NavLink to='/dashboard/posts' className='custom-link'>Posts</NavLink></h2>
        </li>
        <li className="nav-item">
       <h2  className='nav-link'><NavLink to='/dashboard/profile' className='custom-link'>Profile</NavLink></h2>
        </li>
        <li className="nav-item">
        <h2 className='nav-link'><NavLink to='/dashboard/users' className='custom-link'>Search</NavLink></h2>
        </li>
        <li className="nav-item">
        <h2 className='nav-link'><NavLink to='/dashboard/add-post' className='custom-link'>Add Post</NavLink></h2>
        </li>
        <li className="nav-item">
        <h2 className='nav-link'><NavLink to='/dashboard/message' className='custom-link' >Message</NavLink></h2>
        </li>

        <li className="nav-item" id='logout'>
           <h2  className='nav-link' onClick={logoutHandler}>Logout</h2>
        </li>
      </ul>
    </div>
  );
};


export default SideBar
