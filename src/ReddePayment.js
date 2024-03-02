import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import axios from 'axios';

export default function Reddepayment() {
    const [transactionStatus, setTransactionStatus] = useState(null);

    const handlePaymentSubmit = async (paymentData) => {
        console.log("payment data",paymentData)
        try {
            const response = await axios.post('http://localhost:3001/payments', paymentData);
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
