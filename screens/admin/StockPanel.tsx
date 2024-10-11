/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { sendPetition } from '../../services/PetitionService';
import styles from '../../styles/StockPanelStyle';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const getCurrentUserSavingsBoxId = async () => {
    const user = auth().currentUser;
    if (!user) {
        throw new Error('No se ha conectado a su cuenta, no puede hacer peticiones');
    }

    const userId = user.uid;
    const userDoc = await firestore().collection('userDetails').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.savingsBoxId) {
        throw new Error('Documento de usuario o caja de ahorro no válido o faltante');
    }

    return userData.savingsBoxId;
};

const StockPanel = () => {
    const [stockAmount, setStockAmount] = useState(1);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Acciones' });
    }, [navigation]);

    const handleSendPetition = async () => {
        const savingsBoxId = await getCurrentUserSavingsBoxId();

        // Obtener el documento de la caja de ahorros
        firestore()
            .collection('savingsBoxes')
            .doc(savingsBoxId)
            .get()
            .then(documentSnapshot => {
                if (documentSnapshot.exists) {

                    const { actionPrice } = documentSnapshot.data();

                    const totalInvestmentToAdd = stockAmount * actionPrice;

                    sendPetition(stockAmount, setConfirmModalVisible, savingsBoxId)
                        .then(() => {
                            firestore()
                                .collection('savingsBoxes')
                                .doc(savingsBoxId)
                                .update({
                                    'total invertido en caja': firestore.FieldValue.increment(totalInvestmentToAdd),
                                })
                                .then(() => {
                                    Alert.alert("Solicitud enviada con éxito", "", [
                                        { text: "OK", onPress: () => navigation.navigate('Dashboard') }
                                    ]);
                                })
                                .catch((error) => {
                                    console.log('Error al actualizar la inversión total:', error);
                                });
                        })
                        .catch(() => {
                            Alert.alert("No se puede enviar en estos momentos, intente en 5 minutos");
                        });
                } else {
                    console.log('¡No existe tal documento!');
                }
            })
            .catch(error => {
                console.log('Error al obtener el documento:', error);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Solicitar acciones</Text>
                <Text style={styles.label}>Seleccione la cantidad de acciones:</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={stockAmount}
                        style={styles.picker}
                        onValueChange={(itemValue) => setStockAmount(itemValue)}
                    >
                        <Picker.Item label="1" value={1} />
                        <Picker.Item label="2" value={2} />
                        <Picker.Item label="3" value={3} />
                        <Picker.Item label="4" value={4} />
                        <Picker.Item label="5" value={5} />
                        {/* Agrega más opciones si es necesario */}
                    </Picker>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setConfirmModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Solicitar Acciones</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={confirmModalVisible}
                onRequestClose={() => {
                    setConfirmModalVisible(!confirmModalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar solicitud de acciones</Text>
                        <Text style={styles.modalText}>{`Cantidad de acciones: ${stockAmount}`}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setConfirmModalVisible(false);
                                handleSendPetition();
                            }}
                        >
                            <Text style={styles.modalButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButtonCancel}
                            onPress={() => setConfirmModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default StockPanel;
