import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import SideBar from './SideBar'
import {Outlet } from 'react-router-dom'
import { PostReducer } from '../reducers/Post-Reducer'


export  const PostContext = createContext()
export function Dashboard() {

  const [posts , postDispatch] = useReducer(PostReducer, {data:[], isLoading : true})
  
  return (
   <div className='main-layout'>
      <SideBar/>
     <div className='main-content'>
      <PostContext.Provider value={{posts, postDispatch}} >
      <Outlet/>
      </PostContext.Provider>
     </div>
   </div>
  )
}


