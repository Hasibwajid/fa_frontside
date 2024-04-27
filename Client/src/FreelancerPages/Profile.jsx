import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { FaEdit, FaPlus } from "react-icons/fa";
import "./Profile.css";
import axiosInstance from "../api";

const Profile = () => {
  const [freelancerProfile, setFreelancerProfile] = useState(null);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null); // To store the selected file
  const [editableFields, setEditableFields] = useState({
    speciality: false,
    description: false,
    // Add more fields as needed here...
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFreelancerProfile();
  }, []);

  const fetchFreelancerProfile = async () => {
    try {
      const apiUrl = `/api/v1/freelancer/getFreelancerProfile`; // Use the relative URL here
      const response = await axiosInstance.get(apiUrl);
      setFreelancerProfile(response.data.freelancerProfile);
    } catch (error) {
      console.error("Error fetching freelancer profile:", error);
    }
  };
  
const handleProfilePhotoChange = (event) => {
  const selectedFile = event.target.files[0];
  setNewProfilePhoto(selectedFile);

  const formData = new FormData();
  formData.append("profilePhoto", selectedFile);

  const apiUrl = `/api/v1/freelancer/setProfilePhoto/${freelancerProfile.user._id}`; // Use the relative URL here
  axiosInstance
    .put(apiUrl, formData)
    .then((response) => {
      // Fetch the updated data from the backend
      fetchFreelancerProfile();
      // Also update the profilePhoto in the current state
      setFreelancerProfile((prevProfile) => ({
        ...prevProfile,
        profilePhoto: response.data.profilePhoto,
      }));
    })
    .catch((error) => {
      console.error("Error updating profile photo:", error);
    });
};
  
const handleFieldChange = (field, value) => {
  // Update the editableFields state to indicate that the field is not editable anymore
  setEditableFields((prevEditableFields) => ({
    ...prevEditableFields,
    [field]: false,
  }));

  // Send the API request to update the data
  const apiUrl = `/api/v1/freelancer/setProfile/${freelancerProfile.user._id}`;
  const requestBody = { [field]: value };
  axiosInstance
    .put(apiUrl, requestBody)
    .then((response) => {
      // Fetch the updated data from the backend
      fetchFreelancerProfile();
    })
    .catch((error) => {
      console.error(`Error updating ${field}:`, error);
    });
};

  if (!freelancerProfile) {
    return <div>Loading...</div>;
  }

  const { user, skills, portfolio, profilePhoto, description, speciality } =
    freelancerProfile;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo">
          <img
            className="pp"
            src={
              newProfilePhoto
                ? URL.createObjectURL(newProfilePhoto)
                : profilePhoto
                ? `data:image/jpeg;base64,${profilePhoto}`
                : "http://localhost:5173/images/profilePhoto-1690500096018-358882435.jpg"
            }
            alt="Profile"
          />

          <label htmlFor="profile-photo-input">
            <FaEdit className="p-icon" size={15} />
          </label>
          <input
            type="file"
            id="profile-photo-input"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>
            {user.city}, {user.country}
          </p>
        </div>
      </div>
      <div className="profile-section">
        <div className="section-heading">
          <span style={{ display: "flex", justifyContent: "start" }}>
            <h3>
              Speciality{" "}
              {editableFields.speciality ? (
                <FaEdit
                  className="p-icon"
                  size={15}
                  onClick={() =>
                    setEditableFields((prevEditableFields) => ({
                      ...prevEditableFields,
                      speciality: false,
                    }))
                  }
                />
              ) : (
                <FaEdit
                  className="p-icon"
                  size={15}
                  onClick={() =>
                    setEditableFields((prevEditableFields) => ({
                      ...prevEditableFields,
                      speciality: true,
                    }))
                  }
                />
              )}
            </h3>
          </span>
        </div>
        {editableFields.speciality ? (
          <input
            type="text"
            value={speciality}
            onChange={(e) =>
              setFreelancerProfile((prevProfile) => ({
                ...prevProfile,
                speciality: e.target.value,
              }))
            }
            onBlur={() => handleFieldChange("speciality", speciality)}
          />
        ) : (
          <p className="description">{speciality}</p>
        )}
</div>

<div className="profile-section">
        <div className="section-heading">
          <span style={{ display: "flex", justifyContent: "start" }}>
            <h3>
              Description{" "}
              {editableFields.description ? (
                <FaEdit
                  className="p-icon"
                  size={15}
                  onClick={() =>
                    setEditableFields((prevEditableFields) => ({
                      ...prevEditableFields,
                      description: false,
                    }))
                  }
                />
              ) : (
                <FaEdit
                  className="p-icon"
                  size={15}
                  onClick={() =>
                    setEditableFields((prevEditableFields) => ({
                      ...prevEditableFields,
                      description: true,
                    }))
                  }
                />
              )}
            </h3>
          </span>
        </div>
        {editableFields.description ? (
          <input
            type="text"
            value={description}
            onChange={(e) =>
              setFreelancerProfile((prevProfile) => ({
                ...prevProfile,
                description: e.target.value,
              }))
            }
            onBlur={() => handleFieldChange("speciality", description)}
          />
        ) : (
          <p className="description">{description}</p>
        )}
      </div>
      {/* Display Portfolio */}
      <div className="portfolio-section">
        <h3>Portfolio</h3>
        <div className="portfolio-list">
          {portfolio.map((item) => (
            <div className="portfolio-item" key={item._id}>
              <h4>{item.title}</h4>
              <p>{item.details}</p>
              <ul>
                {item.tags.map((tags) => (
                  <li key={tags}>{tags}</li>
                ))}
              </ul>
              <a href={item.projectURL} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </div>
          ))}
        </div>
      </div>
 {/* Display Skills */}
      <div className="skills-section">
        <h3>Skills</h3>
        <div className="skills-list">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;