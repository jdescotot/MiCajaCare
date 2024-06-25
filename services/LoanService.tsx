/* eslint-disable prettier/prettier */
// loanService.ts

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const requestLoan = async (
  loanAmount: number,
  setLoanModalVisible: (visible: boolean) => void,
  savingsBoxId: string,
  loanReason: string,
  loanDuration: number,
  loanDetail: string,
) => {
  console.log(`Enviando solicitud de préstamo para ${loanAmount}...`);

  const user = auth().currentUser;
  if (user) {
    const userId = user.uid;

    const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
    if (userDetailsDoc.exists) {
      const userName = userDetailsDoc.data().name;
      await firestore().collection('loanRequests').add({
        userId,
        name: userName,
        loanAmount,
        loanReason,
        loanDuration,
        status: 'Pendiente',
        savingsBoxId,
        loanDetail,
      });
      console.log('Solicitud de préstamo enviada con éxito.');
    } else {
      console.log('Detalles del usuario no encontrados.');
    }
  }

  setLoanModalVisible(false);
};
