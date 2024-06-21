/* eslint-disable prettier/prettier */
// petitionService.ts

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const sendPetition = async (
    numShares: number,
    setModalVisible: (visible: boolean) => void,
    savingsBoxId: string
  ) => {
    console.log(`Enviando peticion para solicitar ${numShares} Acciones...`);

    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      await firestore().collection('loanRequests').add({
        userId,
        numShares,
        status: 'Pendiente',
        savingsBoxId,
      });
    }

    setModalVisible(false);
  };

export const requestLoan = async (loanAmount: number, setLoanModalVisible: (visible: boolean) => void) => {
    console.log(`Enviando solicitud de prestamo para ${loanAmount}...`);

    // Save the loan request in the database
    const user = auth().currentUser;
    if (user) {
        const userId = user.uid;
        await firestore().collection('loanRequests').add({
            userId,
            loanAmount,
            status: 'pending',
        });
    }

    setLoanModalVisible(false);
};
