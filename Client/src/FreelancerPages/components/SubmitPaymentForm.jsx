import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { FaPaperclip } from "react-icons/fa";
import axiosInstance from "../../api";
const SubmitPaymentForm = ({ offerId, projectTitle, clientName, onHide }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    try {
      // Example of submitting the form data to the server
      const data = {
        message: message,
        file: file
      };
      console.log(data.file)
      await axiosInstance.post(`/api/v1/freelancer/submitPayment/${offerId}`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      onHide();
      alert("Submission successful!");
    } catch (error) {
      console.error("Error submitting payment:", error);
      // Show an error message here
    }
  };

  return (
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Submit Payment for Approval</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>{projectTitle}</h5>
        <p>
          Amount: {/* Display the amount here */}
        </p>
        <p>Your payment will be released once {clientName} approves your work.</p>
        <Form>
          <Form.Group controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Let them know about the work you're submitting"
              required
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Include File</Form.Label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                accept=".pdf,.doc,.docx,.txt"
                name="file" 
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label className="custom-file-label" htmlFor="customFile">
                {file ? file.name : "Choose file"}
              </label>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubmitPaymentForm;
