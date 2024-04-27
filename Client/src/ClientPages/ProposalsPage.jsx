import React, { useState, useEffect } from 'react';
import { Card, Button, Tab, Nav, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ProposalsPage.css';
import axiosInstance from '../api';

const ProposalsPage = (props) => {
  const [proposalsData, setProposalsData] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [activeKey, setActiveKey] = useState('pending'); // Default active tab key
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const fetchProposals = () => {
    const jobId = props.match.params.jobId;
    const apiUrl = `/api/v1/client/getProjectProposals/${jobId}`;

    setIsLoading(true)
    axiosInstance
      .get(apiUrl)
      .then((response) => {
        setProposalsData(response.data.proposals);
      })
      .catch((error) => {
        console.error('Error fetching proposals:', error);
      }).finally(()=>{
        setIsLoading(false)
      });
  };

  const fetchJobTitle = () => {
    const urlParams = new URLSearchParams(props.location.search);
    const title = urlParams.get('title');
    setJobTitle(title);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProposals();
    fetchJobTitle();
  }, [props.match.params.jobId]);

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'declined':
        return 'status-declined';
      case 'accepted':
        return 'status-accepted';
      case 'interviewing':
        return 'status-interviewing';
      default:
        return '';
    }
  };

  const renderProposalsByStatus = (status) => {
    const filteredProposals = proposalsData.filter((proposal) => proposal.status === status);

    if (filteredProposals.length === 0) {
      return <div>No proposals found for this status.</div>;
    }

    return(
      <div>
      <h3 className="active-status">{status.toUpperCase()}</h3> 
     {filteredProposals.map((proposal, index) => (
      <Card key={proposal._id} className="proposal-card">
      <Card.Body className='client-proposal-card-body'>
          <div className="job-title">{jobTitle}</div>
          <div className="freelancer-name">{proposal.freelancer.name}</div>
          <div className="freelancer-city">{proposal.freelancer.city}</div>
          <div className="bid-amount">Budget/Bid: {proposal.bidAmount}</div>
          <div className="freelancer-skills">
            {proposal.freelancerProfile &&
              proposal.freelancerProfile.skills.map((skill) => (
                <div key={skill} className="skill-tag">
                  {skill}
                </div>
              ))}
          </div>
          <div className="proposal-buttons">
            <Button variant="success" className="btn-hire">
              Hire
            </Button>
          </div>
          <div className="proposal-details-link">
            <Link to={`/proposal/${proposal._id}`} className="detail-link">
              View Proposal Details
            </Link>
          </div>
        </Card.Body>
      
          <div className="proposal-status">
            Status: <span className={`status-badge ${getStatusColorClass(proposal.status)}`}>{proposal.status}</span>
          </div>
      
      </Card>
       ))}
       </div>
    );
  };

  return (
    <div className="proposals-container">
      <h2 style ={{textAlign:'left' , marginLeft:'20px'}}>Proposals</h2>
      <Tab.Container id="proposals-tabs" activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column proposals-tabs">
              <Nav.Item>
                <Nav.Link eventKey="pending">Pending ({proposalsData.filter((proposal) => proposal.status === 'pending').length})</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="declined">Declined ({proposalsData.filter((proposal) => proposal.status === 'declined').length})</Nav.Link>
              </Nav.Item>
              {/* Add more tabs as needed */}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content className="right-side">
              <Tab.Pane eventKey="pending">
                {isLoading ? (
                  <p>Loading...</p> // Display loading state
                ) : proposalsData.filter((proposal) => proposal.status === 'pending').length === 0 ? (
                  <p>No pending proposals found.</p>
                ) : (
                  renderProposalsByStatus('pending')
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="declined">
                {isLoading ? (
                  <p>Loading...</p> // Display loading state
                ) : proposalsData.filter((proposal) => proposal.status === 'declined').length === 0 ? (
                  <p>No declined proposals found.</p>
                ) : (
                  renderProposalsByStatus('declined')
                )}
              </Tab.Pane>
              {/* Add more tab panes as needed */}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default ProposalsPage;
