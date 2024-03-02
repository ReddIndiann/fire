import React, { useState } from 'react';

function PaymentForm({ onSubmit }) {
    const [amount, setAmount] = useState('');
    const [walletNumber, setWalletNumber] = useState('');
    const [paymentOption, setPaymentOption] = useState('MTN'); // Default option

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ amount, walletNumber, paymentOption });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            <input type="text" value={walletNumber} onChange={(e) => setWalletNumber(e.target.value)} placeholder="Wallet Number" />
            <select value={paymentOption} onChange={(e) => setPaymentOption(e.target.value)}>
                <option value="MTN">MTN</option>
                <option value="Other">Other</option>
            </select>
            <button type="submit">Pay</button>
        </form>
    );
}

export default PaymentForm;
