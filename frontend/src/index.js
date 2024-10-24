import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/Auth';
import './App.css'
import './login.css'

import "../node_modules/bootstrap/dist/css/bootstrap.min.css"


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <AuthProvider>
       <App/>
    </AuthProvider>
    </BrowserRouter>
);

