// LoginForm.jsx

import React, { useState ,useContext, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import './LoginForm.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../Context/UserContext';
import { Redirect } from 'react-router-dom';
const LoginForm = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const { handleLogin, isLoggedIn, userRole } = useContext(UserContext); // Use the handleLogin, isLoggedIn, and userRole from the context


    useEffect(()=>{
      window.scrollTo(0, 0);
    },[])
  // If the user is logged in, immediately redirect them to their respective home page
  if (isLoggedIn) {
    if (userRole === 'freelancer') {
      return <Redirect to="/freelancerHome" />;
    } else if (userRole === 'client') {
      return <Redirect to="/jobsPage" />;
    }
  }

    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/auth/login`;
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      setIsLoading(true);
      e.preventDefault();
  
      try {
        const response = await axios.post(apiUrl, formData);
        const userType = response.data.user.role;
        const token = response.data.token;
        const name = response.data.user.name;
        localStorage.setItem('clientName', name);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', userType);
        
        console.log('token is ', localStorage.getItem('authToken'));
        toast.success('Successfully Logged in!', { autoClose: 3000 });
        clearForm();
  
        // Use the handleLogin function from the context to update the login status
        handleLogin();
  
        if (userType === 'freelancer') {
          history.push('/freelancerHome');
        } else if (userType === 'client') {
          const clientId = response.data.user.id;
          localStorage.setItem('clientId', clientId);
          history.push('/jobsPage');
        }
      } catch (error) {
        toast.error('Login failed. Please check your credentials.', { autoClose: 2000 });
        console.error('Error occurred during API request:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const clearForm = () => {
        setFormData({
            email: '',
            password: '',
        });
    }
    return (
        <div className="login-form-container">
            <h2 className="login-form-header">Log In to Your Account</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? <i className="fa fa-spinner fa-spin"></i> : 'Log In'}
                    </button>
                </div>
            </form>
            <div className="forgot-password">
                <Link to="/forgot-password" className="forgot-password-link">
                    Forgot Password?
                </Link>
            </div>
            <div className="create-account-link">
                Don't have an account? <Link to="/signup" className="create-account-link">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
