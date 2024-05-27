/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, Modal, TextInput, Dimensions } from "react-native";
import firestore from '@react-native-firebase/firestore';
import styles from "../../styles/DashboardStyle";
import auth from '@react-native-firebase/auth';

const Dashboard = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [numShares, setNumShares] = useState(1);
    const [sharesBoughtThisWeek, setSharesBoughtThisWeek] = useState(0);
    const [sharePrice, setSharePrice] = useState(0);
    const [amountTaken, setAmountTaken] = useState(0);
    const [amountOwed, setAmountOwed] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [nextPaymentDate, setNextPaymentDate] = useState('');
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalPoolInvestment, setTotalPoolInvestment] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [loanModalVisible, setLoanModalVisible] = useState(false);
    const [loanAmount, setLoanAmount] = useState('');

    const screenWidth = Dimensions.get('window').width;
    const fontSize = screenWidth * 0.06;

    useEffect(() => {
        const fetchData = async () => {
            const user = auth().currentUser;
            if (user) {
                const userId = user.uid;
                const querySnapshot = await firestore().collection('savingsBoxes').where('administrator', '==', userId).get();
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const data = doc.data();
                    console.log('Fetched data:', data); // Log the fetched data
                    setSharesBoughtThisWeek(data.sharesBoughtThisWeek);
                    setSharePrice(data.sharePrice);
                    setAmountTaken(data.amountTaken);
                    setAmountOwed(data.amountOwed);
                    setPendingPayments(data.pendingPayments);
                    setNextPaymentDate(data.nextPaymentDate);
                    setTotalInvestment(data.totalInvestment);
                    setTotalPoolInvestment(data.totalPoolInvestment);
                    setPendingRequests(data.pendingRequests);
                } else {
                    console.log('No data found'); // Log a message if no data was found
                }
            }
        };

        fetchData();
      }, []);

      const requestLoan = async () => {
        const user = auth().currentUser;
        if (user) {
            // Update Firestore with the loan amount
            const userRef = firestore().collection('users').doc(user.uid);
            await userRef.update({
                loanAmount: parseFloat(loanAmount),
            });

            // Calculate the total amount to be paid
            const interestRate = 0.05; 
            const time = 1; 
            const totalAmount = parseFloat(loanAmount) + (parseFloat(loanAmount) * interestRate * time);

            // Show the total amount in a pop-up
            Alert.alert(
                "Total cantitad a ser pagada",
                `la cantidad a ser pagada por el prestamo es de ${totalAmount.toFixed(2)}.`,
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") },
                ],
                { cancelable: false }
            );

            // Close the modal
            setLoanModalVisible(false);
        }  else {
            // Redirect to login page or show an error message
            console.log('No hay un usuario conectado');
        }
    };

    const isOwner = true; // replace this with actual check if user is owner
    const transactions: any[] = []; // declare the 'transactions' variable as an array of any

    const sendPetition = () => {
        console.log(transactions);
        if (pendingRequests + numShares > 5) {
            Alert.alert('Limite alcanzado', 'Solo puedes tener hasta 5 peticiones.');
        } else {
            // replace console.log with your function to send a petition
            console.log(`Enviando peticion para solicitar ${numShares} Acciones...`);
            setModalVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.secondcontainer}>
                <Text style={styles.title}>Dashboard</Text>
                <View style={styles.upperContainer}>
                    <Text style={{fontSize: fontSize}} > Total a deber: ${amountOwed ? amountOwed.toFixed(2) : '0.00'}</Text>
                    <Text style={{fontSize: fontSize}} > Total Inversion: ${totalPoolInvestment ? totalPoolInvestment.toFixed(2) : '0.00'}</Text>
                </View>
                {/* Stock Purchase Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle} > Comprar Accion</Text>
                    <Button
                        title="Enviar Peticion"
                        onPress={() => setModalVisible(true)}
                        disabled={pendingRequests >= 3}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Ingrese el numero de acciones:</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={text => setNumShares(Number(text))}
                                    value={numShares.toString()}
                                    keyboardType="numeric"
                                />
                                <Button
                                    title="Enviar pericion"
                                    onPress={sendPetition}
                                />
                                <Button
                                    title="Cancelar"
                                    color="red"
                                    onPress={() => setModalVisible(false)}
                                />
                            </View>
                        </View>
                    </Modal>
                    <Text>Price per share: ${sharePrice ? sharePrice.toFixed(2) : '0.00'}</Text>
                    {sharesBoughtThisWeek >= 3 && <Text>Limit of 3 shares per week</Text>}
                </View>

                {/* Loans Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prestamos</Text>
                    <Text>Cantidad tomada: ${amountTaken ? amountTaken.toFixed(2) : '0.00'}</Text>
                    <Text>Se debe: ${amountOwed ? amountOwed.toFixed(2) : '0.00'}</Text>
                    <Text>Pagos pendientes: ${pendingPayments ? pendingPayments.toFixed(2) : '0.00'} (Siguiente Pago: {nextPaymentDate})</Text>
                </View>

                {/* Investment Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Inversion</Text>
                    <Text>Total Inversion: ${totalInvestment ? totalInvestment.toFixed(2) : '0.00'}</Text>
                </View>

                {/* Savings Pool Owner Section */}
                {isOwner && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Caja Comunal Inversion Total</Text>
                        <Text>Inversion Total: ${totalPoolInvestment ? totalPoolInvestment.toFixed(2) : '0.00'}</Text>
                    </View>
                )}
            </View>
                        {/* Loans Section */}
                        <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prestamos</Text>
                <Button
                    title="Solicitar Prestamo"
                    onPress={() => setLoanModalVisible(true)}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={loanModalVisible}
                    onRequestClose={() => {
                        setLoanModalVisible(!loanModalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Ingrese el monto del prestamo:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setLoanAmount(text)}
                                value={loanAmount}
                                keyboardType="numeric"
                            />
                            <Button
                                title="Enviar solicitud"
                                onPress={requestLoan}
                            />
                            <Button
                                title="Cancelar"
                                color="red"
                                onPress={() => setLoanModalVisible(false)}
                            />
                        </View>
                    </View>
                </Modal>
                {/* ... (rest of your Loans Section code) */}
            </View>
        </View>
    );
};

export default Dashboard;
