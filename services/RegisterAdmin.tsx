/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TextInput, Button, Switch, KeyboardAvoidingView, Platform, BackHandler, ToastAndroid, Alert} from 'react-native';

import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { requestJoinSavingsBox } from '../services/PetitionService';

const RegisterAdmin = (savingsBoxId: string, userId: string, name: string, setModalVisible: (visible: boolean) => void, navigation: StackNavigationProp<RootStackParamList>) => {
    if (savingsBoxId) {
        firestore()
          .collection('savingsBoxes')
          .doc(savingsBoxId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log(`Savings Box ID: ${doc.id}, Name: ${doc.data().name}`);
              firestore()
                .collection('savingsBoxes')
                .doc(savingsBoxId)
                .update({
                  members: firestore.FieldValue.arrayUnion(userId),
                })
                .then(() => {
                  console.log('User added to the existing savings box');
                  firestore()
                    .collection('userDetails')
                    .doc(userId)
                    .set({
                      name: name,
                      amountOwed: 0,
                      amountTaken: 0,
                      nextPaymentDate: null,
                      pendingPayments: 0,
                      sharesBoughtThisWeek: 0,
                      totalInvestment: 0,
                      savingsBoxId: savingsBoxId,
                      isAdmin: false,
                      isActive: false,
                    })
                    .then(() => {
                      requestJoinSavingsBox(userId, savingsBoxId, name, setModalVisible)
                        .then(() => {
                          console.log('Request to join savings box created');
                          navigation.navigate('Dashboard');
                        })
                        .catch((error) => {
                          console.error('Error creating request to join savings group:', error);
                        });
                    })
                    .catch((error) => {
                      console.log('Error creating user details:', error);
                    });
                })
                .catch((error) => {
                  console.log('Error adding user to savings box', error);
                });
            } else {
              console.log('No hay una caja de Ahorro con ese nombre');
              Alert.alert('No hay una caja de Ahorro con ese nombre');
            }
          });
      } else {
        console.log('No savingsBoxId provided');
      }
};
export default RegisterAdmin;
