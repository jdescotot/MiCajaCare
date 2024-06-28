/* eslint-disable prettier/prettier */
// RegisterAdmin.tsx
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

const RegisterAdmin = ({ navigation }: Props) => {
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
        <Text style={styles.title}>Admin</Text>
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
              <Text style={styles.inputTitle}>Nombre de la Caja de Ahorro</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la caja de Ahorro"
                placeholderTextColor="#A69E9E"
                value={savingsBoxName}
                onChangeText={setSavingsBoxName}
              />
            </View>
          <View style={styles.button}>
          <Button
        title="Registrarse"
        disabled={!(savingsBoxName)}
        onPress={() => {
            firestore()
            .collection('savingsBoxes')
            .get()
            .then((querySnapshot) => {
              const existingNames = querySnapshot.docs.map((doc) => doc.data().name);


              if (existingNames.includes(savingsBoxName)) {

                Alert.alert('Error', 'El nombre de la caja de ahorro ya existe. Por favor, elija otro nombre.');
              } else {

                firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                  userCredential.user.updateProfile({
                    displayName: name,
                  });
                  const userId = userCredential.user.uid;

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
                            name: name,
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
                            name: name,
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
                        Alert.alert('Error', 'Hubo un error al crear la caja de ahorro. Por favor, intente de nuevo.');
                      });
                  console.log('Usuario creado');
                })
                .catch((error) => {
                  if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Error', 'Este correo ya esta en uso por otra cuenta.');
                  } else {
                    console.log(error);
                  }
                });
              }
            })
            .catch((error) => {
              console.log('Error fetching savings boxes:', error);
              Alert.alert('Error', 'Hubo un error al buscar la caja de ahorro. Revise los nombres sean correctos.');
            });

      }}
    />
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
};
export default RegisterAdmin;
