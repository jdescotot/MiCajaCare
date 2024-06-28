/* eslint-disable prettier/prettier */
import firestore from '@react-native-firebase/firestore';

/**
 * @param {string} amountPaid
 * @param {string} savingsBoxId
 */
export const addPaymentToTotalInvestment = async (amountPaid, savingsBoxId, userId) => {
  const parsedAmount = parseFloat(amountPaid);
  if (isNaN(parsedAmount)) {
    console.error("Invalid amount");
    return;
  }

  const savingsBoxRef = firestore.collection('savingsBoxes').doc(savingsBoxId);
  const userDetailsRef = firestore.collection('userDetails').doc(userId); // Assuming 'userDetails' is the collection

  try {
    await firestore.runTransaction(async (transaction) => {
      const savingsBoxDoc = await transaction.get(savingsBoxRef);
      if (!savingsBoxDoc.exists) {
        throw new Error("SavingsBox document does not exist!");
      }

      const userDetailsDoc = await transaction.get(userDetailsRef);
      if (!userDetailsDoc.exists) {
        throw new Error("UserDetails document does not exist!");
      }

      const newTotal = (savingsBoxDoc.data().totalInvestmentToAdd || 0) + parsedAmount;
      transaction.update(savingsBoxRef, { totalInvestmentToAdd: newTotal });

      const newAmountOwed = (userDetailsDoc.data().amountOwed || 0) - parsedAmount;
      transaction.update(userDetailsRef, { amountOwed: newAmountOwed });

      console.log(`New totalInvestmentToAdd: ${newTotal}, New amountOwed: ${newAmountOwed}`);
    });
  } catch (error) {
    console.error("Transaction failed: ", error);
  }
};