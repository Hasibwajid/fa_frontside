import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./ProposalDetailPage.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getTimeDifference } from "./helper";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationAlert from "../Components/ConfirmationAlert";
import axiosInstance from "../api";

const SentProposalDetailPage = () => {
  const { jobId } = useParams();
  const history = useHistory();
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [editable, setEditable] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");


  const fetchProjectData = () => {
    const apiUrl = `/api/v1/freelancer/getProposalDetails/${jobId}`;
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setBidAmount(response.data.proposal.bidAmount.toString()); // Set the default value of bidAmount to the value received in the API response
        setProjectData(response.data.proposal);
        setCoverLetter(response.data.proposal.coverLetter);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching project details");
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectData();
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleWithdraw = () => {
    // Pass the necessary props to ConfirmationAlert
    ConfirmationAlert({
      message: "Are you sure you want to withdraw your proposal?",
      onConfirm: handleConfirmWithdraw,
    });
  };
  

  const handleConfirmWithdraw = () => {
    // Send DELETE request to withdraw the proposal
    const apiUrl = `/api/v1/freelancer/deleteProposal/${jobId}`;
    axiosInstance
      .delete(apiUrl)
      .then((response) => {
        console.log("Proposal withdrawn successfully:", response.data);
        toast.success("Proposal withdrawn successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        // Redirect to the previous page or any other desired location
        history.goBack();
      })
      .catch((error) => {
        console.error("Error withdrawing proposal:", error);
        toast.error("Error withdrawing proposal. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
          });      });
  };


  
  const handleCancel = () => {
    setEditable(false);
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleUpdateProposal = () => {
    // Create an object to hold the updated proposal data
    const updatedProposal = {
      bidAmount: bidAmount,
      coverLetter: coverLetter,
    };

    // Make the POST request to update the proposal
    const apiUrl = `/api/v1/freelancer/updateProposal/${jobId}`;
    axiosInstance
      .post(apiUrl, updatedProposal)
      .then((response) => {
        toast.success("Proposal updated successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        // Set editable back to false to make the bid amount and cover letter read-only again
        setEditable(false);
      })
      .catch((error) => {
        console.error("Error updating proposal:", error);
      });
  };


  return (
    <div className="proposal-detail-container">
      <h1 className="proposal-detail-heading">Proposal Detail</h1>
      <div className="project-details-section">
        <h2 className="project-title">{projectData.project.title}</h2>
        <p className="project-description">{projectData.description}</p>
      </div>
      <div className="status-time-section">
      <div className="status" style={{
          color:
            projectData.status === "accepted"
              ? "#28a745"
              : projectData.status === "pending"
              ? "#ffa500"
              : projectData.status === "interviewing"
              ? "#4169e1"
              : "#333", // Default color if status value doesn't match any of the above
        }}>{projectData.status}</div>
      <div className="posted-time">Posted: {getTimeDifference(projectData.createdAt)}</div>
      <div className="updated-time">Last Updated: {getTimeDifference(projectData.updatedAt)}</div>
    </div>
      <div className="terms-section">
        <h2>Terms:</h2>
        <div className="bid-section">
          <label htmlFor="bid-amount" className="bid-amount-label">
            Your Bid Amount:&nbsp;
          </label>
          <div className="bid-input-container">
            {editable ? (
              <input
                type="number"
                id="bid-amount"
                value={bidAmount}
                onChange={handleBidAmountChange}
                className="bid-input"
                placeholder="Enter your bid amount"
              />
            ) : (
              <span className="bid-amount-readOnly">{bidAmount} PKR</span>
            )}
          </div>
        </div>

        <div className="receive-section">
          You'll Receive:{" "}
          <span className="receive-amount">
            {(parseFloat(bidAmount) - parseFloat(bidAmount) * 0.05).toFixed(2)}{" "}
            PKR
          </span>
        </div>
        <div className="btn-section">
          {editable ? (
            <>
              <button className="save-btn" onClick={() => {
                setEditable(false);
                handleUpdateProposal();
                }}>
                Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button className="change-btn" onClick={handleEdit}>
              Change Terms
            </button>
          )}
          <button className="withdraw-btn" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
      </div>
      <div className="cover-letter-section">
        <h2>Cover Letter</h2>
        {editable ? (
          <textarea
            className="cover-letter-input"
            placeholder="Write your cover letter here..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        ) : (
          <div className="cover-letter-readOnly">{coverLetter}</div>
        )}
      </div>
      
     
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
    
  );
};

export default SentProposalDetailPage;
