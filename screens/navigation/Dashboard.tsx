/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity, Button, RefreshControl, TextInput, SectionList, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SQLite from 'react-native-sqlite-storage';
import { checkIfAdmin } from '../../valisations/ValidacionesAdmin';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/DashboardStyle';

const Dashboard = () => {
    const navigation = useNavigation();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [data, setData] = useState({});
    const [pastRequests, setPastRequests] = useState([]);
    const screenWidth = Dimensions.get('window').width;
    const fontSize = screenWidth * 0.06;
    const [refreshing, setRefreshing] = useState(false);
    const [liquidesDeCaja, setLiquidesDeCaja] = useState(0);

    useEffect(() => {
        navigation.setOptions({ title: 'Inicio' });
    }, [navigation]);

    useEffect(() => {
        const checkAdminAndFetchData = async () => {
            const admin = await checkIfAdmin();
            setIsAdmin(admin);
            fetchPendingRequests();
        };
        checkAdminAndFetchData();
    }, [isAdmin]);

    const fetchData = async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                const userId = user.uid;
                const userDoc = await firestore().collection('userDetails').doc(userId).get();
                const userData = userDoc.data();
                console.log('el id de usuario', userId);

                if (!userData || !userData.savingsBoxId) {
                    throw new Error('Documento de usuario o caja de ahorro no valido o faltante');
                }

                const savingsBoxId = userData.savingsBoxId;
                console.log('el id de la caja de ahorros', savingsBoxId);

                const savingsBoxDoc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
                const savingsBoxData = savingsBoxDoc.data();

                if (!savingsBoxData) {
                    throw new Error('Documento de caja de ahorro no valido o faltante');
                }

                const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
                const userDetails = userDetailsDoc.data();
                const totalInvestmentToAdd = savingsBoxData.totalInvestmentToAdd || 0;
                setLiquidesDeCaja(totalInvestmentToAdd);
                console.log('liquides de caja', liquidesDeCaja);

                if (!userDetails) {
                    throw new Error('Detalles de usuario no validos o faltantes');
                }else{
                    setIsActive(userDetails.isActive);
                }

                setData({
                    liquidesDeCaja: totalInvestmentToAdd,
                    actionPrice: savingsBoxData.actionPrice || 0,
                    loanInterestRate: savingsBoxData.loanInterestRate || 0,
                    latePaymentInterestRate: savingsBoxData.latePaymentInterestRate || 0,
                    amountOwed: userDetails.amountOwed || 0,
                    amountTaken: userDetails.amountTaken || 0,
                    nextPaymentDate: userDetails.nextPaymentDate || 0,
                    pendingPayments: userDetails.pendingPayments || 0,
                    sharesBoughtThisWeek: userDetails.sharesBoughtThisWeek || 0,
                    totalInvestment: userDetails.totalInvestment || 0,
                });

                if ((savingsBoxData.loanInterestRate === 0 || savingsBoxData.loanInterestRate == null || savingsBoxData.latePaymentInterestRate === 0 || savingsBoxData.actionPrice === null || savingsBoxData.latePaymentInterestRate === null) && isAdmin) {
                    navigation.navigate('RegisterOrg', { userId: userId });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAndDisplayUserRequests = async () => {
        try {
            const user = auth().currentUser;
            if (!user) throw new Error('No user found');
            const userId = user.uid;
            const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
            const userDetails = userDetailsDoc.data();
            if (!userDetails || !userDetails.savingsBoxId) throw new Error('User details or savings box ID missing');

            const savingsBoxId = userDetails.savingsBoxId;

            const loanRequestsPromise = firestore().collection('loanRequests')
                .where('userId', '==', userId)
                .where('savingsBoxId', '==', savingsBoxId)
                .get();
            const stockRequestsPromise = firestore().collection('stockRequests')
                .where('userId', '==', userId)
                .where('savingsBoxId', '==', savingsBoxId)
                .get();

            const [loanRequestsSnapshot, stockRequestsSnapshot] = await Promise.all([loanRequestsPromise, stockRequestsPromise]);

            const loanRequests = loanRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const stockRequests = stockRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const combinedRequests = [...loanRequests, ...stockRequests];

            setPastRequests(combinedRequests);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const user = auth().currentUser;
            if (!user) throw new Error('No user found');
            const userId = user.uid;
            const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
            const userDetails = userDetailsDoc.data();
            if (!userDetails || !userDetails.savingsBoxId) throw new Error('User details or savings box ID missing');

            const savingsBoxId = userDetails.savingsBoxId;

            const loanRequestsPromise = firestore().collection('loanRequests')
                .where('savingsBoxId', '==', savingsBoxId)
                .where('status', '==', 'Pendiente')
                .get();
            const stockRequestsPromise = firestore().collection('stockRequests')
                .where('savingsBoxId', '==', savingsBoxId)
                .where('status', '==', 'Pendiente')
                .get();
            const savingsBoxJoinRequestsPromise = firestore().collection('savingsBoxJoinRequests')
                .where('savingsBoxId', '==', savingsBoxId)
                .where('status', '==', 'Pendiente')
                .get();

            const [loanRequestsSnapshot, stockRequestsSnapshot, savingsBoxJoinRequestsSnapshot] = await Promise.all([loanRequestsPromise, stockRequestsPromise, savingsBoxJoinRequestsPromise]);

            const loanRequests = loanRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const stockRequests = stockRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const savingsBoxJoinRequests = await Promise.all(savingsBoxJoinRequestsSnapshot.docs.map(async doc => {
                const request = doc.data();
                const userDetails = await firestore().collection('userDetails').doc(request.userId).get();
                const userName = userDetails.data()?.name || 'Unknown';
                return {
                    id: doc.id,
                    ...request,
                    requestType: 'solicitud de admisión',
                    userName: userName,
                };
            }));

            const allRequests = [...loanRequests, ...stockRequests, ...savingsBoxJoinRequests];
            setPendingRequests(allRequests);
            fetchAndDisplayUserRequests();
        } catch (error) {
            console.error(error);
        }
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchData();
            await fetchPendingRequests();
            await fetchAndDisplayUserRequests();
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    }, []);

    const handleAccept = async (id) => {
        console.log("Procesando aceptación", id);
        try {
            const requestDoc = await firestore().collection('loanRequests').doc(id).get();
            let requestData = requestDoc.data();

            if (requestData && requestData.loanAmount !== undefined) {
                const { userId, loanAmount, loanDuration } = requestData; // Removed loanDate from destructuring
                const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
                const userDetails = userDetailsDoc.data();
                if (!userDetails) throw new Error('No se encontró información de usuario');

                const currentAmountTaken = Number(userDetails.amountTaken.toFixed(2)) || 0;
                const currentAmountOwed = Number(userDetails.amountOwed.toFixed(2)) || 0;
                const newAmountTaken = currentAmountTaken + loanAmount;
                const newAmountOwed = currentAmountOwed + loanAmount;
                const nextPayment = loanAmount / loanDuration;
                const pendingPayments = loanDuration;
                const initialNextPaymentDate = new Date();
                initialNextPaymentDate.setMonth(initialNextPaymentDate.getMonth() + 1);
                const nextPaymentDate = initialNextPaymentDate.toISOString().slice(0, 10);

                await firestore().collection('userDetails').doc(userId).update({
                    amountTaken: newAmountTaken,
                    amountOwed: newAmountOwed,
                    pendingPayments: pendingPayments,
                    nextPaymentDate: nextPaymentDate,
                });

                const loanDate = new Date();
                const finalPaymentDate = new Date(loanDate);
                finalPaymentDate.setMonth(loanDate.getMonth() + loanDuration);
                const formattedFinalPaymentDate = finalPaymentDate.toISOString().slice(0, 10);
                console.log('entre aqui aver que sale ');
                await firestore().collection('loanRequests').doc(id).update({
                    status: 'Aceptado',
                    'Fecha de prestamo': loanDate.toISOString().slice(0, 10),
                    nextPaymentDate: formattedFinalPaymentDate,
                });

            }  else {
                const stockRequestDoc = await firestore().collection('stockRequests').doc(id).get();
                let stockRequestData = stockRequestDoc.data();
                if (!stockRequestData){
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
                }else{
                    const { userId, numShares } = stockRequestData; // Corrected from numberOfStocks to numShares
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
                    const liquidesDeCajaNumber = parseFloat(liquidesDeCaja);

                    console.log(`actionPrice: ${actionPriceNumber}, numShares: ${numSharesNumber}, liquidesDeCaja: ${currentTotalInvestmentToAdd}`);

                    if (isNaN(actionPriceNumber) || isNaN(numSharesNumber)) {
                        console.error('One of the values is not a number');
                      } else {
                        const totalAmountToAdd = numSharesNumber * actionPriceNumber;
                        console.log('Updating user details', totalAmountToAdd);
                        const newTotalInvestmentToAdd = currentTotalInvestmentToAdd + totalAmountToAdd;
                        await firestore().collection('savingsBoxes').doc(savingsBoxId).update({
                          totalInvestmentToAdd: newTotalInvestmentToAdd,
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
                }
            }

            Alert.alert("Solicitud aceptada con éxito");
            await fetchPendingRequests();
        } catch (error) {
            console.error("Error aceptando solicitud:", error);
            Alert.alert("Error al procesar la solicitud");
        }
    };

    const handleReject = async (id) => {
        console.log("procesando Rechazo", id);
        await firestore().collection('loanRequests').doc(id).update({
            status: 'Rechazado',
        });
        Alert.alert("Solicitud rechazada con exito ");
        await fetchPendingRequests();
    };

    const fetchProximoPago = async () => {
        try {
            const user = auth().currentUser;
            if (!user) throw new Error('No user found');
            const userId = user.uid;

            const loanRequestsSnapshot = await firestore().collection('loanRequests')
                .where('userId', '==', userId)
                .where('status', '==', 'Aceptado')
                .get();

            let totalCuotas = 0;
            loanRequestsSnapshot.forEach(doc => {
                const loanRequest = doc.data();

                totalCuotas += loanRequest.Cuotas ? loanRequest.Cuotas : 0;
            });

            const updatedSections = sections.map(section => {
                if (section.title === 'Vista General') {
                    return {
                        ...section,
                        data: [
                            ...section.data,
                            { title: 'Próximo Pago', value: totalCuotas },
                        ],
                    };
                }
                return section;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const sections = [
        {
            title: 'Vista General',
            data: [
                { title: 'Liquides de Caja', value: data.liquidesDeCaja },
                { title: 'Precio de la acción', value: data.actionPrice },
                { title: 'Cantidad adeudada', value: data.amountOwed },
                { title: 'Cantidad tomada', value: data.amountTaken },
                { title: 'Tasa de interés por pago atrasado', value: data.latePaymentInterestRate },
                { title: 'Tasa de interés del préstamo', value: data.loanInterestRate },
                { title: 'Fecha del próximo pago', value: data.nextPaymentDate },
                { title: 'Pagos pendientes', value: data.pendingPayments },
                { title: 'Solicitudes pendientes', value: pendingRequests.length },
                { title: 'Acciones compradas esta semana', value: data.sharesBoughtThisWeek },
                { title: 'Cantidad a Pagar', value: Math.round((data.amountTaken / data.pendingPayments) * 100) / 100 },
                { title: 'Inversión total', value: data.totalInvestment },
            ],
            renderItem: ({ item }) => (
                <View>
                    <Text style={{ fontSize, color: 'black' }}>{item.title}</Text>
                    <Text style={{ fontSize, color: 'black' }}>{item.value}</Text>
                </View>
            ),
            keyExtractor: (item) => item.title,
        },
    ];

    if (isAdmin) {
        sections.push({
            title: 'Solicitudes Pendientes',
            data: pendingRequests,
            renderItem: ({ item, index }) => {
                const [rejectionText, setRejectionText] = useState('');

                return (
                    <View style={styles.requestContainer} key={index}>
                         <Text>{`Solicitante: ${item.userName}`}</Text>
                        {item.loanAmount && <Text>{`Monto del préstamo: ${item.loanAmount}`}</Text>}
                        {item.loanDetail && <Text>{`Detalle del préstamo: ${item.loanDetail}`}</Text>}
                        {item.loanDuration && <Text>{`Duración del préstamo: ${item.loanDuration} meses`}</Text>}
                        {item.loanReason && <Text>{`Razón del préstamo: ${item.loanReason}`}</Text>}
                        {item.numShares && <Text>{`Número de acciones: ${item.numShares}`}</Text>}
                        <TextInput
                            style={styles.input}
                            onChangeText={setRejectionText}
                            value={rejectionText}
                            placeholder="Razón del rechazo"
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Aceptar" onPress={() => handleAccept(item.id)} style={styles.requestButton} />
                            <Button 
                                title="Rechazar"
                                onPress={() => handleReject(item.id)}
                                style={styles.requestButton} 
                                disabled={!rejectionText.trim()}
                            />
                        </View>
                    </View>
                );
            },
            keyExtractor: (item, index) => index.toString(),
        });
    }

    if (pastRequests.length > 0) {
        sections.push({
            title: 'Solicitudes Pasadas',
            data: pastRequests,
            renderItem: ({ item, index }) => (
                <View style={styles.requestContainer} key={index}>
                    <Text>{`Solicitud ${index + 1}: ${item.name}`}</Text>
                    <Text>{`Estado: ${item.status}`}</Text>
                    {item.response && <Text>{`Respuesta: ${item.response}`}</Text>}
                </View>
            ),
            keyExtractor: (item, index) => index.toString(),
        });
    }

const actionsData = ['Solicitar préstamo', 'Comprar acciones'];
if (isAdmin) {
    actionsData.push('Eventos');
}

sections.push({
    title: 'Acciones a realizar',
    data: actionsData,
    renderItem: ({ item }) => (
        <TouchableOpacity
            style={styles.button}
            onPress={() => {
                if (item === 'Solicitar préstamo') {
                    navigation.navigate('LoansPanel');
                } else if (item === 'Comprar acciones') {
                    navigation.navigate('StockPanel');
                } else if (item === 'Eventos' && isAdmin) {
                    navigation.navigate('AddMoneyToSavingsBox');
                }
            }}
        >
            <Text style={styles.buttonText}>{item}</Text>
        </TouchableOpacity>
    ),
    keyExtractor: (item) => item,
});

    useEffect(() => {
        fetchData();
        fetchProximoPago();
    }, []);

    useEffect(() => {
        if (data.actionPrice === 0 || data.actionPrice === null) {
            navigation.navigate('RegisterOrg', { userId: auth().currentUser.uid });
        }
    }, [data.actionPrice]);

    const handleLogout = async () => {
        try {
            await auth().signOut();
            navigation.navigate('Landing');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo cerrar sesión correctamente.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.containertwo}>
                <SectionList
                    style={styles.container}
                    sections={sections}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.headerRow}>
                            <Text style={styles.headerText}>{title}</Text>
                        </View>
                    )}
                    renderItem={({ item, index }) => (
                        <View style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                            <Text style={styles.cell}>{item.title}</Text>
                            <Text style={styles.cell}>{item.value}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => item + index}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            </View>
        </View>
    );
};

export default Dashboard;
