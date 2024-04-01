import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import axios from 'axios';

export default function Reddepayment() {
    const [transactionStatus, setTransactionStatus] = useState(null);
    const handlePaymentSubmit = async (formData) => {
        const paymentData = {
            amount: formData.amount, // assuming formData contains amount
            paymentoption: formData.paymentoption, // adjust according to your form data structure
            walletnumber: formData.walletNumber, // adjust according to your form data structure
            description: formData.description // adjust according to your form data structure
        };
    
        console.log("Sending payment data:", paymentData);
        
        try {
            const response = await axios.post('http://localhost:3001/receiveMoney', paymentData);
            setTransactionStatus(response.data);
        } catch (error) {
            console.error('Payment error:', error);
            setTransactionStatus({ status: 'FAILED', reason: error.message });
        }
    };
    
    return (
        <div>
            <PaymentForm onSubmit={handlePaymentSubmit} />
            {transactionStatus && <div>Transaction Status: {JSON.stringify(transactionStatus)}</div>}
        </div>
    );
}
