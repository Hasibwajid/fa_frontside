  import React, { useState, useEffect, useRef } from 'react';
  import { Card, Button } from 'react-bootstrap';
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import { useParams } from 'react-router-dom';
  import { FaPencilAlt } from 'react-icons/fa';
  import axiosInstance from '../api';
  import './HirePage.css';
  import DropIn from "braintree-web-drop-in-react";
  import { toast } from 'react-toastify'
  import { useHistory } from 'react-router-dom';

  const HirePage = () => {

    const { proposalId } = useParams();
    const [proposalData, setProposalData] = useState(null);
    const [freelancerProfile, setFreelancerProfile] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [depositConfirmed, setDepositConfirmed] = useState(false);

    const datePickerRef = useRef(null);

    const [showBillingDetails, setShowBillingDetails] = useState(false);

    const [instance, setInstance] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [clientToken, setClientToken] = useState(null);

    const history = useHistory()
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };

    const handleCheckboxChange = () => {
      setDepositConfirmed(!depositConfirmed);
    };



    const fetchProposalData = async () => {
      try {
        const apiUrl = `/api/v1/client/getProposalDetails/${proposalId}`;
        const response = await axiosInstance.get(apiUrl);
        const fetchedProposalData = response.data;
        setProposalData(fetchedProposalData.proposal);
        setFreelancerProfile(fetchedProposalData.freelancerProfile);
      } catch (error) {
        console.error('Error fetching proposal details:', error);
      }
    };

    useEffect(() => {
      window.scrollTo(0, 0);
      fetchProposalData();
    }, [proposalId]);

    
    const handleEditDateClick = () => {
      // Programmatically open the DatePicker
      if (datePickerRef.current) {
        datePickerRef.current.setFocus();
      }
    };

    const handleContinueClick = () => {
      // Add validation here to ensure all necessary fields are filled
      if (!selectedDate) {
        alert('Please select a due date.');
        return;
      }

      if (!depositConfirmed) {
        alert('Please confirm the deposit for the project.');
        return;
      }

      setShowBillingDetails(true);
    }

    const fetchClientToken = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/client/braintree/token');
        const { clientToken } = response.data;
        setClientToken(clientToken)

      } catch (error) {
        console.error('Error fetching Braintree client token:', error);
      }
    };

    useEffect(() => {
      fetchClientToken();
    }, []);


    const handlePaymentSubmit = async () => {
      if (!instance) {
        console.error('DropIn instance not available.');
        return;
      }

      setPaymentLoading(true);

      try {
        const { nonce } = await instance.requestPaymentMethod();
        console.log("Nonce is----- :", nonce)
        const response = await axiosInstance.post(`/api/v1/client/makePayment/${proposalId}`, {
          nonce,
          dueDate: selectedDate,
          amount: proposalData?.bidAmount
        });

        history.push('/Contracts')
      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Error processing payment: ' + error.response.data.message);
      } finally {
        setPaymentLoading(false);
      }
    };


    return (
      <div className="hire-page-container">
        <h2 className="hire-heading">Send Offer</h2>

        <Card className="freelancer-card">
          <Card.Body className="freelancer-details">
            <img
              className="freelancer-avatar"
              src={proposalData?.freelancerProfile?.profilePhoto}
              alt={proposalData?.freelancer?.name}
            />
            <div className="freelancer-info">
              <h4>{proposalData?.freelancer?.name}</h4>
              <p>{freelancerProfile?.speciality || 'Not defined'}</p>
              <p>{proposalData?.freelancer?.city}</p>
            </div>
          </Card.Body>
        </Card>

        <Card className="contract-card">
          <Card.Body>
            <h3 className="section-heading">Contract Terms</h3>
            <div className="price">
              <span>Price: {proposalData?.bidAmount} PKR</span>
            </div>
          </Card.Body>
        </Card>

        <Card className="deposit-card">
          <Card.Body>
            <h3 className="section-heading">Deposit Fund into Escrow</h3>
            <p className="small-text">
              Deposit a specified amount of money into escrow to ensure the security of the project.
              Escrow means...
            </p>
            <div className="checkbox">
              <input
                type="checkbox"
                id="depositCheckbox"
                checked={depositConfirmed}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="depositCheckbox">
                Confirm Deposit <span>{proposalData?.bidAmount} PKR</span> for the project
              </label>
            </div>
          </Card.Body>
        </Card>

        <Card className="due-date-card">
          <Card.Body>
            <h3 className="section-heading">
              Due Date{' '}
              <label htmlFor="dueDate" className="edit-icon" onClick={handleEditDateClick}>
                <FaPencilAlt />
              </label>
            </h3>
            <DatePicker
              id="dueDate"
              selected={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
              placeholderText="Select a due date"
              showTimeSelect
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              ref={datePickerRef}
              popperModifiers={{
                preventOverflow: {
                  enabled: true,
                },
              }}
            />
          </Card.Body>
        </Card>

        <Card className="description-card">
          <Card.Body>
            <h3 className="section-heading">Work Description</h3>
            <p>{proposalData?.project?.description}</p>
          </Card.Body>
        </Card>

        <div className="buttons">
          <Button variant="secondary" className="cancel-button">
            Cancel
          </Button>
          <Button variant="primary" className="continue-button" onClick={handleContinueClick}>
            Continue
          </Button>
        </div>


        {!clientToken || !showBillingDetails ? ('') : (
          <>
            <DropIn
              options={{
                authorization: clientToken,
                paypal: { flow: 'vault' }
              }}
              onInstance={(instance) => {
                setInstance(instance);
                console.log('DropIn initialized', instance);
              }}
            />
            <Button
              variant="primary"
              className="submit-button"
              onClick={handlePaymentSubmit}
              disabled={paymentLoading}
            >
              {paymentLoading ? 'Processing...' : 'Submit Payment'}
            </Button>
          </>
        )
        }
      </div>
    );
  };

  export default HirePage;
