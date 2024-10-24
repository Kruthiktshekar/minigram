import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import {Dashboard} from "./components/Dashboard";
import Profile from "./components/Profile";
import { PrivateRoute } from "./contexts/PrivateRoute";
import { VerifyEmail } from "./pages/Verification";
import { VerifyPrivateRoute } from "./contexts/PrivateRouteVerify";
import ShowUsers from "./components/Users/ShowUsers";
import Posts from "./components/Post/Post";
import AddPost from "./components/Post/AddPost";
import ChatContainer from "./components/Chat/ChatContainer";
import EditProfile from "./components/Users/EditProfile";
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path = "/verify" element={
          <VerifyPrivateRoute>
            <VerifyEmail/>
          </VerifyPrivateRoute>
            }/>

         <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="" element={<Posts/>}/>
          <Route path="posts" element={<Posts/>}/>
          <Route path="users" element={ <ShowUsers/>}/>
          <Route path="profile" element={ <Profile />}/>
          <Route path="add-post" element={ <AddPost />}/>
          <Route path="message" element={ <ChatContainer />}/>
          <Route path="edit" element={ <EditProfile />}/>
        </Route>
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
