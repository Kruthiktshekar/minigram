import React, { act } from 'react'

 export const PostReducer = (state,action) => {
    switch(action.type){
        case 'SET_POSTS' : {
            return {...state , data : action.payload , isLoading : false}
        }
        case 'UPDATE_LIKE' : {
            return {...state , data : state.data.map((ele)=>{
                const {post_id , ...newLike} = action.payload
                if(ele._id == action.payload.post_id){
                    if(ele.postlikes.some(ele=>ele._id == action.payload._id)){
                        return{...ele, postlikes : ele.postlikes.filter(post => post._id !== action.payload._id)}
                    }else{
                        return {...ele, postlikes : [...ele.postlikes, newLike]}
                    }
                }else{
                    return {...ele}
                }
            })}
        }
        case 'UPDATE_COMMENT' : {
            return {...state , data : state.data.map((ele)=>{
                const {post_id , ...newCmt} = action.payload
                if(ele._id == action.payload.post_id){
                    return {...ele , comments : [...ele.comments , newCmt]}
                }
                else{
                    return {...ele}
                }
            })}
        }
        case 'ADD_POST' : {
            return {...state, data : [action.payload,...state.data  ]}
        }
        default:
      return state;
    }
}
