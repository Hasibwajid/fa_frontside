// PortfolioForm.js

import React, { useState } from "react";
import axios from "axios";

const PortfolioForm = ({ freelancerId, onPortfolioAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    files: [],
    projectURL: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      files,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const apiUrl = `http://localhost:8080/api/v1/freelancer/addPortfolio/${freelancerId}`;
    const headers = {
      Authorization: "...", // Replace with your actual access token
    };
    const formData = new FormData();
    formData.append("title", formData.title);
    formData.append("description", formData.description);
    formData.append("projectURL", formData.projectURL);
    formData.append("files", formData.files[0]); // Assuming you want to upload a single image
    try {
      const response = await axios.post(apiUrl, formData, { headers });
      // Handle successful response and update the portfolio on the profile page
      onPortfolioAdded(response.data.portfolio);
    } catch (error) {
      console.error("Error adding portfolio:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Project Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Project URL:</label>
        <input
          type="text"
          name="projectURL"
          value={formData.projectURL}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Files:</label>
        <input type="file" name="files" onChange={handleFileChange} />
      </div>
      <div>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => onCancel()}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;
