/* eslint-disable prettier/prettier */
import firestore from '@react-native-firebase/firestore';

/**
 * @param {string} amountPaid
 * @param {string} savingsBoxId
 */
export const addPaymentToTotalInvestment = async (amountPaid, savingsBoxId) => {
  const parsedAmount = parseFloat(amountPaid);
  if (isNaN(parsedAmount)) {
    console.error("Invalid amount");
    return;
  }

  // Use dynamic savingsBoxId instead of hardcoded 'yourDocumentId'
  const savingsBoxRef = firestore.collection('savingsBoxes').doc(savingsBoxId);

  try {
    await firestore.runTransaction(async (transaction) => {
      const savingsBoxDoc = await transaction.get(savingsBoxRef);
      if (!savingsBoxDoc.exists) {
        throw new Error("Document does not exist!");
      }

      const newTotal = (savingsBoxDoc.data().totalInvestmentToAdd || 0) + parsedAmount;
      transaction.update(savingsBoxRef, { totalInvestmentToAdd: newTotal });
      console.log(`New totalInvestmentToAdd: ${newTotal}`);
    });
  } catch (error) {
    console.error("Transaction failed: ", error);
  }
};