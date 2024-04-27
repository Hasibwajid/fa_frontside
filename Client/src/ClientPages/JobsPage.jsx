import React, { useState, useEffect } from 'react';
import { Card, Button, Dropdown, Spinner } from 'react-bootstrap'; // Assuming you have the Spinner component from react-bootstrap
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams, useHistory } from "react-router-dom";
import './JobsPage.css'
import { confirmAlert } from "react-confirm-alert";
import { toast } from 'react-toastify'; // Import toast from react-toastify
import "react-confirm-alert/src/react-confirm-alert.css";
import axiosInstance from '../api';

const JobsPage = () => {
  const [showOptions, setShowOptions] = useState({});
  const [jobsData, setJobsData] = useState([]);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('clientName')
  const handleOptionsClick = (jobId) => {
    setShowOptions((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const handleEditJob = (jobId) => {
    const jobToEdit = jobsData.find((job) => job._id === jobId);
    history.push({
      pathname: "/postJob",
      state: { jobToEdit },
    });
  };


  const handleRemoveConfirmation = (jobId) => {
    setLoading(true);
    // Perform the delete request to remove the job
    const apiUrl = `/api/v1/client/deleteProject/${jobId}`; 

    axiosInstance
      .delete(apiUrl)
      .then((response) => {
        // Fetch updated jobs data again
        fetchProjects();
        toast.success("Job removed successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        
      })
      .catch((error) => {
        toast.error("Error removing job. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the API call is completed (whether success or error)
      });
  };

  const handleRemoveJob = (jobId) => {

    // Show the confirmation dialog and call handleRemoveConfirmation when the user confirms
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to remove this job?",
      buttons: [
        {
          label: "Yes",
          onClick: () => { handleRemoveConfirmation(jobId) }
        },
        {
          label: "No",
          onClick: () => { }, // Do nothing if the user clicks "No"
        },
      ],
    });
  };

 // Inside the fetchProjects function
const fetchProjects = () => {
  setLoading(true);
  const apiUrl = '/api/v1/client/projects';

  axiosInstance
    .get(apiUrl)
    .then((response) => {
      // Assuming the API response contains an array of jobs with their details
      const jobsWithProposals = response.data.projects.map((job) => {
        // Fetch proposals for each job using another API call
        const proposalsApiUrl = `/api/v1/client/getProjectProposals/${job._id}`;
        return axiosInstance.get(proposalsApiUrl);
      });

      // Wait for all the API calls to fetch proposals to complete
      Promise.all(jobsWithProposals)
        .then((results) => {
          // Update the jobsData state with the proposals count for each job
          const updatedJobsData = response.data.projects.map((job, index) => {
            return {
              ...job,
              proposalsCount: results[index].data.proposals.length,
            };
          });
          setJobsData(updatedJobsData);
        })
        .catch((error) => {
          console.error('Error fetching job proposals:', error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false after all API calls are completed (success or error)
        });

    })
    .catch((error) => {
      toast.error('Error fetching jobs')
      console.error('Error fetching jobs:', error);
      setLoading(false); // Set loading to false in case of an error
    });
};


  const handlePostJobClick = () => {
    history.push("/postJob");
  };


  

  const renderCards = () => {
    if (loading) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.8)' }}
        >
          <div style={{ textAlign: 'center' }}>
            <Spinner animation="border" variant="primary" />
            <p>Fetching your jobs...</p>
          </div>
        </div>
      );
    }

    if (!Array.isArray(jobsData)) {
      return <div>Loading...</div>;
    }

    if (jobsData.length === 0) {
      return (
        <Card className="min-width-card m-2 card-custom" style={{ position: 'static' }}>
          <Card.Body >
            <Card.Title className="card-title">Add your first job</Card.Title>
            <div className="d-flex justify-content-center">
              <Button variant="primary" onClick={() => history.push('/PostJob')}>
                <span style={{ marginRight: 5 }}>+</span>
                Post Job
              </Button>
            </div>
          </Card.Body>
        </Card>
      );
    }

    return jobsData.map((job) => (
      <Card key={job._id} className="min-width-card m-2 card-custom" style={{ position: 'static' }}>
        <Card.Body>
          <Card.Title className="card-title">{job.title}</Card.Title>
          <Card.Text className="text-sm" >
            Bids: {job.proposalsCount}
          </Card.Text>
          <div className="d-flex justify-content-end " style={{ marginBottom: 30 }}>
            <Dropdown align="end" show={showOptions[job._id]} onToggle={() => handleOptionsClick(job._id)}>
              <Dropdown.Toggle variant="link" id={`dropdown-basic-${job._id}`} className="options-btn-job-card">
                <span className="ellipsis-horizontal" ></span>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ top: 0 }}>
                <Dropdown.Item onClick={() => handleEditJob(job._id)}>Edit Job</Dropdown.Item>
                <Dropdown.Item onClick={() => handleRemoveJob(job._id)}>Remove Job</Dropdown.Item>
                <Dropdown.Item as={Link} to={`/proposals/${job._id}?title=${encodeURIComponent(job.title)}`}>View</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
      </Card>
    ));
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjects();
  }, []);

  return (
    <div>
      <header className="header-client-job">
        <div className="greeting">Hello,{username ? username : 'Client'}!</div>
        <Button variant="primary" className="add-job-btn" onClick={handlePostJobClick}>
          <span style={{ marginRight: 5 }}>+</span>
          Post a New Job
        </Button>
      </header>

      <h2 className="ml-3">Posted Jobs</h2>


      <div className="d-flex flex-wrap p-3 border rounded job-list-container" style={{ overflow: 'hidden' }}>{renderCards()}</div>
    </div>
  );
};

export default JobsPage;
