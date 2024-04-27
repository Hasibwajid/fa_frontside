import React, { useState, useEffect } from "react";
import "./PostJob.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";

const PostJob = () => {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [budget, setBudget] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const history = useHistory()
    const location = useLocation();
    const { jobToEdit } = location.state || {};
    const { isLoggedIn, userRole } = useContext(UserContext); // Get isLoggedIn and userRole from the context


    useEffect(() => {
        // Check if the user is logged in as a client, otherwise redirect to the login page
        if (!isLoggedIn || userRole !== "client") {
          // Redirect to the login page or show an appropriate message
          history.push("/login"); // Replace "/login" with the actual login page URL
        }
      }, [isLoggedIn, userRole]);
    

    // Initialize the form fields with existing data if available
    useEffect(() => {
        window.scrollTo(0, 0);
        if (jobToEdit) {
            setTitle(jobToEdit.title);
            setTags(jobToEdit.tags);
            setBudget(jobToEdit.budget.toString());
            setDescription(jobToEdit.description);
        }
    }, [jobToEdit]);


    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTagInput = (e) => {
        setTagInput(e.target.value);
    };

    const handleTitleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };


    const handleAddTag = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const trimmedTagInput = tagInput.trim();
            if (trimmedTagInput !== "" && tags.length < 5 && !tags.includes(trimmedTagInput)) {
                setTags([...tags, trimmedTagInput]);
                setTagInput("");
            }
        }
    };

    const handleRemoveTag = (tag) => {
        const updatedTags = tags.filter((t) => t !== tag);
        setTags(updatedTags);
    };

    const handleBudgetChange = (e) => {
        setBudget(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Perform form validation
        if (!title || tags.length === 0 || !budget || !description) {
            toast.error("Please fill in all fields.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }

        // Retrieve the client ID from local storage
        const clientId = localStorage.getItem('clientId');

        // Check if the client ID is available
        if (!clientId) {
            toast.error("Client ID not found. Please log in as a client.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            return;
        }
        // API request format
        const apiData = {
            client: clientId, // Replace with your client ID
            title,
            tags,
            budget: parseInt(budget), // Convert to a number if needed
            description,
        };

        try {

            setLoading(true);
            if (jobToEdit) {
                // If jobToEdit exists, it means we are updating an existing job
                const updateUrl = `/api/v1/client/updateProject/${jobToEdit._id}`;
                const response = await axiosInstance.put(updateUrl, apiData);
                console.log("Project updated successfully:", response.data);
                toast.success("Project updated successfully!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            } else {
                const response = await axiosInstance.post(
                    `/api/v1/client/createProject`,
                    apiData);
                console.log("Project posted successfully:", response.data);
                toast.success("Project posted successfully!", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            // Clear form fields after successful submission (optional)
            handleReset()
            setShowModal(true);
        } catch (error) {
            toast.error("Error posting project. Please try again.", {
                position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error)
        } finally {
            setLoading(false);
        }

    };


    const handleReset = () => {
        setTitle("");
        setTags([]);
        setTagInput("");
        setBudget("");
        setDescription("");
    };

    return (
        <div className="post-job-container">
            <h1>{jobToEdit ? "Update Job" : "Post a Job"}</h1>
            <form className="post-job-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title / Job Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter job title"
                        onKeyDown={handleTitleKeyPress}
                    />
                </div>
                <div className={`form-group ${tags.length > 5 ? "error" : ""}`}>
                    <label htmlFor="tags">Tags (up to 5 tags):</label>
                    <div className="tags-input-container">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag">
                                {tag}
                                <span className="tag-remove" onClick={() => handleRemoveTag(tag)}>
                                    &#x2715;
                                </span>
                            </div>
                        ))}
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={handleTagInput}
                            onKeyDown={handleAddTag}
                            placeholder="Enter tags and press Enter"
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="budget">Budget:</label>
                    <input
                        type="number"
                        id="budget"
                        value={budget}
                        onChange={handleBudgetChange}
                        placeholder="Enter budget"
                        className="budget-input" // Add this class for styling
                    />

                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter job description"
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : jobToEdit ? "Update" : "Submit"}
                    </button>
                    <button type="button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Job posted successfully!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => history.push('/')}>
                        My Jobs
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default PostJob;
