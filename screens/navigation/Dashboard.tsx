/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { View, Text, Button, Alert, Modal, TextInput, Dimensions } from "react-native";
import styles from "../../styles/DashboardStyle";

const Dashboard = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [numShares, setNumShares] = useState(1);

    const transactions = [
        // replace this with actual transactions data
        { id: 1, name: 'Transaction 1', amount: 100 },
        { id: 2, name: 'Transaction 2', amount: 200 },
        { id: 3, name: 'Transaction 3', amount: 300 },
    ];

    const screenWidth = Dimensions.get('window').width;
    const fontSize = screenWidth * 0.06;
    // These are dummy values. Replace these with actual data from your backend.
    const sharesBoughtThisWeek = 2;
    const sharePrice = 10.00;
    const amountTaken = 500.00;
    const amountOwed = 200.00;
    const pendingPayments = 100.00;
    const nextPaymentDate = '2022-12-31';
    const totalInvestment = 300.00;
    const totalPoolInvestment = 1000.00;
    const pendingRequests = 0;

    const isOwner = true; // replace this with actual check if user is owner

    const sendPetition = () => {
        console.log(transactions);
        if (pendingRequests + numShares > 3) {
            Alert.alert('Limit reached', 'You can only have 3 pending requests.');
        } else {
            // replace console.log with your function to send a petition
            console.log(`Sending petition to buy ${numShares} share(s)...`);
            setModalVisible(false);
        }
    };

return (
        <View style={styles.container}>
            <View style={styles.secondcontainer}>
                <Text style={styles.title}>Dashboard</Text>
                <View style={styles.upperContainer}>
                    <Text style={{fontSize: fontSize}} > Total a deber: ${amountOwed.toFixed(2)}</Text>
                    <Text style={{fontSize: fontSize}} > Total Inversion: ${totalPoolInvestment.toFixed(2)}</Text>
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
                    <Text>Price per share: ${sharePrice.toFixed(2)}</Text>
                    {sharesBoughtThisWeek >= 3 && <Text>Limit of 3 shares per week</Text>}
                </View>

                {/* Loans Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Prestamos</Text>
                    <Text>Cantidad tomada: ${amountTaken.toFixed(2)}</Text>
                    <Text>Se debe: ${amountOwed.toFixed(2)}</Text>
                    <Text>Pagos pendientes: ${pendingPayments.toFixed(2)} (Siguiente Pago: {nextPaymentDate})</Text>
                </View>

                {/* Investment Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Inversion</Text>
                    <Text>Total Inversion: ${totalInvestment.toFixed(2)}</Text>
                </View>

                {/* Savings Pool Owner Section */}
                {isOwner && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Caja Comunal Inversion Total</Text>
                        <Text>Inversion Total: ${totalPoolInvestment.toFixed(2)}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Dashboard;
