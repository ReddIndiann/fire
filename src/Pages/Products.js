// import React, { useState, useEffect } from 'react';
// import { db,auth } from '../config/firebase';
// import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';

// const PurchaseProduct = () => {
//   const [BreadType, setBreadType] = useState('');
//   const [Size, setSize] = useState('');
//   const [purchaseQuantity, setPurchaseQuantity] = useState(0);
//   const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });

//   useEffect(() => {
//     // If a transaction has been completed, save it to the 'transactions' collection
//     if (transactionStatus.status === 'completed' && transactionStatus.details) {
//       const saveTransaction = async () => {
//         try {
//           await addDoc(collection(db, 'transactions'), transactionStatus.details);
//           console.log('Transaction details saved successfully');
//         } catch (error) {
//           console.error('Failed to save transaction details:', error);
//         }
//       };

//       saveTransaction();
//     }
//   }, [transactionStatus]); // Depend on transactionStatus

//   const handlePurchase = async () => {
//     const q = query(
//       collection(db, 'Product'),
//       where('Type', '==', BreadType),
//       where('Size', '==', Size)
//     );

//     try {
//       const querySnapshot = await getDocs(q);
//       if (querySnapshot.empty) {
//         throw new Error('No matching product found!');
//       }

//       const productDoc = querySnapshot.docs[0];
//       const productRef = productDoc.ref;

//       await runTransaction(db, async (transaction) => {
//         const freshDoc = await transaction.get(productRef);
//         if (!freshDoc.exists()) {
//           throw new Error('Product does not exist!');
//         }

//         const newQuantity = freshDoc.data().quantity - purchaseQuantity;
//         if (newQuantity < 0) {
//           throw new Error('Insufficient stock!');
//         }

//         transaction.update(productRef, { quantity: newQuantity });

//         // Prepare transaction details for saving
//         setTransactionStatus({
//           status: 'completed',
//           details: {
//             BreadType,
//             Size,
//             purchaseQuantity,
//             timestamp: new Date(),
//             userId:auth?.currentUser?.uid
//           }
//         });
//       });

//       console.log('Purchase successful');
//     } catch (error) {
//       console.error('Purchase failed:', error.message);
//       // Update the transaction status to 'failed'
//       setTransactionStatus({ status: 'failed', details: null });
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={BreadType}
//         onChange={(e) => setBreadType(e.target.value)}
//         placeholder="Bread Type"
//       />
//       <input
//         type="text"
//         value={Size}
//         onChange={(e) => setSize(e.target.value)}
//         placeholder="Size"
//       />
//       <input
//         type="number"
//         value={purchaseQuantity}
//         onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
//         placeholder="Quantity"
//       />
//       <button onClick={handlePurchase}>Purchase</button>
//     </div>
//   );
// };

// export default PurchaseProduct;


import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, runTransaction, addDoc } from 'firebase/firestore';
import PaymentForm from '../PaymentForm';
import axios from 'axios';
const PurchaseProduct = () => {
  const [BreadType, setBreadType] = useState('');
  const [Size, setSize] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });
  const [isModalOpen, setIsModalOpen] = useState(false);


  function SimpleModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          minWidth: '300px',
        }}>
          <button onClick={onClose} style={{ float: 'right', fontSize: '1.25rem' }}>&times;</button>
          {children}
        </div>
      </div>
    );
  }
  
  const processPayment = () => {
    // Simulate processing time
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly determine if the payment is successful or not
        const isSuccess = Math.random() > 0.5; // 50% chance of success or failure
        console.log(`Payment process outcome: ${isSuccess ? 'Success' : 'Failure'}`);
        resolve(isSuccess);
      }, 9000); // Simulates a delay of 9 second
    });
  };const handlePaymentSubmit = async (formData) => {
    console.log("Payment Data:", formData);
    
    const paymentData = {
      amount: formData.amount,
      paymentoption: formData.paymentOption,
      walletnumber: formData.walletNumber,
      description: 'Purchase of ' + BreadType + ' (' + Size + ')'
    };
  
    try {
      const response = await axios.post('http://localhost:3001/receiveMoney', paymentData);
      console.log('Payment Response:', response.data);
      
      if (response.data.status === 'OK') {
        console.log('Payment successful:', response.data.reason);
        setIsModalOpen(false); // Close the modal on success
        await handlePurchase(); // Deduct stock and finalize the transaction after successful payment
      } else {
        console.error('Payment failed:', response.data.reason);
        alert('Payment failed: ' + (response.data.reason || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      alert('Payment processing error. Please try again.');
    }
  };
  
  

  const handlePurchase = async () => {
    try {
      const q = query(
        collection(db, 'Product'),
        where('Type', '==', BreadType),
        where('Size', '==', Size)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('No matching product found!');
      }
      const productDoc = querySnapshot.docs[0];
      const productRef = productDoc.ref;
  
      await runTransaction(db, async (transaction) => {
        const freshDoc = await transaction.get(productRef);
        if (!freshDoc.exists()) {
          throw new Error('Product does not exist!');
        }
  
        const newQuantity = freshDoc.data().quantity - purchaseQuantity;
        if (newQuantity < 0) {
          throw new Error('Insufficient stock!');
        }
  
        transaction.update(productRef, { quantity: newQuantity });
      });
  
      setTransactionStatus({
        status: 'completed',
        details: {
          BreadType,
          Size,
          purchaseQuantity,
          timestamp: new Date(),
          userId: auth?.currentUser?.uid,
          // Add other relevant details here
        }
      });
  
      console.log('Purchase and stock update successful');
    } catch (error) {
      console.error('Stock deduction failed:', error.message);
      setTransactionStatus({ status: 'failed', details: null });
    }
  };
  

  useEffect(() => {
    if (transactionStatus.status === 'completed' && transactionStatus.details) {
      const saveTransaction = async () => {
        try {
          await addDoc(collection(db, 'transactions'), transactionStatus.details);
          console.log('Transaction details saved successfully');
        } catch (error) {
          console.error('Failed to save transaction details:', error);
        }
      };
      saveTransaction();
    }
  }, [transactionStatus]);

  return (
    <div>
      <input
        type="text"
        value={BreadType}
        onChange={(e) => setBreadType(e.target.value)}
        placeholder="Bread Type"
      />
      <input
        type="text"
        value={Size}
        onChange={(e) => setSize(e.target.value)}
        placeholder="Size"
      />
      <input
        type="number"
        value={purchaseQuantity}
        onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
        placeholder="Quantity"
      />
      <button onClick={() => setIsModalOpen(true)}>Purchase</button>

      <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PaymentForm onSubmit={handlePaymentSubmit} />
      </SimpleModal>
    </div>
  );
};

export default PurchaseProduct;
