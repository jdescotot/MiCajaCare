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
    console.log(`Enviando solicitud de prestamo para ${loanAmount}...`);

    const user = auth().currentUser;
    if (user) {
      const userId = user.uid;
      await firestore().collection('loanRequests').add({
        userId,
        loanAmount,
        loanReason,
        loanDuration,
        status: 'Pendiente',
        savingsBoxId,
        loanDetail,
      });
    }

    setLoanModalVisible(false);
  };
