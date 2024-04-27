import React, { useState, useEffect } from "react";
import axiosInstance from "../api";
import { Spinner, Tab, Nav, Row, Col } from "react-bootstrap";
import "./Proposals.css";
import { getTimeDifference } from "./helper";
import HelpSection from "./components/HelpSection";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import SubmitPaymentForm from "./components/SubmitPaymentForm";

const ProposalsPage = () => {
  const [offers, setOffers] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [active, setActive] = useState([]);
  const [declined, setDeclined] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const [submittedWork, setSubmittedWork] = useState([]);


  const toggleHelp = () => {
    setIsHelpOpen(!isHelpOpen);
  };

  const handleProposalClick = (jobId) => {
    history.push(`/proposalDetail/${jobId}`);
  };

  const fetchOffersData = async () => {
    setFetching(true);
    try {
      const apiUrl = `/api/v1/freelancer/contracts`;
      const response = await axiosInstance.get(apiUrl);
      const offers = response.data.offers;
      const sentOffers = offers.filter((offer) => offer.status === "sent");
      const acceptedOffers = offers.filter(
        (offer) => offer.status === "accepted" || offer.status == "submitted"
      );
      setOffers(sentOffers);
      setActive(acceptedOffers);

      // Fetch submitted work data and update the state
      const submittedWorkData = await fetchSubmittedWorkData();
      setSubmittedWork(submittedWorkData);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setFetching(false);
    }
  };
  const fetchSubmittedWorkData = async () => {
    try {
      const apiUrl = `/api/v1/freelancer/getSubmittedWork`; // Adjust the API route as needed
      const response = await axiosInstance.get(apiUrl);
      return response.data.submittedWork;
    } catch (error) {
      console.error("Error fetching submitted work:", error);
      return [];
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOffersData();
    fetchProposalsData();
  }, []);

  const fetchProposalsData = async () => {
    setFetching(true);
    try {
      const apiUrl = `/api/v1/freelancer/getProposals`;
      const response = await axiosInstance.get(apiUrl);
      const proposals = response.data.proposals;
      const submittedList = proposals.filter(
        (proposal) => proposal.status === "pending"
      );
      const declineList = proposals.filter(
        (proposal) => proposal.status === "declined"
      );
      setSubmitted(submittedList);
      setDeclined(declineList);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleAcceptOffer = (offerId) => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to accept this offer?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            performAcceptOffer(offerId);
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  const performAcceptOffer = async (offerId) => {
    setLoading(true);
    try {
      const apiUrl = `/api/v1/freelancer/acceptOffer/${offerId}`;
      await axiosInstance.put(apiUrl);
      toast.success("Offer accepted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchOffersData();
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error("Error accepting offer!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = (jobId) => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to delete this proposal?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteProposalConfirmation(jobId),
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  const deleteProposalConfirmation = (jobId) => {
    setLoading(true);
    const apiUrl = `/api/v1/freelancer/deleteProposal/${jobId}`;
    axiosInstance
      .delete(apiUrl)
      .then((response) => {
        toast.success("Proposal removed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.error("Error removing proposal:", error);
        toast.error("Error removing proposal!", {
          position: "top-right",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
        fetchProposalsData();
      });
  };

  const handleJobTitleClick = (jobId) => {
    history.push(`/jobDetail/${jobId}`)
  }

  const handleSubmitWork = (offerId, projectTitle, clientName) => {
    setShowSubmitModal(true);
    setModalContent(
      <SubmitPaymentForm
        offerId={offerId}
        projectTitle={projectTitle}
        clientName={clientName}
        onHide={handleCloseModal}
      />
    );
  };


  const handleCloseModal = () => {
    setShowSubmitModal(false);
    setModalContent(null);
  };



  return (
    <div className="proposals-page-container">
      <h2 className="proposals-heading"></h2>

      <Tab.Container id="proposals-tabs" defaultActiveKey="active">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column proposals-tabs">
              <Nav.Item>
                <Nav.Link eventKey="active">Active Jobs ({active.length})</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="offers">Offers ({offers.length})</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="submitted">Submitted Proposals ({submitted.length})</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="declined">Declined Proposals ({declined.length})</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="active">
                {/* Section: Active Proposals */}
                <div className="active-section">
                  <h3 className="section-heading">Active Jobs ({active.length})</h3>
                  {active.map((offer) => (
                    <div className="proposal-item" key={offer._id}>
                      <p className="proposal-date">
                        Accepted {getTimeDifference(offer.updatedAt)}
                      </p>
                      <h4 className="proposal-title" onClick={() => handleJobTitleClick(offer.project?._id)}>
                        {offer.project?.title || "Title Not Available"}
                      </h4>

                      <p className="proposal-subtitle">
                        Offered Amount: {offer.amount || "N/A"}
                      </p>

                      <p className="proposal-subtitle">
                        Offer Status:<span style={{
                          color:
                            offer.status === "accepted"
                              ? "#28a745"
                              : offer.status === "sent"
                                ? "#ffa500"
                                : offer.status === "submitted"
                                  ? "#007bff"
                                  : offer.status === "approved"
                                    ? "#17a2b8"
                                    : "#333", // Default color if status value doesn't match any of the above
                        }}> {offer.status == 'sent' ? 'Received' : offer.status == 'accepted' ? 'Hired' : offer.status || "N/A"}</span>
                      </p>

                      <p className="proposal-subtitle">
                        Due Date: {offer.dueDate ? new Date(offer.dueDate).toLocaleDateString() : "N/A"}
                      </p>
                      <div className="proposal-actions">
                        <button className="message-button">Message</button>
                        {/* Add the "Submit Work for Payment" button */}
                        {submittedWork.some((submittedOffer) => submittedOffer?.offer?._id === offer?._id) ? (
                          <button className="review-button">Resend/Review</button>
                        ) : (
                          <button className="submit-button" onClick={() => handleSubmitWork(offer?._id)}>Submit Work for Payment</button>
                        )}


                      </div>
                    </div>
                  ))}
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="offers">

                {/* Section: Offers */}
                <div className="offers-section">
                  <h3 className="section-heading">Offers ({offers.length})</h3>
                  {offers.map((offer) => (
                    <div className="proposal-item" key={offer._id}>
                      <p className="proposal-date">
                        Received {getTimeDifference(offer.updatedAt)}
                      </p>
                      <h4 className="proposal-title" onClick={() => handleJobTitleClick(offer.project?._id)}>
                        {offer.project?.title || "Title Not Available"}
                      </h4>

                      <p className="proposal-subtitle">
                        Offered Amount: {offer.amount || "N/A"}
                      </p>

                      <p className="proposal-subtitle">
                        Offer Status: <span style={{
                          color:
                            offer.status === "accepted"
                              ? "#28a745"
                              : offer.status === "sent"
                                ? "#ffa500"
                                : "#333", // Default color if status value doesn't match any of the above
                        }}> {offer.status == 'sent' ? 'Received' : offer.status == 'accepted' ? 'Hired' : offer.status || "N/A"}</span>
                      </p>

                      <p className="proposal-subtitle">
                        Due Date: {offer.dueDate ? new Date(offer.dueDate).toLocaleDateString() : "N/A"}
                      </p>
                      <div className="proposal-actions">
                        <button className="message-button">Message</button>
                        {offer.status === 'sent' && <button className="accept-button" onClick={() => handleAcceptOffer(offer._id)}>Accept</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="submitted">
                {/* Section: Submitted Proposals */}
                <div className="submitted-section">
                  <h3 className="section-heading">
                    Submitted Proposals ({submitted.length})
                  </h3>
                  {submitted.map((proposal) => (
                    <div
                      className="proposal-item"
                      key={proposal._id}

                    >
                      <p className="proposal-date">
                        Submitted {getTimeDifference(proposal.createdAt)}
                      </p>
                      {proposal.project && proposal.project.title ? (
                        <h4 onClick={() => handleProposalClick(proposal._id)} className="proposal-title">{proposal.project.title}</h4>
                      ) : (
                        <h4 className="proposal-title">Title Not Available, Look like Job has been deleted</h4>
                      )}
                      {/* Add onClick event to handle clicking on the proposal title */}
                      <span className="delete-icon" onClick={() => handleDeleteProposal(proposal._id)}>
                        &#128465;
                      </span>
                    </div>
                  ))}
                </div>

              </Tab.Pane>
              <Tab.Pane eventKey="declined">
                {/* Section: Declined Proposals */}
                <div className="declined-section">
                  <h3 className="section-heading">Declined Proposals ({declined.length})</h3>
                  {declined.map((proposal) => (
                    <div className="proposal-item" key={proposal._id}>
                      <p className="proposal-date">
                        Declined {getTimeDifference(proposal.updatedAt)}
                      </p>
                      <h4 onClick={() => handleProposalClick(proposal._id)} className="proposal-title">
                        {proposal.project?.title}
                      </h4>
                      <span className="delete-icon" onClick={() => handleDeleteProposal(proposal._id)}>
                        &#128465;
                      </span>
                    </div>
                  ))}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      <div>
        <div className="help-icon" onClick={toggleHelp}>
          Need Help?
        </div>
        {isHelpOpen && <HelpSection onClose={toggleHelp} />}
      </div>

      {loading && (
        <div className="overlay">
          <Spinner animation="border" variant="primary" />
          <p>Removing Proposal ...</p>
        </div>
      )}

      {fetching && (
        <div className="overlay">
          <Spinner animation="border" variant="primary" />
          <p>Fetching your proposals...</p>
        </div>
      )}

      {showSubmitModal && modalContent && (
        <div className="modal-overlay">
          {modalContent}
        </div>
      )}
    </div>
  );
};

export default ProposalsPage;
