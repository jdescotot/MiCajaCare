/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, TouchableOpacity, RefreshControl, TextInput, Alert, ScrollView } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { checkIfAdmin } from '../../valisations/ValidacionesAdmin';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/DashboardStyle';
import { handleAccept } from "../../handling/HandleAcept";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
const Dashboard = () => {
    const navigation = useNavigation();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [data, setData] = useState({});
    const [pastRequests, setPastRequests] = useState([]);
    const [rejectionTexts, setRejectionTexts] = useState([]);
    const screenWidth = Dimensions.get('window').width;
    const fontSize = screenWidth * 0.06;
    const [refreshing, setRefreshing] = useState(false);
    const [liquidesDeCaja, setLiquidesDeCaja] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [savingsBoxName, setSavingsBoxName] = useState('');

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

                if (!userData || !userData.savingsBoxId) {
                    throw new Error('Documento de usuario o caja de ahorro no valido o faltante');
                }

                const savingsBoxId = userData.savingsBoxId;
                const savingsBoxDoc = await firestore().collection('savingsBoxes').doc(savingsBoxId).get();
                const savingsBoxData = savingsBoxDoc.data();

                if (!savingsBoxData) {
                    Alert.alert('Error', 'No se encontró la caja de ahorros');
                    navigation.navigate('JoinSavingsBox');
                    return;
                }

                const totalInvestmentToAdd = savingsBoxData.totalInvestmentToAdd || 0;
                const nombreCajaDeAhorro = savingsBoxData.name || 'Caja de ahorros';
                setSavingsBoxName(nombreCajaDeAhorro);
                setLiquidesDeCaja(totalInvestmentToAdd);

                setData({
                    liquidesDeCaja: totalInvestmentToAdd,
                    actionPrice: savingsBoxData.actionPrice || 0,
                    loanInterestRate: savingsBoxData.loanInterestRate || 0,
                    latePaymentInterestRate: savingsBoxData.latePaymentInterestRate || 0,
                    amountOwed: userData.amountOwed || 0,
                    amountTaken: userData.amountTaken || 0,
                    nextPaymentDate: userData.nextPaymentDate || 0,
                    pendingPayments: userData.pendingPayments || 0,
                    sharesBoughtThisWeek: userData.sharesBoughtThisWeek || 0,
                    totalInvestment: userData.totalInvestment || 0,
                    TotalStocks: savingsBoxData.TotalStocks || 0,
                    nextPayment: userData.nextPayment || 0,
                    gananciaDeCaja: savingsBoxData.gananciaDeCaja || 0,
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

            const loanRequests = loanRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), name: doc.data().name || "Prestamo" }));
            const stockRequests = stockRequestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), name: doc.data().name || "Acciones" }));
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
    
            // Modificar loanRequests para incluir userName
            const loanRequests = await Promise.all(loanRequestsSnapshot.docs.map(async doc => {
                const request = doc.data();
                const userDetailsDoc = await firestore().collection('userDetails').doc(request.userId).get();
                const userName = userDetailsDoc.data()?.name || 'Unknown';
                return {
                    id: doc.id,
                    ...request,
                    requestType: 'Solicitud de préstamo',
                    userName: userName,
                };
            }));
    
            // Modificar stockRequests para incluir userName
            const stockRequests = await Promise.all(stockRequestsSnapshot.docs.map(async doc => {
                const request = doc.data();
                const userDetailsDoc = await firestore().collection('userDetails').doc(request.userId).get();
                const userName = userDetailsDoc.data()?.name || 'Unknown';
                return {
                    id: doc.id,
                    ...request,
                    requestType: 'Compra de Acciones',
                    userName: userName,
                };
            }));
    
            // Mantener savingsBoxJoinRequests como está
            const savingsBoxJoinRequests = await Promise.all(savingsBoxJoinRequestsSnapshot.docs.map(async doc => {
                const request = doc.data();
                const userDetails = await firestore().collection('userDetails').doc(request.userId).get();
                const userName = userDetails.data()?.name || 'Unknown';
                return {
                    id: doc.id,
                    ...request,
                    requestType: 'Solicitud de admisión',
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
            setButtonDisabled(false);
        } catch (error) {
            setButtonDisabled(false);
            console.error(error);
        }
        setRefreshing(false);
    }, []);

    const handleReject = async (id, requestType) => {
        console.log("Procesando Rechazo", id, requestType );
        let collectionName = '';

        switch (requestType) {
            case 'Solicitud de préstamo':
                collectionName = 'loanRequests';
                break;
            case 'Compra de Acciones':
                collectionName = 'stockRequests';
                break;
            case 'peticion de Acceso a caja de ahorro':
                collectionName = 'savingsBoxJoinRequests';
                break;
            default:
                console.error('Tipo de solicitud desconocido');
                return;
        }

        try {
            await firestore().collection(collectionName).doc(id).update({
                status: 'Rechazado',
            });
            Alert.alert("Solicitud rechazada con éxito");
            await fetchPendingRequests();
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
            Alert.alert("Error al rechazar la solicitud");
        }
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

    const handleRejectionTextChange = (text, index) => {
        const newRejectionTexts = [...rejectionTexts];
        newRejectionTexts[index] = text;
        setRejectionTexts(newRejectionTexts);
    };

    const sections = [
        {
            title: 'Vista General',
            data: [
                { title: 'Liquides de Caja', value: Math.round(data.liquidesDeCaja * 100) / 100 },
                { title: 'Precio de la acción', value: Math.round(data.actionPrice * 100) / 100 },
                { title: 'Cantidad adeudada', value: Math.round(data.amountOwed * 100) / 100 },
                { title: 'Cantidad tomada', value: Math.round(data.amountTaken * 100) / 100 },
                { title: 'Tasa de interés por pago atrasado', value: data.latePaymentInterestRate },
                { title: 'Tasa de interés del préstamo', value: data.loanInterestRate },
                { title: 'Fecha del próximo pago', value: data.nextPaymentDate },
                { title: 'Pagos pendientes', value: data.pendingPayments },
                { title: 'Solicitudes pendientes', value: pendingRequests.length },
                { title: 'Acciones compradas por usuario', value: data.sharesBoughtThisWeek },
                { title: 'Cantidad a Pagar', value: Math.round((data.nextPayment) * 100) / 100 },
                { title: 'Inversión total', value: data.totalInvestment },
                { title: 'Acciones totales', value: data.TotalStocks},
                { title: 'Ganancia de Caja', value: Math.round((data.gananciaDeCaja) * 100) / 100},
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

    const actionsData = ['Solicitar préstamo', 'Comprar acciones'];
    if (isAdmin) {
        actionsData.push('Eventos');
    }

    return (
        <ScrollView
            style={styles.mainContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#4caf50"
                    colors={['#4caf50']}
                    progressBackgroundColor="#ffffff"
                />
            }
        >
            <View style={styles.jumbotron}>
                <Text style={styles.jumbotronText}>{savingsBoxName}</Text>
                <View style={styles.liquidesContainer}>
                    <Text style={styles.liquidesText}>{`Liquides de Caja: L${Math.round(data.liquidesDeCaja * 100) / 100}`}</Text>
                </View>
            </View>

            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Precio de la Acción</Text>
                    <Text style={styles.cardValue}>{`L${Math.round(data.actionPrice * 100) / 100}`}</Text>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Acciones Totales</Text>
                    <Text style={styles.cardValue}>{`${data.TotalStocks}`}</Text>
                </View>
            </View>

            <View style={styles.amountOwedContainer}>
                <Text style={styles.amountOwedText}>{`Cantidad Adeudada: L${Math.round(data.amountOwed * 100) / 100}`}</Text>
            </View>

            {/* Aquí se definen las tarjetas de los detalles con íconos */}
            {[
                { title: 'Cantidad tomada', value: data.amountTaken, icon: 'cash' },
                { title: 'Tasa de interés por pago atrasado', value: `${data.latePaymentInterestRate}%`, icon: 'percent' },
                { title: 'Tasa de interés del préstamo', value: `${data.loanInterestRate}%`, icon: 'finance' },
                { title: 'Fecha del próximo pago', value: data.nextPaymentDate, icon: 'calendar' },
                { title: 'Pagos pendientes', value: data.pendingPayments, icon: 'alert' },
                { title: 'Inversión total', value: data.totalInvestment, icon: 'bank' },
                { title: 'Ganancia de Caja', value: data.gananciaDeCaja, icon: 'trending-up' },
            ].map((item, index) => (
                <View style={styles.detailContainer} key={index}>
                    <Icon name={item.icon} size={40} color="#4caf50" style={styles.detailIcon} />
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailTitle}>{item.title}</Text>
                        <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                </View>
            ))}

            {/* Sección de solicitudes pendientes */}
            {isAdmin && pendingRequests.length > 0 && (
                <View>
                    <Text style={styles.jumbotronText}>Solicitudes Pendientes</Text>
                    {pendingRequests.map((item, index) => (
                    <View style={styles.requestCard} key={index}>
                        {/* Request Details */}
                        <View style={styles.requestDetails}>
                        <Text style={styles.requestText}>{`Solicitante: ${item.userName}`}</Text>
                        <Text style={styles.requestType}>{`Tipo: ${item.requestType}`}</Text>
                        {item.loanAmount && (
                            <Text style={styles.requestAmount}>{`Monto: L${item.loanAmount}`}</Text>
                        )}
                        <Text style={styles.requestStatus}>{`Estado: ${item.status}`}</Text>
                        </View>

                        {/* Rejection Reason Input */}
                        <TextInput
                        style={styles.rejectReasonInput}
                        onChangeText={(text) => handleRejectionTextChange(text, index)}
                        value={rejectionTexts[index] || ''}
                        placeholder="Razón del rechazo"
                        />

                        {/* Action Buttons */}
                        <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            onPress={() => {
                            setButtonDisabled(true);
                            handleAccept(item.id, item.requestType);
                            onRefresh();
                            }}
                            style={[styles.actionButton, buttonDisabled && styles.disabledButton]}
                            disabled={buttonDisabled}
                        >
                            <Text style={styles.buttonText}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleReject(item.id, item.requestType)}
                            style={[
                            styles.actionButton,
                            (!rejectionTexts[index]?.trim() || buttonDisabled) && styles.disabledButton,
                            ]}
                            disabled={!rejectionTexts[index]?.trim() || buttonDisabled}
                        >
                            <Text style={styles.buttonText}>Rechazar</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                </View>
                )}




            {/* Sección de botones para acciones */}
            <View style={styles.buttonContainer}>
                {actionsData.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => {
                            if (action === 'Solicitar préstamo') {
                                navigation.navigate('LoansPanel');
                            } else if (action === 'Comprar acciones') {
                                navigation.navigate('StockPanel');
                            } else if (action === 'Eventos' && isAdmin) {
                                navigation.navigate('AddMoneyToSavingsBox');
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>{action}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sección de solicitudes pasadas */}
            {pastRequests.length > 0 && (
                <View>
                    <Text style={styles.jumbotronText}>Solicitudes Pasadas</Text>
                    {pastRequests.map((item, index) => (
                        <View style={styles.pastRequestContainer} key={index}>
                            <Text style={styles.requestTitle}>{`Solicitud ${index + 1}: ${item.name}`}</Text>
                            <Text style={styles.requestDetails}>{`Tipo de solicitud: ${item.requestType}`}</Text>
                            <Text style={styles.requestDetails}>{`Estado: ${item.status}`}</Text>
                            {item.response && <Text style={styles.requestDetails}>{`Respuesta: ${item.response}`}</Text>}
                        </View>
                    ))}
                </View>
            )}

        </ScrollView>
    );
};

export default Dashboard;
