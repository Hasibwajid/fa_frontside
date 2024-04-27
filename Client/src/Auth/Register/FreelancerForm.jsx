import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FreelancerForm.css';
import { toast } from 'react-toastify'; // Import the toast module
import 'react-toastify/dist/ReactToastify.css';

const FreelancerForm = () => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneCode: '', // Add phoneCode field to store the selected phone code
    phone: '',
    city: '',
    agreeTerms: false,
    showPassword: false,
    showConfirmPassword: false,
  });
  const [loading, setLoading] = useState(false); // State to track loading state
  const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/auth/register`;


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handlePhnInputChange = (e) => {
    const { name, value } = e.target;
    // Ensure the input doesn't exceed the maximum length for Pakistani phone numbers (10 digits)
    if (formData.phoneCode === '+92' && value.length > 10) {
      return;
    }
    // Restrict the input to accept only numeric values (0-9)
    const numericValue = value.replace(/[^0-9]/g, ''); // Use regex to replace non-numeric characters
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: numericValue,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));
  };

  const handlePhoneCodeChange = (e) => {
    const { value } = e.target;
    if (formData.phoneCode === '+92' && value.length > 10) {
      return
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneCode: value,
    }));
  };

  const handlePasswordToggle = (inputType) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [inputType]: !prevFormData[inputType],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Extract only the required fields
    const freelancerDataToSend = {
      name: formData.username,
      email: formData.email,
      password: formData.password,
      role: 'freelancer',
      address: formData.address,
      phone: formData.phone,
      city: formData.city,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(freelancerDataToSend),
      });

      const data = await response.json();
      console.log('API response:', data);

      setLoading(false); // Set loading state to false when the API request is completed
      // Check if the API request was successful
      if (response.status >= 200 && response.status < 300) {
        // Show the success toast message
        toast.success('Successfully signed up!', { autoClose: 3000 });
        clearForm();
      } else if (data.error === 'User already exists') {
        // Show a specific error message if the email is already taken
        toast.error('The email address is already in use. Please try a different email.', { autoClose: 3000 });
      } else {
        // Show the generic error message with the error from the API response
        toast.error(data.error, { autoClose: 3000 });
      }
      // Handle the API response as needed
      history.push('/Login');
    } catch (error) {
      console.error('Error occurred during API request:', error);
      setLoading(false); // Set loading state to false when the API request is completed
      toast.error('Sign up failed. Please try again.', { autoClose: 3000 }); // Display error toast
      // Handle the error as needed
    }
  };

  const clearForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      phoneCode: '',
      phone: '',
      city: '',
      agreeTerms: false,
      showPassword: false,
      showConfirmPassword: false,
    });
  }
  return (
    <div className="signup-form-container">
      <h2>Create Your Freelancer Account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="i-e: example@gmail.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={formData.showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <i
              className={`fa ${formData.showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => handlePasswordToggle('showPassword')}
              aria-hidden="true"
            ></i>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              type={formData.showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
            <i
              className={`fa ${formData.showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => handlePasswordToggle('showConfirmPassword')}
              aria-hidden="true"
            ></i>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <div className="phone-input">
            <select id="phoneCode" name="phoneCode" onChange={handlePhoneCodeChange}>
              <option value="">Select Code</option>
              <option value="+92">+92 (Pakistan)</option>
              {/* Add more country codes here */}
            </select>
            <input
              type="text"
              id="phone"
              name="phone"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.phone}
              onChange={handlePhnInputChange}
              placeholder="Enter your phone number"
              required
              disabled={!formData.phoneCode.startsWith('+92')}
              maxLength={formData.phoneCode === '+92' ? 10 : null} // Set the maximum length to 10 if phoneCode is +92

            />
            <div className="phone-flag">
              {/* Place your phone codes icon here, for example, a flag or a phone icon */}
              Flag
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <select id="city" name="city" value={formData.city} onChange={handleInputChange} required>
            <option value="">Select City</option>
            <option value="karachi">Karachi</option>
            <option value="lahore">Lahore</option>
            <option value="islamabad">Islamabad</option>
            {/* Add more cities here */}
          </select>
        </div>
        <div className="form-group">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleCheckboxChange}
              required
              className='chk-input'
            />
            <label htmlFor="agreeTerms">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </label>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Create My Account'}
          </button>
        </div>
      </form>
      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default FreelancerForm;
