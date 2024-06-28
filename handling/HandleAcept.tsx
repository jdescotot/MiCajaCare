/* eslint-disable prettier/prettier */

import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const handleAccept = async (id, requestType) => {
    try {
        console.log('Aceptando solicitud', id, requestType);
        switch (requestType) {
            case 'Solicitud de préstamo':
                const requestDocLoan = await firestore().collection('loanRequests').doc(id).get();
                const requestDataLoan = requestDocLoan.data();
                if (!requestDataLoan){
                    Alert.alert('No se encontro datos de la solicitud');
                    throw new Error('No se encontro datos de la');
                }
                await handleLoanRequest(requestDataLoan, id);
                break;

            case 'Compra de Acciones':
                const requestDocStock = await firestore().collection('stockRequests').doc(id).get();
                const requestDataStock = requestDocStock.data();
                if (!requestDataStock){
                    Alert.alert('No se encontro datos de la solicitud');
                    throw new Error('No se encontro datos de la');
                }
                await handleStockRequest(requestDataStock, id);
                break;

            case 'Peticion de Acceso a caja de ahorro':
                const requestDocCaja = await firestore().collection('savingsBoxJoinRequests').doc(id).get();
                const requestDataCaja = requestDocCaja.data();
                if (!requestDataCaja){
                    Alert.alert('No se encontro datos de la solicitud');
                    throw new Error('No se encontro datos de la');
                }
                await handleJoiningSavingsBoxRequest(requestDataCaja);
                break;

            default:
                console.error('Unknown request type');
        }

        Alert.alert("Solicitud aceptada con éxito");

    } catch (error) {
        console.error("Error aceptando solicitud:", error);
        Alert.alert("Error al procesar la solicitud");
    }
};



const handleLoanRequest = async (requestData, id) => {
    const { userId, originalLoan, loanDuration } = requestData;
    const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
    const userDetails = userDetailsDoc.data();
    if (!userDetails || !userDetails.savingsBoxId) throw new Error('No se encontró información de usuario o ID de caja de ahorros');

    const savingsBoxId = userDetails.savingsBoxId;
    const savingsBoxRef = firestore().collection('savingsBoxes').doc(savingsBoxId);

    const currentAmountTaken = Number(userDetails.amountTaken.toFixed(2)) || 0;
    const currentAmountOwed = Number(userDetails.amountOwed.toFixed(2)) || 0;
    const newAmountTaken = currentAmountTaken + originalLoan;
    const newAmountOwed = currentAmountOwed + originalLoan;
    const nextPayment = originalLoan / loanDuration;
    const pendingPayments = loanDuration;
    const initialNextPaymentDate = new Date();
    initialNextPaymentDate.setMonth(initialNextPaymentDate.getMonth() + 1);
    const nextPaymentDate = initialNextPaymentDate.toISOString().slice(0, 10);

    const loanDate = new Date();
    const finalPaymentDate = new Date(loanDate);
    finalPaymentDate.setMonth(loanDate.getMonth() + loanDuration);
    const formattedFinalPaymentDate = finalPaymentDate.toISOString().slice(0, 10);

    await firestore().runTransaction(async (transaction) => {
        const savingsBoxDoc = await transaction.get(savingsBoxRef);
        if (!savingsBoxDoc.exists) {
            throw new Error("documento no existe!");
        }
        const currentTotalInvestmentToAdd = savingsBoxDoc.data().totalInvestmentToAdd || 0;
        const newTotalInvestmentToAdd = currentTotalInvestmentToAdd - originalLoan;

        transaction.update(savingsBoxRef, { totalInvestmentToAdd: newTotalInvestmentToAdd });

        transaction.update(firestore().collection('userDetails').doc(userId), {
            amountTaken: newAmountTaken,
            amountOwed: newAmountOwed,
            pendingPayments: pendingPayments,
            nextPaymentDate: nextPaymentDate,
        });

        transaction.update(firestore().collection('loanRequests').doc(id), {
            status: 'Aceptado',
            'Fecha de prestamo': loanDate.toISOString().slice(0, 10),
            nextPaymentDate: formattedFinalPaymentDate,
        });
    });
};




const handleJoiningSavingsBoxRequest = async (id) => {
    const requestDoc = await firestore().collection('savingsBoxJoinRequests').doc(id).get();
    const requestData = requestDoc.data();
    const userId = requestData ? requestData.userId : null;

    if (userId) {

        await firestore().collection('savingsBoxJoinRequests').doc(id).update({
            status: 'Aprobado',
        });

        await firestore().collection('userDetails').doc(userId).update({
            isActive: true,
        });
    } else {

        console.error('UserId not found for the given request.');
    }
};





const handleStockRequest = async (requestData, id) => {
    const { userId, numShares } = requestData; 
    const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
    const userDetails = userDetailsDoc.data();
    if (!userDetails || !userDetails.savingsBoxId) throw new Error('Detalles de usuario o ID de caja de ahorros faltantes');

    const savingsBoxId = userDetails.savingsBoxId;
    const savingsBoxDoc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
    const savingsBoxData = savingsBoxDoc.data();
    if (!savingsBoxData) throw new Error('Datos de la caja de ahorros no encontrados');
    const currentTotalInvestmentToAdd = savingsBoxData.totalInvestmentToAdd || 0;
    const actionPrice = savingsBoxData.actionPrice;
    const actionPriceNumber = parseFloat(actionPrice);
    const numSharesNumber = parseInt(numShares, 10);
    const liquidesDeCajaNumber = parseFloat(savingsBoxDoc.liquidesDeCaja);

    console.log(`actionPrice: ${actionPriceNumber}, numShares: ${numSharesNumber}, liquidesDeCaja: ${currentTotalInvestmentToAdd}`);

    if (isNaN(actionPriceNumber) || isNaN(numSharesNumber)) {
        console.error('One of the values is not a number');
      } else {
        const totalAmountToAdd = numSharesNumber * actionPriceNumber;
        console.log('Updating user details', totalAmountToAdd);
        const newTotalInvestmentToAdd = currentTotalInvestmentToAdd + totalAmountToAdd;
        const newStockAmount = savingsBoxData.TotalStocks + numSharesNumber;
        await firestore().collection('savingsBoxes').doc(savingsBoxId).update({
          totalInvestmentToAdd: newTotalInvestmentToAdd,
          TotalStocks: Number(newStockAmount),
        });
      }

      const currentSharesBoughtThisWeek = userDetails.sharesBoughtThisWeek || 0;
      const newSharesBoughtThisWeek = currentSharesBoughtThisWeek + numSharesNumber;
      await firestore().collection('userDetails').doc(userId).update({
          sharesBoughtThisWeek: newSharesBoughtThisWeek,
      });

      await firestore().collection('stockRequests').doc(id).update({
          status: 'Aceptado',
      });
};
