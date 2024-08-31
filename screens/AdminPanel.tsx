/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import styles from '../styles/AdminPanelStyle'; // Import the styles

type AdminPanelNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AdminPanel'
>;

type Props = {
  navigation: AdminPanelNavigationProp;
};

const AdminPanel = ({ navigation }: Props) => {
  const [savingsBoxes, setSavingsBoxes] = useState([]);
  const [selectedSavingsBox, setSelectedSavingsBox] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [membersDetails, setMembersDetails] = useState([]);
  const [totalSharesBought, setTotalSharesBought] = useState(0);
  const [totalMoneyInBoxes, setTotalMoneyInBoxes] = useState(0);
  const [showBoxDetails, setShowBoxDetails] = useState(true);

  useEffect(() => {
    const fetchSavingsBoxes = async () => {
      try {
        const savingsBoxesSnapshot = await firestore().collection('savingsBoxes').get();
        const savingsBoxesList = savingsBoxesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavingsBoxes(savingsBoxesList);

        // Calculate total shares bought and total money in boxes
        let totalShares = 0;
        let totalMoney = 0;
        savingsBoxesList.forEach(box => {
          totalShares += box.TotalStocks || 0;
          totalMoney += box.totalInvestmentToAdd || 0;
        });
        setTotalSharesBought(totalShares);
        setTotalMoneyInBoxes(totalMoney);
      } catch (error) {
        console.error("Error fetching savings boxes: ", error);
      }
    };

    fetchSavingsBoxes();
  }, []);

  const handleSavingsBoxPress = async (savingsBox) => {
    setSelectedSavingsBox(savingsBox);
    setModalVisible(true);
    setShowBoxDetails(true);

    // Fetch member details
    const memberDetailsPromises = savingsBox.members.map(async (memberId) => {
      const memberDoc = await firestore().collection('userDetails').doc(memberId).get();
      return memberDoc.data();
    });

    const membersDetails = await Promise.all(memberDetailsPromises);
    setMembersDetails(membersDetails);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSavingsBox(null);
    setMembersDetails([]);
  };

  const toggleDetails = () => {
    setShowBoxDetails(!showBoxDetails);
  };

  const renderSavingsBox = ({ item }) => (
    <TouchableOpacity onPress={() => handleSavingsBoxPress(item)} style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const formatDate = (date) => {
    if (date && date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    return date;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cajas de Ahorro</Text>
      <View style={styles.circleTwo}/>
      <View style={styles.circle}/>
      <FlatList
        data={savingsBoxes}
        renderItem={renderSavingsBox}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      {selectedSavingsBox && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.modalScroll}>
                {showBoxDetails ? (
                  <>
                    <Text style={styles.modalTitle}>{selectedSavingsBox.name}</Text>
                    <Text>ID: {selectedSavingsBox.id}</Text>
                    <Text>Dinero en caja: {selectedSavingsBox.efectivoEnCaja}</Text>
                    <Text>Total de acciones: {selectedSavingsBox.TotalStocks}</Text>
                    <Text>Precio de acción: {selectedSavingsBox.actionPrice}</Text>
                    <Text>Administrador: {selectedSavingsBox.administrator}</Text>
                    <Text>Fecha de inicio: {formatDate(selectedSavingsBox.startDate)}</Text>
                    <Text>Fecha de fin: {formatDate(selectedSavingsBox.endDate)}</Text>
                    <Text>Tasa de interés por pago tardío: {selectedSavingsBox.latePaymentInterestRate}%</Text>
                    <Text>Tasa de interés de préstamo: {selectedSavingsBox.loanInterestRate}%</Text>
                    <Text>Inversión total a agregar: {selectedSavingsBox.totalInvestmentToAdd}</Text>
                  </>
                ) : (
                  membersDetails.length > 0 ? (
                    membersDetails.map((member, index) => (
                      <View key={index}>
                        <Text>Nombre: {member.name}</Text>
                        <Text>Deuda: {member.amountOwed}</Text>
                        <Text>Cantidad tomada: {member.amountTaken}</Text>
                        <Text>Activo: {member.isActive ? 'Sí' : 'No'}</Text>
                        <Text>Administrador: {member.isAdmin ? 'Sí' : 'No'}</Text>
                        <Text>Siguiente pago: {formatDate(member.nextPaymentDate)}</Text>
                        <Text>Pagos pendientes: {member.pendingPayments}</Text>
                        <Text>Acciones compradas esta semana: {member.sharesBoughtThisWeek}</Text>
                        <Text>Inversión total: {member.totalInvestment}</Text>
                      </View>
                    ))
                  ) : (
                    <Text>No hay miembros</Text>
                  )
                )}
              </ScrollView>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={toggleDetails} style={styles.modalButton}>
                  <Text style={styles.buttonText}>
                    {showBoxDetails ? 'Ver Usuarios' : 'Ver Caja'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <View style={styles.statisticsContainer}>
        <Text style={styles.statisticsText}>Total de acciones compradas: {totalSharesBought}</Text>
        <Text style={styles.statisticsText}>Total de dinero en cajas: {totalMoneyInBoxes}</Text>
      </View>
    </View>
  );
};

export default AdminPanel;
