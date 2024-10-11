/* eslint-disable prettier/prettier */
// loanPanel.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { requestLoan } from '../../services/LoanService';
import styles from '../../styles/PanelStyle';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';

const getCurrentUserSavingsBoxId = async () => {
    const user = auth().currentUser;
    if (!user) {
        throw new Error('No se ha conectado a su cuenta no puede hacer peticiones');
    }

    const userId = user.uid;
    const userDoc = await firestore().collection('userDetails').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.savingsBoxId) {
        throw new Error('Documento de usuario o caja de ahorro no válido o faltante');
    }

    return userData.savingsBoxId;
};

const LoansPanel = () => {
    const [loanAmount, setLoanAmount] = useState(0);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [loanReason, setLoanReason] = useState('');
    const [loanDuration, setLoanDuration] = useState(3);
    const [loanDetail, setLoanDetail] = useState('');
    const [loanCategory, setLoanCategory] = useState('personal');
    const [interest, setInterest] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Préstamos' });
    }, [navigation]);

    const getInterestRate = async (savingsBoxId) => {
        const savingsBoxDoc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
        const savingsBoxData = savingsBoxDoc.data();

        if (!savingsBoxData || savingsBoxData.loanInterestRate === undefined) {
            throw new Error('Documento de caja de ahorro no válido o tasa de interés faltante');
        }
        return savingsBoxData.loanInterestRate;
    };

    const calculateCompoundInterest = (principal, rate, timesCompounded, time) => {
        const timeInYears = time / 12;
        const decimalRate = rate / 100;
        const amount = principal * (Math.pow((1 + decimalRate / timesCompounded), timesCompounded * timeInYears));
        return amount.toFixed(2);
    };

    const handleCalculateInterest = (num) => {
        const total = calculateCompoundInterest(num, interestRate, 12, loanDuration);
        setInterest(total);
    };

    useEffect(() => {
        const fetchInterestRate = async () => {
            try {
                const savingsBoxId = await getCurrentUserSavingsBoxId();
                const rate = await getInterestRate(savingsBoxId);
                setInterestRate(rate);
                handleCalculateInterest(loanAmount);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'No se pudo obtener la tasa de interés.');
            }
        };

        fetchInterestRate();
    }, [loanDuration, loanAmount]);

    const handleRequestLoan = async () => {
        setIsButtonDisabled(true);
        try {
            const savingsBoxId = await getCurrentUserSavingsBoxId();
            const roundedTotalInterestAmount = Math.round(interest * 100) / 100;

            await requestLoan(
                roundedTotalInterestAmount,
                setConfirmModalVisible,
                savingsBoxId,
                loanReason,
                loanDuration,
                loanDetail,
                loanAmount
            );

            // Mostrar alerta de éxito y navegar a la pantalla principal
            Alert.alert('Solicitud enviada con éxito', '', [
                { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo procesar la solicitud.');
        }
        setIsButtonDisabled(false);
    };

    return (
        <View style={styles.gradientContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Solicitar préstamo</Text>
                <Text style={styles.title2}>Ingrese la cantidad a tomar:</Text>
                <TextInput
                    onChangeText={(text) => {
                        const num = parseFloat(text);
                        if (!isNaN(num)) {
                            setLoanAmount(num);
                            handleCalculateInterest(num);
                        } else {
                            setLoanAmount(0);
                            handleCalculateInterest(0);
                        }
                    }}
                    value={loanAmount.toString()}
                    keyboardType="numeric"
                    style={[styles.input, { textAlign: 'center', fontSize: 20, color: '#333' }]}
                    placeholderTextColor="#aaa"
                />
                <Text style={styles.title2}>Seleccione el tiempo a tomar:</Text>
                <Picker
                    selectedValue={loanDuration}
                    onValueChange={(itemValue) => {
                        setLoanDuration(itemValue);
                        handleCalculateInterest(loanAmount);
                    }}
                    style={styles.picker}
                >
                    <Picker.Item label="3 meses" value={3} />
                    <Picker.Item label="6 meses" value={6} />
                </Picker>
                <TextInput
                    style={[styles.inputWhite, { textAlignVertical: 'top', color: '#333' }]}
                    multiline
                    numberOfLines={4}
                    placeholder="Especifique el motivo del préstamo"
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => {
                        setLoanDetail(text);
                    }}
                    value={loanDetail}
                />
                <Picker
                    selectedValue={loanCategory}
                    onValueChange={(itemValue) => setLoanCategory(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Personal" value="personal" />
                    <Picker.Item label="Salud" value="salud" />
                    <Picker.Item label="Educación" value="educacion" />
                    <Picker.Item label="Negocio" value="negocio" />
                    <Picker.Item label="Otros" value="otros" />
                </Picker>
                <Text style={styles.title2}>Total con interés: {interest}</Text>
                <TouchableOpacity
                    onPress={handleRequestLoan}
                    disabled={loanDetail === '' || isButtonDisabled}
                    style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>Solicitar Préstamo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LoansPanel;
