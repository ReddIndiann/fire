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

const PurchaseProduct = () => {
  const [BreadType, setBreadType] = useState('');
  const [Size, setSize] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState({ status: 'idle', details: null });

  const processPayment = () => {
    // Simulate processing time
    return new Promise((resolve) => {
      setTimeout(() => {
        // Randomly determine if the payment is successful or not
        const isSuccess = Math.random() > 0.5; // 50% chance of success or failure
        console.log(`Payment process outcome: ${isSuccess ? 'Success' : 'Failure'}`);
        resolve(isSuccess);
      }, 1000); // Simulates a delay of 1 second
    });
  };

  const handlePurchase = async () => {
    let stockUpdated = false;
    let productRef = null;

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
      productRef = productDoc.ref;

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
        stockUpdated = true;
      });

      const paymentSuccessful = await processPayment();
      if (!paymentSuccessful) {
        throw new Error('Payment failed');
      }

      // Payment successful, update transaction status
      setTransactionStatus({
        status: 'completed',
        details: {
          BreadType,
          Size,
          purchaseQuantity,
          timestamp: new Date(),
          userId: auth?.currentUser?.uid
        }
      });

      console.log('Purchase successful');
    } catch (error) {
      console.error('Purchase or payment failed:', error.message);

      if (stockUpdated && productRef) {
        // Restore stock if payment failedd
        await runTransaction(db, async (transaction) => {
          const doc = await transaction.get(productRef);
          if (doc.exists()) {
            const restoredQuantity = doc.data().quantity + purchaseQuantity;
            transaction.update(productRef, { quantity: restoredQuantity });
          }
        });
      }

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
      <button onClick={handlePurchase}>Purchase</button>
    </div>
  );
};

export default PurchaseProduct;
