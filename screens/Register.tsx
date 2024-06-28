/* eslint-disable prettier/prettier */
// Register.tsx
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TextInput, Button, Switch, KeyboardAvoidingView, Platform, BackHandler, ToastAndroid, Alert} from 'react-native';

import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { requestJoinSavingsBox } from '../services/PetitionService';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Register = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savingsBoxId, setSavingsBoxId] = useState('');
  const [savingsBoxName, setSavingsBoxName] = useState('');
  const [isNewBox, setIsNewBox] = useState(false);
  const [doubleBackToExitPressedOnce, setDoubleBackToExitPressedOnce] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    const backAction = () => {
      if (doubleBackToExitPressedOnce) {
        BackHandler.exitApp();
      } else {
        setDoubleBackToExitPressedOnce(true);
        ToastAndroid.show('Presione de nuevo para salir', ToastAndroid.SHORT);

        setTimeout(() => {
          setDoubleBackToExitPressedOnce(false);
        }, 2000);

        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [doubleBackToExitPressedOnce]);
  useEffect(() => {
    const fetchSavingsBoxes = async () => {
      try {
        const snapshot = await firestore().collection('savingsBoxes').get();
        const savingsBoxes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(savingsBoxes);
      } catch (error) {
        console.error('Error fetching savings boxes:', error);
      }
    };

    fetchSavingsBoxes();
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.circleTwo}/>
              <View style={styles.circle}/>
        <Text style={styles.title}>Mi Registro</Text>
        <View style={styles.registerContainer}>

          <Text style={styles.inputTitle}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#A69E9E"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputTitle}>Correo Electronico</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A69E9E"
              value={email}
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text.toLowerCase())}
            />

            <Text style={styles.inputTitle}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#A69E9E"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <View>
              <Text style={styles.inputTitle}>ID de la Caja de Ahorro</Text>
              <TextInput
                style={styles.input}
                placeholder="ID de la caja de Ahorro"
                placeholderTextColor="#A69E9E"
                value={savingsBoxId}
                onChangeText={setSavingsBoxId}
              />
            </View>
          <View style={styles.button}>
          <Button
        title="Registrarse"
        disabled={!(savingsBoxId)}
        onPress={() => {
          firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            userCredential.user.updateProfile({
              displayName: name,
            });
            const userId = userCredential.user.uid;
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
            console.log('Usuario creado');
          })
          .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert('Error', 'Este correo ya esta en uso.', [
                {
                  text: "OK",
                  onPress: () => navigation.navigate('Login'),
                },
              ]);
            } else {
              console.log(error);
            }
          });
      }}
    />
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
};
export default Register;
