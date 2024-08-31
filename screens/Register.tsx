/* eslint-disable prettier/prettier */
// Register.tsx
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TextInput, Button, Switch, KeyboardAvoidingView, Platform, BackHandler, ToastAndroid, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import styles from '../styles/RegisterStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { requestJoinSavingsBox } from '../services/PetitionService';
import { registerUser } from '../services/RegisterUser';

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
  const [savingsBoxes, setSavingsBoxes] = useState([]);
  const [sex, setSex] = useState('');

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
        const fetchedSavingsBoxes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSavingsBoxes(fetchedSavingsBoxes);
        console.log(fetchedSavingsBoxes);
      } catch (error) {
        console.error('Error fetching savings boxes:', error);
      }
    };

    fetchSavingsBoxes();
  }, []);

  const handleRegister = () => {
    const boxExists = savingsBoxes.some(box => box.id === savingsBoxId);
    if (!boxExists) {
      Alert.alert('Error', 'La caja de ahorro no existe.');
      return;
    }
    registerUser(email, password, name, savingsBoxId, navigation, setModalVisible);
  };

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

            <Text style={styles.inputTitle}>Sexo</Text>
            <Picker
              selectedValue={sex}
              style={styles.input}
              onValueChange={(itemValue) => setSex(itemValue)}
            >
              <Picker.Item label="Seleccione su sexo" value="" />
              <Picker.Item label="Masculino" value="male" />
              <Picker.Item label="Femenino" value="female" />
              <Picker.Item label="Otro" value="other" />
            </Picker>

            <View>
              <Text style={styles.inputTitle}>ID de la Caja de Ahorro</Text>
              <TextInput
                style={styles.input}
                placeholder="ID de la caja de Ahorro"
                placeholderTextColor="#A69E9E"
                value={savingsBoxId}
                onChangeText={(text) => setSavingsBoxId(text.toLowerCase().replace(/\s+/g, ''))}
              />
            </View>
          <View style={styles.button}>
          <Button
              title="Registrarse"
              disabled={!(savingsBoxId)}
              onPress={handleRegister}
            />
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
};
export default Register;
