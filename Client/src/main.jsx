import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import { UserProvider } from './Context/UserContext.jsx';
import './App.css';
// fo test pupose
import HomePage from './FreelancerPages/HomePage.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <UserProvider>
    <App />
    </UserProvider>
    <ToastContainer />
  </React.StrictMode>,
)
