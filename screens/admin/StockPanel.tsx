/* eslint-disable prettier/prettier */
import React, { useState, useEffect} from 'react';
import { View, Text, Button, TextInput, Modal, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { sendPetition } from '../../services/PetitionService';
import styles from '../../styles/DashboardStyle';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

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
                style={{width: windowWidth - 40, height: 70}}
                minimumValue={1}
                maximumValue={5}
                step={1}
                onValueChange={value => setStockAmount(value)}
                value={stockAmount}
            />
            <Button
                title="Solicitar Acciones"
                onPress={handleSendPetition}
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
                    <Text>Confirmar solicitud de acciones</Text>
                    <Text>{`Cantidad de acciones: ${stockAmount}`}</Text>
                    <Button
                        title="Confirmar"
                        onPress={() => setConfirmModalVisible(false)}
                    />
                    <Button
                        title="Cancelar"
                        color="red"
                        onPress={() => setConfirmModalVisible(false)}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default StockPanel;
