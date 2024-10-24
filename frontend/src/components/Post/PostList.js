import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/Auth'
import {format} from 'date-fns'
import ContentLoader from "react-content-loader"


function PostList({post , postDispatch}) {

  const contentUrl = `http://localhost:3030/${post.mediaUrl}`
  
  const {loginUser} = useContext(AuthContext)
  const user = loginUser.user
  const[isLiked , setIsLiked] = useState(false)
  const [showLikes, setShowLikes] = useState(false)
  const [comment , setComment] = useState('')
  const [showComment , setShowComment] = useState(false)

  useEffect(()=>{
    if(post.postlikes.length > 0) {
      const hasLiked = post.postlikes.some(ele=>ele._id == user._id)
      setIsLiked(hasLiked)
    }
  },[post])

  // like handler
  const likeHandler = async(id) => {
    try{
        const res = await axios.put(`http://localhost:3030/api/like-post/${id}`, {} , {headers : {'Authorization' : localStorage.getItem('token')}})
        const newObg = {...res.data, post_id :  id}
        postDispatch({type : 'UPDATE_LIKE', payload : newObg})
    }
    catch(error){
      console.log(error)
    }
  }
 
 // commenet handler
  const addComment = async(id) => {
     const response = await axios.put(`http://localhost:3030/api/comment-post/${id}`,{text : comment}, {headers : {'Authorization' : localStorage.getItem('token')}})
     const data = response.data
    const newObj = {...data ,post_id :id}
     postDispatch({type : 'UPDATE_COMMENT' , payload : newObj})
     setShowComment(true)
     setComment('')
  }

  // loader fragment
  const Loader = () => {
    return (
      <ContentLoader 
      speed={2}
      width={400}
      height={460}
      viewBox="0 0 400 460"
      backgroundColor="#555555"
      foregroundColor="#f3f3f3" 
    >
      <circle cx="31" cy="31" r="15" /> 
      <rect x="58" y="18" rx="2" ry="2" width="140" height="10" /> 
      <rect x="58" y="34" rx="2" ry="2" width="140" height="10" /> 
      <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
    </ContentLoader>
    );
  };
  
  return (
    <div>
    {loginUser  && user ? (
      <div className="post bg-dark text-white">
          <div className="post-header">
              <div className="user-info">
                  <span className="username">{post.user.username}</span>
                  <span className="location">mysore</span>
              </div>
              <button className="more-options">...</button>
          </div>
          
          <div className="post-media">
              <img src={contentUrl} alt="post" className="post-img" />
          </div>
          
          <div className="post-actions">
              <button className="like-btn" onClick={()=>likeHandler(post._id)}>❤️</button>
              <button className="comment-btn" onClick={()=>{setShowComment(!showComment)}}>💬</button>
              <button className="share-btn">🔗</button>
              <button className="save-btn">💾</button>
          </div>
          
          <div className="post-likes">
            {post.postlikes.length > 0 && 
              <span>Liked by <b>{isLiked ? 'you' : post.postlikes[0].username}</b> and <b onClick={()=>setShowLikes(!showLikes)}>{post.postlikes.length - 1} others</b></span>
            }
          </div>
          
          <div className="post-caption">
              <b>{post.user.username}</b> {post.caption}
          </div>
          { showComment&&
          <div className="post-comments">
            <span>comments</span>
            {post.comments.length > 0 ? 
            ( <ul>
              {post.comments.map((comment, i) => (
                   <p key={i}><b>{comment.user.username}</b> {comment.text}</p>
               ))}
            </ul>
            ): (<p>No comments yet..</p>)}
          </div>
         }
         { showLikes&&
          <div className="post-comments">
            <span>likes</span>
            {post.postlikes.length > 0 ? 
            ( <ul>
              {post.postlikes.map((likes, i) => (
                   <p key={i}><b>{likes.username}</b></p>
               ))}
            </ul>
            ): (<p>No likes yet..</p>)}
          </div>
         }
          
          <div className="post-time">
              <span>{format(new Date(post.createdAt),"E do LLL yy")}</span>
          </div>
          
          <div className="add-comment ">
              <input className='bg-dark text-white' type="text" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add a comment..." />
              <button onClick={()=>addComment(post._id)}>Post</button>
          </div>
      </div>

    ) : (<Loader/>)}
   </div>
);
}

export default PostList
