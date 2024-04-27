import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Container, Row, Col, Card } from 'react-bootstrap';
import axiosInstance from '../api';
import './Contracts.css'
import { Modal, Button } from 'react-bootstrap';

const ContractsPage = () => {
    const [offers, setOffers] = useState([]);
    const [hiredOffers, setHiredOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [activeTab, setActiveTab] = useState('offers');
    const [isWorkDataLoading, setIsWorkDataLoading] = useState(true);

    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null); // State to hold the selected submission
    const [workDataFetched, setWorkDataFetched] = useState(false); // New state variable

    const fetchOffers = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/client/contracts');
            const { offers } = response.data;

            const sentOffers = offers.filter(offer => offer.status === 'sent');
            const acceptedOffers = offers.filter(offer => offer.status === 'accepted' || offer.status === 'submitted' || offer.status === 'approved');

            setOffers(sentOffers);
            setHiredOffers(acceptedOffers);
            setIsLoading(false); // Update loading state
        } catch (error) {
            console.error('Error fetching offers:', error);
            setIsLoading(false); // Handle error and update loading state
        }
    };
    const fetchWorkSubmissions = async () => {
        setIsWorkDataLoading(true);

        try {
            const workDataPromises = hiredOffers?.map(async (offer) => {
                const response = await axiosInstance.get(`/api/v1/client/getSubmittedWork/${offer._id}`);
                return {
                    offerId: offer._id,
                    submissionData: response.data.submittedWork, // Access the submittedWork array directly
                };
            });

            const workData = await Promise.all(workDataPromises);
            console.log('workData', workData);

            const updatedHiredOffers = hiredOffers.map((offer) => {
                const workSubmission = workData.find((data) => data.offerId === offer._id);
                return {
                    ...offer,
                    submission: workSubmission.submissionData[0] || null, // Access the first item in the submittedWork array
                };
            });

            setHiredOffers(updatedHiredOffers);
            
            setIsWorkDataLoading(false);
        } catch (error) {
            console.error('Error fetching work submissions:', error);
            setIsWorkDataLoading(false);
        }
    };

    const handleApproveWork = () => {
        // Implement the logic to handle approving work here
    };

    const handleSendMessage = () => {
        // Implement the logic to handle approving work here
    };
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchOffers();
        fetchWorkSubmissions();
    }, []); // This effect runs only after the initial render
    
    useEffect(() => {
        if (hiredOffers.length > 0 && !workDataFetched) {
            fetchWorkSubmissions();
            setWorkDataFetched(true); // Set the flag to indicate work data has been fetched
        }
    }, [hiredOffers, workDataFetched]);

    const handleReviewSubmission = (submission) => {
        setShowSubmissionModal(true);
        setSelectedSubmission(submission);
    };


    function formatDateTime(dateTime) {
        if (!dateTime) return '';

        const date = new Date(dateTime);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleString('en-US', options);
    }

    return (
        <Container className="contracts-page">
            <h2 className="contracts-heading">
                {activeTab === 'offers' ? 'Offers' : 'Hired'}
            </h2>
            <Tabs
                defaultActiveKey="offers"
                id="contracts-tabs"
                className="mb-3 offersTabs"
                activeKey={activeTab}
                onSelect={(key) => setActiveTab(key)}
            >
                <Tab eventKey="offers" title="Offers">
                    {isLoading ? (
                        <p>Loading...</p> // Display loading state
                    ) : offers.length === 0 ? (
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', color: '#888' }}>
                            All of your offers will show up here.
                        </p>
                    ) : (
                        <Row>
                            {offers.map(offer => (
                                <Col key={offer._id} md={4} className="mb-4">

                                    <Card className="offer-card">
                                        <Card.Body>
                                            <Card.Title>{offer.project?.title || 'Untitled Offer'}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                Due Date: {formatDateTime(offer.dueDate)}
                                            </Card.Subtitle>
                                            <Card.Text>{offer.project?.description || 'No description available.'}</Card.Text>
                                            <p >
                                                Status: <span style={{
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
                                                }} > {offer.status} </span>
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Tab>
                <Tab eventKey="hired" title="Hired">
                    {isLoading || isWorkDataLoading ? (
                        <p>Loading...</p> // Display loading state
                    ) : hiredOffers.length === 0 ? (
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px', color: '#888' }}>
                            No talent on board yet. When they accept your offer, they’ll show up here.
                        </p>
                    ) : (
                        <Row>
                            {hiredOffers.map((offer) => (
                                <Col key={offer._id} md={4} className="mb-4">
                                    <Card className="offer-card">
                                        <Card.Body>
                                            <Card.Title>{offer.project?.title || 'Untitled Offer'}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                Due Date: {formatDateTime(offer.dueDate)}
                                            </Card.Subtitle>
                                            <Card.Text>{offer.project?.description || 'No description available.'}</Card.Text>
                                        </Card.Body>
                                        <p>
                                            Status: <span style={{
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
                                            }}> {offer.status} </span>
                                        </p>


                                        {offer.submission && (
                                            <Button variant="primary" className="r-submission-button" onClick={() => handleReviewSubmission(offer.submission)}>
                                                Review Submission
                                            </Button>
                                        )}
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                    )}

                    <Modal show={showSubmissionModal} onHide={() => setShowSubmissionModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title >Review Submission</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedSubmission && (
                                <>
                                    <h5 style={{color:'black'}}> {selectedSubmission.project.title}</h5>
                                    <p style={{color:'black'}}>Submitted by: {selectedSubmission.freelancer.name}</p>
                                    {/* Other submission details */}
                                    <p style={{color:'black'}}>Description: {selectedSubmission.description}</p>
                                    <a
                                        href={`${import.meta.env.VITE_REACT_APP_API_URL}/uploads/${selectedSubmission.attachedFile}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={selectedSubmission.attachedFile}
                                    >
                                        Download Submission
                                    </a>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowSubmissionModal(false)}>
                                Close
                            </Button>
                            <Button variant="success" onClick={handleApproveWork} className="approve-button">
                                Approve Work
                            </Button>
                            <Button variant="primary" onClick={handleSendMessage} className="r-message-button">
                                Message
                            </Button>
                        </Modal.Footer>
                    </Modal>


                </Tab>

            </Tabs>


        </Container>
    );
};

export default ContractsPage;
