/* eslint-disable prettier/prettier */
import React, { useState, useEffect} from 'react';
import { View, Text, Button, TextInput, Modal, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { sendPetition } from '../../services/PetitionService';
import styles from '../../styles/StockPanelStyle'; // Importa el nuevo archivo de estilos
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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

const StockPanel = () => {
    const [stockAmount, setStockAmount] = useState(0);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const windowWidth = Dimensions.get('window').width;
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Acciones' }); // Cambia el título aquí
    }, [navigation]);

    const handleSendPetition = async () => {
        const savingsBoxId = await getCurrentUserSavingsBoxId();

        // Step 1: Fetch the savings box document
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
                                    console.log('Error updating total investment:', error);
                                });
                        })
                        .catch(() => {
                            Alert.alert("No se puede enviar en estos momentos, intente en 5 minutos");
                        });
                } else {
                    console.log('No such document!');
                }
            })
            .catch(error => {
                console.log('Error getting document:', error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.listItem}>Solicitar acciones</Text>
            <Text style={styles.listItem}>Ingrese la cantidad a tomar:</Text>
            <TextInput
                style={styles.input} // Aplica el estilo al TextInput
                onChangeText={text => {
                    const num = parseFloat(text);
                    if (!isNaN(num)) {
                        setStockAmount(num);
                    } else {
                        setStockAmount(0);
                    }
                }}
                value={stockAmount.toString()}
                keyboardType="numeric"
            />
            <Slider
                style={styles.slider} // Aplica el estilo al Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                onValueChange={value => setStockAmount(value)}
                value={stockAmount}
            />
            <TouchableOpacity
                style={styles.button} // Aplica el estilo al botón
                onPress={handleSendPetition}
            >
                <Text style={styles.buttonText}>Solicitar Acciones</Text>
            </TouchableOpacity>
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
                        <Text style={styles.listItem}>Confirmar solicitud de acciones</Text>
                        <Text style={styles.listItem}>{`Cantidad de acciones: ${stockAmount}`}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setConfirmModalVisible(false)}
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
