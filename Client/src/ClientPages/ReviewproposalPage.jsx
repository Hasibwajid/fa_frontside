import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import axiosInstance from '../api';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const ReviewProposalPage = () => {
  const { proposalId } = useParams();
  const [proposalData, setProposalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory()


  const fetchProposalData = () => {
    const apiUrl = `/api/v1/client/getProposalDetails/${proposalId}`;
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setProposalData(response.data.proposal);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching proposal details');
        setLoading(false);
      });
  };


  const handleRemoveConfirmation = () => {
    setLoading(true);

    // Perform the request to decline the proposal
    const apiUrl = `/api/v1/client/declineProposal/${proposalId}`; // Use the correct URL here

    axiosInstance
      .put(apiUrl)
      .then((response) => {
        console.log("Proposal declined successfully:", response.data);
        history.push(`/proposals/${proposalData.project?._id}`)
        toast.success("Proposal declined successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // Handle any additional actions after successful decline
        // For example, you might want to refresh the proposal data
        
      })
      .catch((error) => {
        console.error("Error declining proposal:", error);
        toast.error("Error declining proposal. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleRemoveProposal = (proposalId) => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to delete this proposal?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleRemoveConfirmation(proposalId),
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  // Helper function to format the date to "YYYY" format
  const formatYear = (dateString) => {
    const date = new Date(dateString);
    return date.getHours().toString() + ':' + date.getMinutes().toString();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProposalData();
  }, [proposalId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleHireClick = () => {
    history.push(`/HirePage/${proposalId}`);
  };
  return (
    <div className="proposal-detail-container">
      {proposalData && (
        <Card className="proposal-detail-card border-0">
          <Card.Body>
            <div className="proposal-detail-avatar">
              {proposalData.freelancerProfile && (
                <img
                  className="avatar-img"
                  src={proposalData.freelancerProfile.profilePhoto}
                  alt={proposalData.freelancer.name}
                />
              )}
              <div className="proposal-detail-info">
                <h5>{proposalData.freelancer.name}</h5>
                <p>{proposalData.freelancer.city}</p>
                <p style={{ fontSize: '0.7rem', margin: 0, padding: 0 }}>
                  Budget/Bid: {proposalData.bidAmount}
                </p>
                <p style={{ fontSize: '0.8rem', margin: 0, padding: 0 }}>
                  At: {formatYear(proposalData.createdAt)} min
                </p>
              </div>
            </div>
            <div className="proposal-detail-buttons">
              <Button
                className="mx-2 btn btn-warning"
                onClick={() => handleRemoveProposal(proposalId)}
                style={{
                  backgroundColor: 'gold',
                  borderColor: 'darkorange',
                  color: 'black',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'red'; 
                  e.currentTarget.style.color = 'white'// Change color on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'gold';
                  e.currentTarget.style.color = 'black' // Revert color on mouse leave
                }}
              >
                Decline
              </Button>
              <Button style={{backgroundColor:'lightgreen', color:'black'}} 
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'green';
                e.currentTarget.style.color = 'white' // Change color on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'lightgreen';
                e.currentTarget.style.color = 'black'// Revert color on mouse leave
              }} className="btn btn-success" onClick={handleHireClick}>
                Hire
              </Button>
            </div>
            <h5 style={{ textAlign: 'left', marginTop: '20px' }}>Cover Letter</h5>
            <p className="cover-letter" style={{ textAlign: 'left' }}>{proposalData.coverLetter}</p>
            {proposalData.freelancerProfile && (
              <div className="skills-section" style={{ textAlign: 'left' }}>
                <h5 style={{ marginTop: '20px' }}>Skills:</h5>
                <div className="skills-tags"  >
                  {Array.isArray(proposalData.freelancerProfile.skills) &&
                    proposalData.freelancerProfile.skills.map((skill) => (
                      <div key={skill} className="skill-tag">
                        {skill}
                      </div>
                    ))}
                </div>
              </div>
            )}
            {proposalData.freelancerProfile && (
              <div className="portfolio" style={{ textAlign: 'left' }}>
                <h5>Portfolio:</h5>
                <div className="portfolio-list">
                  {proposalData.freelancerProfile.portfolio.map((project) => (
                    <div className="portfolio-item" key={project._id}>
                      <h4 className="portfolio-title">{project.title}</h4>
                      <p className="portfolio-details">{project.details}</p>
                      <p className="portfolio-url">Project URL: {project.projectURL}</p>
                      <p className="portfolio-tags">Tags: {project.tags.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ReviewProposalPage;