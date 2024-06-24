/* eslint-disable prettier/prettier */
// loanPanel.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { requestLoan } from '../../services/LoanService';
import styles from '../../styles/PanelStyle';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
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
        throw new Error('Documento de usuario o caja de ahorro no valido o faltante');
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
    const [totalWithInterest, setTotalWithInterest] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const navigation = useNavigation();

    const confirmLoanRequest = async () => {
        try {
            const savingsBoxId = await getCurrentUserSavingsBoxId();
            const interestRate = await getInterestRate(savingsBoxId);
            setInterestRate(interestRate);
            await requestLoan(loanAmount, setConfirmModalVisible, savingsBoxId, loanReason, loanDuration, loanDetail);
            Alert.alert("Solicitud enviada con éxito");
            setConfirmModalVisible(false);
        } catch (error) {
            if (error.message === 'No se ha conectado a su cuenta no puede hacer peticiones' || error.message === 'Documento de usuario o caja de ahorro no valido o faltante') {
                Alert.alert("Usuario no identificado, por favor inicie sesión");
            } else if (error.message === 'Savings box not found' || error.message === 'Documento de caja de ahorro no valido o tasa de interés faltante') {
                Alert.alert("Error al obtener detalles de la caja de ahorros");
            } else {
                Alert.alert("No se puede enviar en estos momentos, intente en 5 minutos");
            }
        }
    };

    const getSavingsBoxDetails = async (savingsBoxId: string) => {
        const doc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
        if (!doc.exists) {
          throw new Error('Savings box not found');
        }
        return doc.data();
      };

    const getInterestRate = async (savingsBoxId) => {
        const savingsBoxDoc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
        const savingsBoxData = savingsBoxDoc.data();

        if (!savingsBoxData || savingsBoxData.loanInterestRate === undefined) {
            throw new Error('Documento de caja de ahorro no valido o tasa de interés faltante');
        }

        return savingsBoxData.loanInterestRate;
    };

    const windowWidth = Dimensions.get('window').width;

    const handleRequestLoan = async () => {
        const savingsBoxId = await getCurrentUserSavingsBoxId();
        const interestRate = await getInterestRate(savingsBoxId);
        setInterestRate(interestRate);
        requestLoan(loanAmount, setConfirmModalVisible, savingsBoxId, loanReason, loanDuration, loanDetail)
            .then(() => {
                Alert.alert("Solicitud enviada con exito", "", [
                    { text: "OK", onPress: () => navigation.navigate('Dashboard') }
                ]);
            })
            .catch(() => {
                Alert.alert("No se puede enviar en estos momentos, intente en 5 minutos");
            });
    };

    const calculateCompoundInterest = (principal, rate, timesCompounded, time) => {
        const timeInYears = time / 12;
        const amount = principal * Math.pow((1 + rate / timesCompounded), timesCompounded * timeInYears);
        return amount.toFixed(6);
    };

    const handleCalculateInterest = () => {
        const total = calculateCompoundInterest(loanAmount, interestRate, 12, loanDuration / 12); // Asumiendo que `loanDuration` está en meses
        setTotalWithInterest(total);
    };

    useEffect(() => {
        const fetchInterestRate = async () => {
            const savingsBoxId = await getCurrentUserSavingsBoxId();
            const interestRate = await getInterestRate(savingsBoxId);
            setInterestRate(interestRate);
        };

        fetchInterestRate();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Solicitar prestamo</Text>
                <Text style={styles.title2}>Ingrese la cantidad a tomar:</Text>
                <TextInput
                onChangeText={text => {
                    const num = parseFloat(text);
                    if (!isNaN(num)) {
                        setLoanAmount(num);
                    } else {
                        setLoanAmount(0);
                    }
                }}
                value={loanAmount.toString()}
                keyboardType="numeric"
                style={[styles.input, {textAlign: 'center', fontSize: 20}]} // Adjusted style
            />
                <Text style={styles.title2}>Seleccione el tiempo a tomar:</Text>
                <Picker
                    selectedValue={loanDuration}
                    onValueChange={(itemValue) => setLoanDuration(itemValue)}
                >
                    <Picker.Item label="3 meses" value="3" />
                    <Picker.Item label="6 meses" value="6" />
                </Picker>
                <TextInput
                    style={styles.inputWhite}
                    multiline
                    numberOfLines={4}
                    placeholder="Especifique el motivo del prestamo"
                    onChangeText={text => {
                        setLoanDetail(text);
                    }}
                    value={loanDetail}
                />
                <Picker
                    selectedValue={loanCategory}
                    onValueChange={(itemValue) => setLoanCategory(itemValue)}
                >
                    <Picker.Item label="Personal" value="personal" />
                    <Picker.Item label="Salud" value="salud" />
                    <Picker.Item label="Educacion" value="educacion" />
                    <Picker.Item label="Negocio" value="negocio" />
                    <Picker.Item label="Otros" value="otros" />

                </Picker>
                <Text style={styles.title2}>
                    Total con interés: {totalWithInterest}
                </Text>
                <Button
                    title="Solicitar Prestamo"
                    onPress={handleRequestLoan}
                    disabled={loanDetail === ''}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={confirmModalVisible}
                    onRequestClose={() => {
                        setConfirmModalVisible(!confirmModalVisible);
                    }}
                >
                    <View>
                        <Text>Confirmar</Text>
                        <Text>{`Monto: ${loanAmount}`}</Text>
                        <TextInput
                            placeholder="Ingrese el motivo del prestamo"
                            onChangeText={text => setLoanReason(text)}
                            value={loanReason}
                        />
                        <Text>{`Defina el teimpo del prestamo: ${loanDuration} Meses`}</Text>
                        <Slider
                            style={{width: windowWidth - 40, height: 70}}
                            minimumValue={3}
                            maximumValue={6}
                            step={3}
                            onValueChange={value => setLoanDuration(value)}
                            value={loanDuration}
                        />
                        <Button
                            title="Confirmar"
                            onPress={confirmLoanRequest}
                        />
                        <Button
                            title="Cancelar"
                            color="red"
                            onPress={() => setConfirmModalVisible(false)}
                        />
                    </View>
                </Modal>
            </View>
        </View>
    );
};

export default LoansPanel;
