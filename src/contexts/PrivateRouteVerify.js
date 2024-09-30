import { Navigate } from "react-router-dom"

export const VerifyPrivateRoute = (props) => {
    const email = sessionStorage.getItem('email')
if(email){
    return props.children
}else{
    return <Navigate to='/signup'/>
}
}