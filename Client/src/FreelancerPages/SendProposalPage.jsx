import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "./SendProposalPage.css"; // Make sure to create SendProposalPage.css file and import it here
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { css } from "@emotion/react";
import { Modal, Button, Toast } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance from "../api";


const SendProposalPage = () => {
  const { jobId } = useParams();
  const [isSending, setIsSending] = useState(false);
  const history = useHistory();
  const [timeEstimate, setTimeEstimate] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [projectData, setProjectData] = useState(null);
  const spinnerStyles = css`
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
`;
const [showModal, setShowModal] = useState(false);




  const fetchProjectData = () => {
    const apiUrl = `/api/v1/freelancer/getProjectById/${jobId}`;
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setProjectData(response.data.project);
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
  const validatePositiveNumber = (value) => {
    return value >= 0 || value === "";
  };

  const handleBidAmountChange = (event) => {
    const value = event.target.value;
    if (validatePositiveNumber(value)) {
      setBidAmount(value);
    }
  };

  const handleTimeEstimateChange = (event) => {
    const value = event.target.value;
    if (validatePositiveNumber(value)) {
      setTimeEstimate(value);
    }
  };

  const handleCoverLetterChange = (event) => {
    setCoverLetter(event.target.value);
  };

  const handleSendProposal = () => {
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      toast.error("Please enter a valid bid amount greater than 0.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!timeEstimate || isNaN(timeEstimate) || timeEstimate <= 0) {
      toast.error("Please enter a valid estimated time greater than 0.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // Check for cover letter length and empty value
    if (!coverLetter || coverLetter.trim().length === 0) {
      toast.error("Please fill a cover letter.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!coverLetter || coverLetter.length < 15) {
      toast.error("Cover letter must be at least 15 characters long.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSending(true); 
    // Logic to send the proposal
    const apiUrl = `/api/v1/freelancer/createProposal/${jobId}`;
    const proposalData = {
      bidAmount: parseFloat(bidAmount),
      coverLetter,
      timeEstimate: parseFloat(timeEstimate),
    };

    axiosInstance
      .post(apiUrl, proposalData)
      .then((response) => {
        setIsSending(false); // Set loading state to false after successful response
        toast.success("Proposal sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowModal(true);

      })
      .catch((error) => {
        setIsSending(false); // Set loading state to false after error response
        toast.error("Error sending the proposal. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

   // Function to close the modal and navigate to the specified page
   const handleCloseModal = (path) => {
    setShowModal(false);
    history.push(path);
  };

  const handleCancel = () => {
    // Logic to handle cancel button
    // Redirect back to the project/job detail page
    history.push(`/jobDetail/${projectData._id}`);
  };

  // Calculate the fee as 5% of the bid amount
  const fee = (parseFloat(bidAmount) * 0.05).toFixed(2);

  // Calculate the final amount after deduction of the fee
  const finalAmount = (parseFloat(bidAmount) - fee).toFixed(2);

  return (
    <div className="send-proposal-container">
      <h1 className="send-proposal-heading">Submit A Proposal</h1>
      <div className="project-details-section">
        <h2 className="project-title">{projectData.title}</h2>
        <p className="project-description">{projectData.description}</p>
        <div className="project-budget">
          Budget: <span className="budget-amount">{projectData.budget}</span>
        </div>
      </div>
      <div className="heading-terms">Terms</div>
      <div className="bid-section">
        <div className="bid1">
          <label htmlFor="bid-amount">Your Bid Amount:</label>
          <div className="bid-input-container">
            <input
              type="text"
              id="bid-amount"
              value={bidAmount}
              onChange={handleBidAmountChange}
              className="bid-input"
              placeholder="Enter your bid amount"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <span className="currency">PKR</span>
          </div>
        </div>
        <div className="fee-section">
          5% Fee: <span className="fee-amount">{fee}</span>
        </div>
        <div className="receive-section">
          You'll Receive: <span className="receive-amount">{finalAmount}</span>
        </div>
        <div className="time-estimate-section">
          <label htmlFor="est-time" style={{ fontWeight: "bold" }}>
            Estimated Time To Complete:
          </label>

          <div className="time-estimate-input-container">
            <input
              type="text"
              id="est-time"
              value={timeEstimate}
              onChange={handleTimeEstimateChange}
              className="time-estimate-input"
              placeholder="Enter estimated time"
              inputMode="numeric"
              pattern="[0-9]*"
            />

            <span className="time-unit">days</span>
          </div>
        </div>
      </div>

      <div className="cover-letter-section">
        <h2>Cover Letter</h2>
        <textarea
          className="cover-letter-input"
          placeholder="Write your cover letter here..."
          value={coverLetter}
          onChange={handleCoverLetterChange}
        />
      </div>
      <div className="btn-section">
        <button
          className="send-btn"
          onClick={handleSendProposal}
          disabled={isSending}
        >
          {isSending ? (
            <ClipLoader
              css={spinnerStyles}
              size={20}
              color={"#ffffff"}
              loading={isSending}
            />
          ) : (
            "Send"
          )}
        </button>
        <button
          className="cancel-btn"
          onClick={handleCancel}
          disabled={isSending}
        >
          Cancel
        </button>
      </div>

      <ToastContainer />
      {/* Success Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your proposal has been sent successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="btn-container">
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowModal(false);
                history.push("/freelancerHome");
              }}
            >
              Browse Jobs
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowModal(false);
                history.push("/freelancerProposals");
              }}
            >
              My Proposals
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SendProposalPage;
