import React, { useState, useEffect } from 'react';
import axiosInstance from '../api';
import { validate as validateCard } from 'card-validator';
import braintree from 'braintree-web';

const CustomPaymentForm = ({ proposalId }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCVV] = useState('');
    const [loading, setLoading] = useState(false);
    const [braintreeInstance, setBraintreeInstance] = useState(null);

    // Fetch the Braintree client token from your server
    const fetchClientToken = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/client/braintree/token');
            const { clientToken } = response.data; // Extract the token from the response

            console.log('Fetched client token:', clientToken);

            // Initialize the Braintree client instance
            const instance = await braintree.client.create({
                authorization: clientToken, // Use the token string directly
            });

            console.log('Initialized Braintree instance:', instance);

            setBraintreeInstance(instance);
        } catch (error) {
            console.error('Error fetching Braintree client token:', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchClientToken();
    }, []);
    const validateAndSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber)) {
            alert('Invalid card number');
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
            alert('Invalid expiration date');
            return;
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            alert('Invalid CVV');
            return;
        }

        console.log('Submitting payment form...');
        console.log('Card Number:', cardNumber);
        console.log('Expiration Date:', expirationDate);
        console.log('CVV:', cvv);

        setLoading(true);

        try {
            const { nonce } = await braintreeInstance.request({
                endpoint: 'payment_methods/credit_cards',
                method: 'post',
                data: {
                    creditCard: {
                        number: cardNumber.replace(/\s/g, ''), // Remove spaces
                        expirationDate: expirationDate.replace(/\D/g, ''), // Remove non-digit characters
                        cvv: cvv.replace(/\D/g, ''), // Remove non-digit characters
                    },
                },
            });

            console.log('Generated nonce:', nonce);

            const response = await axiosInstance.post(`/api/v1/client/makePayment/${proposalId}`, {
                nonce,
            });

            console.log('Payment Response:', response.data);

            if (response.data.success) {
                alert('Payment held in escrow');
                console.log('Payment successful. Payment held in escrow.');
            } else {
                alert('Payment failed');
                console.log('Payment failed.');
            }
        } catch (error) {
            alert('Error processing payment. Please try again.');
            console.error('Payment Error:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={validateAndSubmit}>
            <label htmlFor="cardNumber">Card Number</label>
            <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => {
                    const formattedCardNumber = e.target.value
                        .replace(/\D/g, '') // Remove non-digit characters
                        .replace(/(\d{4})(?=\d)/g, '$1 '); // Insert space after every 4 digits
                    setCardNumber(formattedCardNumber);
                }}
                placeholder="1234 5678 9012 3456"
                maxLength="19" // Maximum length including spaces
                autoComplete="off"
            />

            <label htmlFor="expirationDate">Expiration Date (MM/YY)</label>
            <input
                type="text"
                id="expirationDate"
                value={expirationDate}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 5) {
                        const formattedExpirationDate = inputValue
                            .replace(/\D/g, '') // Remove non-digit characters
                            .replace(/(\d{2})(\d{0,2})/, '$1/$2'); // Format as MM/YY
                        setExpirationDate(formattedExpirationDate);
                    }
                }}
                placeholder="MM/YY"
                maxLength="5" // Maximum length (MM/YY format)
                autoComplete="off"
            />


            <label htmlFor="cvv">CVV</label>
            <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => {
                    const formattedCVV = e.target.value
                        .replace(/\D/g, '') // Remove non-digit characters
                        .slice(0, 3); // Limit to 3 digits
                    setCVV(formattedCVV);
                }}
                placeholder="123"
                maxLength="3" // Maximum length (3 digits)
                autoComplete="off"
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Submit Payment'}
            </button>
        </form>
    );
};

export default CustomPaymentForm;
