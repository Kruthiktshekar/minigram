import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/Auth'
import { toast } from 'react-toastify';
import { axiosApi } from '../axios';


function Login() {
  const [username , setUserName] = useState('')
  const [password , setPassword] = useState('')
  const {dispatch} = useContext(AuthContext)
  const [loginClientSideErrors , setLoginClientSideErrors] = useState({})
  const clientSideErrors = {}


  const navigate = useNavigate()

  const runClientSideValidation = () =>{
    if(username.trim().length === 0){
      clientSideErrors.name = 'username cannot be empty'
    }else if(password.trim().length === 0){
      clientSideErrors.password = 'Password cannot be empty'
    }else if(password.length>128 || password.length < 4) {
      clientSideErrors.password = 'Password should be greater than 4 digits'
    }
  }
  const loginHandler = async(e) => {
    e.preventDefault()
    const formData = {
      username,
      password
    }
    runClientSideValidation()
    if(Object.keys(clientSideErrors).length === 0){
      try{
        const response = await axiosApi.post('/login', formData)
        if(response){
          localStorage.setItem('token' , response.data.token)
          const userData = await axiosApi.get('/get-user' , {headers : {'Authorization' : localStorage.getItem('token')}})
          if(userData){
            dispatch({type : 'LOGIN' , payload : userData.data})
            toast.success('Logged in successfully')
            navigate('/dashboard')
            setUserName('')
            setPassword('')
            setLoginClientSideErrors({})
          }
        }
      }
      catch(error){
        console.log(error)
        if(error.status == 401) {
          toast.error(error.response.data.msg)
        }
        if(error.status == 500) {
          toast.error('something went wrong')
        }
        toast.error('something went wrong')
       setUserName('')
       setPassword('')
      }

    }else{
      setLoginClientSideErrors(clientSideErrors)
    }
  }

  return (
    <div className="container">
        <div className="phone-preview">
            <img src="./Assests/LandingPagesTipsBG.jpg" alt="Phone Preview"/>
        </div>
        <div className="login-container ">
            <div className="form-box">
                <h1>Minigram</h1>
                <form>
                  {loginClientSideErrors.name && <p style={{color:'red'}}>{loginClientSideErrors.name}</p>}
                    <input type="text" placeholder="username, or email" value={username} onChange={e=>setUserName(e.target.value)}/>
                  {loginClientSideErrors.password && <p style={{color:'red'}}>{loginClientSideErrors.password}</p>}
                    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
                    <button type="submit" onClick={loginHandler}>Log In</button>
                </form>
                <div className="divider">OR</div>
                <button className="fb-login">Log in with Facebook</button>
                <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            <div className="signup-box">
                <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
            </div>
            <div className="app-links">
                <p>Get the app.</p>
                <div>   
                    <img src="./Assests/play_16076076.png" alt="Google Play"/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login
