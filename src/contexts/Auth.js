import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "../reducers/Auth-Reducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosApi } from "../axios";
import { toast } from "react-toastify";


export const AuthContext = createContext()

export  function AuthProvider (props) {
    const navigate = useNavigate()

    const initialState = {
        isLoggedIn : false,
        user : {}

    }

    const [loginUser , dispatch] = useReducer(AuthReducer , initialState)



    useEffect(()=>{
        async function  getUser(){
            try{
                const token = localStorage.getItem('token')
                if(token){
                    const userData = await axiosApi.get('/get-user' , {headers : {'Authorization' : token}})
                    if(userData){
                      dispatch({type : 'LOGIN' , payload : userData.data})
                    navigate('/dashboard')
                    }
               }   
           }
           catch(err) {
            if(err.response.status  == 401){
                toast.error('session expired..')
                navigate('/login')
                localStorage.removeItem('token')
            }else{
                toast.error('something went worng..!')
            }
            console.log('[ERROR] unable to get token')
           }
        }
        getUser()
    },[])

    return (
        <AuthContext.Provider value={{loginUser, dispatch}}>
            {props.children}
        </AuthContext.Provider>
    )
}