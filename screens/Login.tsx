/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Modal, ScrollView } from 'react-native';
import styles from '../styles/LoginStyle';
import { firebase } from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/RootStackParams';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Dejó espacios en blanco");
      return;
    }

    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      await AsyncStorage.setItem('userEmail', email);
      console.log(email, password);
      const userId = userCredential.user.uid;
      const userDetailsDoc = await firestore().collection('userDetails').doc(userId).get();
      console.log(userDetailsDoc.data());
      console.log(userDetailsDoc.data().savingsBoxId);
      if (userDetailsDoc.exists && userDetailsDoc.data().savingsBoxId) {
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('JoinSavingsBox');
      }
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert("Contraseña incorrecta, intente de nuevo");
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert("Usuario no encontrado, verifique el correo electrónico");
      } else if (error.code === 'auth/network-request-failed') {
        Alert.alert("Error de red, verifique su conexión a internet");
      } else {
        Alert.alert("Error al iniciar sesión, intente de nuevo");
      }
    }
  };

  const handleAdminAccess = () => {
    if (adminPassword.toLowerCase() === 'carehn') {
      setModalVisible(false);
      navigation.navigate('AdminPanel');
    } else {
      Alert.alert("Contraseña incorrecta");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso</Text>
      <View style={styles.circleTwo}/>
      <View style={styles.circle}/>
      <View style={styles.loginContainer}>
        <Text style={styles.inputTitle}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input]}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Correo Electrónico"
          placeholderTextColor="#A69E9E"
          autoCapitalize="none"
        />
        <Text style={styles.inputTitle}>Contraseña</Text>
        <TextInput
          style={[styles.input]}
          onChangeText={setPassword}
          value={password}
          placeholder="Contraseña"
          placeholderTextColor="#A69E9E"
          secureTextEntry={true}
        />
        <View style={styles.spacer} />
        <Button  title="Ingresar" onPress={handleLogin} />
        <TouchableOpacity onPress={() => navigation.navigate('RegisterAdmin')}>
          <Text style={styles.forgotPassword}>Soy un administrador</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.forgotPassword}>Ir al panel de care</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalTitle}>Ingrese la contraseña de administrador</Text>
              <TextInput
                style={styles.input}
                onChangeText={setAdminPassword}
                value={adminPassword}
                placeholder="Contraseña"
                placeholderTextColor="#A69E9E"
                secureTextEntry={true}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.modalButton} onPress={handleAdminAccess}>
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Login;
