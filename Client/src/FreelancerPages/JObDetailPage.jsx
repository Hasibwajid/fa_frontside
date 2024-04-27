// JobDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import './JObDetailPage.css';
import { getTimeDifference } from "./helper";
import axiosInstance from '../api';

const JobDetailPage = () => {
  const { jobId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposalsCount, setProposalsCount] = useState(0)
  const history = useHistory()
  const [hasSentProposal, setHasSentProposal] = useState(false); // Add state for checking if a proposal has been sent



  const fetchJobData = () => {
    const apiUrl = `/api/v1/freelancer/getProjectById/${jobId}`; // Use the relative URL here
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setJobData(response.data.project);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching job details');
        setLoading(false);
      });
  };

  const fetchProposalsCount = async () => {
    try {
      const countUrl = `/api/v1/general/getProjectProposalsCount/${jobId}`; // Use the relative URL here
      const countResponse = await axiosInstance.get(countUrl);
      setProposalsCount(countResponse.data.count);
    } catch (error) {
      console.error('Error fetching proposals count:', error);
    }
  };

  const fetchHasSentProposal = async () => {
    try {
      const checkProposalUrl = `/api/v1/freelancer/checkProposalStatus/${jobId}`; // Use the relative URL here
      const checkProposalResponse = await axiosInstance.get(checkProposalUrl);
      setHasSentProposal(checkProposalResponse.data.hasSentProposal);
    } catch (error) {
      console.error('Error checking proposal status:', error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHasSentProposal();
    fetchJobData();
    fetchProposalsCount();

  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleApplyNow = () => {
    // Navigate to SendProposalPage with the jobId
    history.push(`/sendProposal/${jobId}`);
  };
  const handleViewProposal = async () => {

    try {
      const proposalUrl = `/api/v1/freelancer/getFreelancerProposalByJob/${jobId}`;
      const proposalResponse = await axiosInstance.get(proposalUrl);
      if (proposalResponse.data.proposal) {
        
        history.push(`/proposalDetail/${proposalResponse.data.proposal._id}`);
      } else {
        // Handle case where no proposal exists
        console.log("No proposal found for the freelancer and job.");
      }
    } catch (error) {
      console.error("Error fetching user's proposal:", error);
    }
  };

  const handleBrowseJobsClick =()=>{
     history.push('/freelancerHome')
  }
  return (
    <div className="job-detail-container">
      <div className="job-detail-header">
        <h1 className="job-detail-title">{jobData.title}</h1>
        <div className="job-detail-posted-time">
          <FontAwesomeIcon icon={faClock} className="clock-icon" />
          <span>{getTimeDifference(jobData.createdAt)}</span>
        </div>
      </div>
      <div className="job-detail-section">
        <div className="job-description sec">
          <h2>Description:</h2>
          <p className="job-detail-description">{jobData.description}</p>
        </div>
        <div className="job-detail-tags sec">
          <h2>Tags / Skills:</h2>
          <div className="tags-container">
            {jobData.tags.map((tag) => (
              <div key={tag} className="skill-tag">
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className="budget-proCount sec">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '10px' }}>Budget:</span>
            <span style={{ color: "black", fontSize: '20px' }}>${jobData.budget}</span>
          </div>
          <div className="proposals-count">
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '10px' }}>Proposals:</span>
            <span style={{ color: "black", fontSize: '20px' }}>{proposalsCount}</span>
          </div>
        </div>
      </div>
      <div className="apply-now-cta">
      {hasSentProposal ? (
          <div>
            <p style={{color:'green'}}>You have already applied for this project.</p>
            <div className="applied-button-container">
              <button className="applied-button view-proposal-button " onClick={handleViewProposal}>
                View/Edit Proposal
              </button>
              <button className="applied-button browse-jobs-button" onClick={handleBrowseJobsClick}>
                Browse Jobs
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>Interested in this project?</p>
            <button className="apply-now-button" onClick={handleApplyNow}>Apply Now</button>
          </div>
        )}
        </div>
    </div>
  );
};

export default JobDetailPage;
