/* eslint-disable prettier/prettier */
// Register.tsx
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TextInput, Button, Switch, KeyboardAvoidingView, Platform, BackHandler, ToastAndroid} from 'react-native';

import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
          <Text style={styles.inputTitle}>Nuevo Grupo de ahorro</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isNewBox}
              onValueChange={setIsNewBox}
              style={styles.switch}
            />
            <Text style={styles.label}>Estoy creando nueo grupo de Ahorro?</Text>
          </View>
          {isNewBox ? (
            <View>
              <Text style={styles.inputTitle}>Nombre de la Caja de Ahorro</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la caja de Ahorro"
                placeholderTextColor="#A69E9E"
                value={savingsBoxName}
                onChangeText={setSavingsBoxName}
              />
            </View>
          ) : (
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
          )}
          <View style={styles.button}>
          <Button
        title="Registrarse"
        disabled={!(savingsBoxId || savingsBoxName)}
        onPress={() => {
          firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            userCredential.user.updateProfile({
              displayName: name,
            });
            const userId = userCredential.user.uid;

            if (isNewBox) {
              firestore()
                .collection('savingsBoxes')
                .doc(savingsBoxName)
                .set({
                  name: savingsBoxName,
                  administrator: userId,
                  members: [userId],
                })
                .then((docRef) => {
                  console.log('New savings box created');
                  firestore()
                    .collection('userDetails')
                    .doc(userId)
                    .set({
                      amountOwed: 0,
                      amountTaken: 0,
                      nextPaymentDate: null,
                      pendingPayments: 0,
                      sharesBoughtThisWeek: 0,
                      totalInvestment: 0,
                      savingsBoxId: savingsBoxName,
                      isAdmin: true,
                      isActive: true,
                    })
                    .catch((error) => {
                      console.log('Error creating user details:', error);
                    });
                  firestore()
                    .collection('userDetails')
                    .doc(userId)
                    .set({
                      amountOwed: 0,
                      amountTaken: 0,
                      nextPaymentDate: null,
                      pendingPayments: 0,
                      sharesBoughtThisWeek: 0,
                      totalInvestment: 0,
                      savingsBoxId: savingsBoxName,
                      isAdmin: true,
                      isActive: true,
                    })
                    .then(() => {
                      navigation.navigate('RegisterOrg', { userId });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log('Error creating new savings box:', error);
                });
            } else {
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
                      console.log('usuario agregado a la caja de ahorro existente');
                      firestore()
                        .collection('userDetails')
                        .doc(userId)
                        .set({
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
                        .catch((error) => {
                          console.log('Error creating user details:', error);
                        });
                      firestore()
                        .collection('userDetails')
                        .doc(userId)
                        .set({
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
                          navigation.navigate('Dashboard');
                        })
                        .catch((error) => {
                          console.log('Error actualizando usuario con caja de ahorro:', error);
                        });
                    })
                    .catch((error) => {
                      console.log('Error al agregar usario a caja de ahorro', error);
                    });
                } else {
                  console.log('No hay una caja de ahorro con ese nombre');
                }
              });
            }
            console.log('Usuario creado');
          })
          .catch((error) => {
            console.log(error);
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
