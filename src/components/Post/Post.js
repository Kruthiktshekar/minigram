import React, { useContext, useEffect, useReducer, useState } from 'react'
import PostList from './PostList'
import axios from 'axios'
import { PostContext } from '../Dashboard'
import { axiosApi } from '../../axios'


function Posts() {

  const {posts, postDispatch} = useContext(PostContext)
  const [errors, setErrors] = useState({})
  const resErrors = {}

  

  useEffect(()=>{
    try{
      async function getPosts() {
        const response = await axiosApi.get('/all-posts' , {headers : {'Authorization' : localStorage.getItem('token')}})
        postDispatch({type : 'SET_POSTS', payload : response.data})}
      getPosts()
    }
    catch(err){
      resErrors.error = err.response.data.msg
      setErrors(resErrors)
    }
  },[])



  return (
    <div className='post-container'>
          {posts.data.length>0 ? (
           <div>
             {posts.data.map((post)=>{
               return <PostList key={post._id} post={post} postDispatch = {postDispatch} />
             })}
           </div>
         ): (<p style={{color:'white'}}>No posts..</p>)}
    </div>
      
  )
}

export default Posts