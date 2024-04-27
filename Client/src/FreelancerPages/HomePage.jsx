import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import { useHistory } from "react-router-dom";
import { getTimeDifference } from "./helper";
import {  Spinner } from 'react-bootstrap'; // Assuming you have the Spinner component from react-bootstrap
import axiosInstance from "../api";

const Home = () => {
  const history = useHistory();
  const [jobsData, setJobsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectsLength, setProjectsLength] = useState(0);
  const [loading, setLoading] = useState(true);


  const handleProposalsClick = () => {
    history.push("/freelancerProposals");
  };

  const handleProfileClick = () => {
    // Add your logic to handle the click event for "My Profile"
    history.push("/freelancerProfile");
    };

  const handleJobItemClick = (jobId) => {
    // Add your logic to handle the click event for job items
    console.log(`Job item with ID ${jobId} clicked!`);
    history.push(`/jobDetail/${jobId}`, { fromHomePage: true }); // Navigate to the detail page with the jobId and the state
  };
  
const fetchJobsData = async () => {
  try {
    setLoading(true);
    const apiUrl = `/api/v1/freelancer/getAllProjects`; // Use the relative URL here
    const response = await axiosInstance.get(apiUrl);
    const jobs = response.data.projects;
    setProjectsLength(jobs.length);

    // Fetch the count of proposals for each job
    const jobsWithProposalsCount = await Promise.all(
      jobs.map(async (job) => {
        const countUrl = `/api/v1/general/getProjectProposalsCount/${job._id}`; // Use the relative URL here
        const countResponse = await axiosInstance.get(countUrl);
        return {
          ...job,
          proposalsCount: countResponse.data.count,
        };
      })
    );

    setJobsData(jobsWithProposalsCount);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  } finally {
    setLoading(false); // Set loading to false after all API calls are completed
  }
};

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJobsData();
  }, []);

  const highlightSearchTerm = (text) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseText = text.toLowerCase();
    const index = lowerCaseText.indexOf(lowerCaseSearchTerm);
    if (index === -1) {
      return text;
    } else {
      const beforeMatch = text.slice(0, index);
      const match = text.slice(index, index + searchTerm.length);
      const afterMatch = text.slice(index + searchTerm.length);
      return (
        <>
          {beforeMatch}
          <span className="highlightedText">{match}</span>
          {afterMatch}
        </>
      );
    }
  };

  const filteredJobsData = jobsData.filter((job) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const titleIncludesSearchTerm = job.title
      .toLowerCase()
      .includes(lowerCaseSearchTerm);
    const descriptionIncludesSearchTerm = job.description
      .toLowerCase()
      .includes(lowerCaseSearchTerm);
    const tagsIncludeSearchTerm = job.tags.some((tag) =>
      tag.toLowerCase().includes(lowerCaseSearchTerm)
    );
    return (
      titleIncludesSearchTerm ||
      descriptionIncludesSearchTerm ||
      tagsIncludeSearchTerm
    );
  });

  return (
    
    <div className="home-container">
      {loading && (
         <div
         className="d-flex justify-content-center align-items-center"
         style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)' }}
       >
         <div style={{ textAlign: 'center' }}>
           <Spinner animation="border" variant="primary" />
           <p>Fetching latest jobs...</p>
         </div>
       </div>
      )}
      <div className="top-section">
        <div className="item">
          <span>My Proposals</span>
          <FontAwesomeIcon
            onClick={handleProposalsClick}
            icon={faAngleRight}
            className="arrow-icon"
          />
        </div>
        <div className="item">
          <span>My Profile</span>
          <FontAwesomeIcon
            onClick={handleProfileClick}
            icon={faAngleRight}
            className="arrow-icon"
          />
        </div>
      </div>

      <div className="jobs-section">
        <div className="jobs-heading">
          <h2>Jobs</h2>
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Jobs"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>
        <div className="jobsCount">
          Available Jobs:{" "}
          <span style={{ color: "black" }}>{projectsLength}</span>
        </div>
        <div className="job-list-container" >
          <div className="job-list">
            {/* Sample Job 1 */}
            {filteredJobsData.map((job) => (
              <div
                className="job-item"
                key={job._id}
                onClick={() => handleJobItemClick(job._id)}
              >
                <div className="job-details">
                  <h3 className="job-title">
                    {highlightSearchTerm(job.title)}
                  </h3>
                  <div className="job-meta">
                    <span className="posted-time">
                      Posted: {getTimeDifference(job.createdAt)}
                    </span>
                    <span className="budget">Budget: ${job.budget}</span>
                  </div>
                </div>
                <p className="job-description">
                  {highlightSearchTerm(job.description)}
                </p>
                <div className="job-skills">
                  <div className="tags-container">
                    {job.tags.map((tag) => (
                      <div key={tag} className="skill-tag">
                        {highlightSearchTerm(tag)}
                      </div>
                    ))}
                  </div>
                  <div className="proposals-count">
                    Proposals:{" "}
                    <span style={{ color: "black" }}>{job.proposalsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
