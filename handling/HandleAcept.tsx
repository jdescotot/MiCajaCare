/* eslint-disable prettier/prettier */

import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export const handleAccept = async (id, requestType) => {
    console.log(requestType);
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

                case 'solicitud de admision':
                    console.log("minimo estoy aqui");
                    const requestDocCaja = await firestore().collection('savingsBoxJoinRequests').doc(id).get();
                    const requestDataCaja = requestDocCaja.data();
                    console.log("procesando solicitud de acceso");
                    if (!requestDataCaja) {
                        Alert.alert('No se encontró datos de la solicitud');
                        throw new Error('No se encontró datos de la solicitud');
                    }

                    const userId = requestDataCaja.userId;
                    await firestore().collection('savingsBoxJoinRequests').doc(id).update({
                        status: 'Aprobado',
                    });
                    await firestore().collection('userDetails').doc(userId).update({
                        isActive: true,
                    });

                    await handleJoiningSavingsBoxRequest(requestDataCaja);
                    break;

            default:
                console.log("minimo estoy aqui");
                const requestDocSoli = await firestore().collection('savingsBoxJoinRequests').doc(id).get();
                const requestDataSoli = requestDocSoli.data();
                console.log("procesando solicitud de acceso");
                if (!requestDataSoli) {
                    Alert.alert('No se encontró datos de la solicitud');
                    throw new Error('No se encontró datos de la solicitud');
                }

                const uId = requestDataSoli.userId;
                await firestore().collection('savingsBoxJoinRequests').doc(id).update({
                    status: 'Aprobado',
                });
                await firestore().collection('userDetails').doc(uId).update({
                    isActive: true,
                });

                await handleJoiningSavingsBoxRequest(requestDataCaja);
                break;
        }

        Alert.alert("Solicitud aceptada con éxito");

    } catch (error) {
        console.error("Error aceptando solicitud:", error);
        Alert.alert("Error al procesar la solicitud");
    }
};



const handleLoanRequest = async (requestData, id) => {
    const { userId, originalLoan, loanDuration, roundedTotalInterestAmount } = requestData;
    const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
    const userDetails = userDetailsDoc.data();
    if (!userDetails || !userDetails.savingsBoxId) throw new Error('No se encontró información de usuario o ID de caja de ahorros');

    const savingsBoxId = userDetails.savingsBoxId;
    const savingsBoxRef = firestore().collection('savingsBoxes').doc(savingsBoxId);

    //Toma valores iniciales de el usuario y la caja de ahorros
    const currentAmountTaken = Number(userDetails.amountTaken.toFixed(2)) || 0;
    const currentAmountOwed = Number(userDetails.amountOwed.toFixed(2)) || 0;
    const currentPayments = Number(userDetails.nextPayment) || 0;
    const newInterest = Number(roundedTotalInterestAmount.toFixed(2));
    const currentPendingPayments = Number(userDetails.pendingPayments) || 0;
    //Calcula los nuevos valores a ajustar al usuario
    const newAmountTaken = currentAmountTaken + originalLoan;
    const newAmountOwed = currentAmountOwed + newInterest;
    const nextPayment = (newInterest / loanDuration) + currentPayments;
    const pendingPayments = loanDuration + currentPendingPayments;
    //Calcula la ganancia para la caja de ahorro
    const amountGained = newInterest - originalLoan;
    //calcual las fechas de los prestamos
    const paymentDates = [];
    const loanDate = new Date().toISOString().slice(0, 10);
    const loanDateObj = new Date(loanDate);
    const startDate = new Date(loanDate);
        for (let i = 1; i <= loanDuration; i++) {
            const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, startDate.getDate());
            paymentDates.push(paymentDate.toISOString().slice(0, 10));
        }
    const nextPaymentDay = paymentDates.find(date => new Date(date) > loanDateObj);
    const nextPayDate = nextPaymentDay ? nextPaymentDay : "No se encuentra pago proximo ";
    await firestore().runTransaction(async (transaction) => {
        const savingsBoxDoc = await transaction.get(savingsBoxRef);
        if (!savingsBoxDoc.exists) {
            throw new Error("documento no existe!");
        }
        const currentTotalInvestmentToAdd = savingsBoxDoc.data().totalInvestmentToAdd || 0;
        const newTotalInvestmentToAdd = currentTotalInvestmentToAdd - originalLoan;

        transaction.update(savingsBoxRef, { totalInvestmentToAdd: newTotalInvestmentToAdd, gananciaDeCaja: amountGained});

        transaction.update(firestore().collection('userDetails').doc(userId), {
            amountTaken: newAmountTaken,
            amountOwed: newAmountOwed,
            pendingPayments: pendingPayments,
            nextPaymentDate: nextPayDate,
            nextPayment: nextPayment,
        });

        transaction.update(firestore().collection('loanRequests').doc(id), {
            status: 'Aceptado',
            'Fecha de prestamo': loanDate,
            nextPaymentDate: paymentDates,
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
    const investment = (actionPriceNumber * numSharesNumber) + userDetails.totalInvestment;
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
          totalInvestment: investment,
      });

      await firestore().collection('stockRequests').doc(id).update({
          status: 'Aceptado',
      });
};
