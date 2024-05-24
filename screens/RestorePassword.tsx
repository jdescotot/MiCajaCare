/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react';
import { Alert, TouchableOpacity, View, Text, TextInput, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';
import DatePicker from 'react-native-datepicker';
import styles from '../styles/UserTypeStyle';

const RestorePassword = () => {
const [phone, setPhone] = useState('');
const [id, setId] = useState('');
const [dateOfBirth, setDateOfBirth] = useState('');
const cameraRef = useRef<RNCamera | null>(null);
const [isCameraVisible, setIsCameraVisible] = useState(false);
const [photouri, setPhotoUri] = useState(null);
const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);

const handleTakePicture = async () => {
  if (cameraRef.current) {
    const options = { quality: 0.5, base64: true };
    const data = await cameraRef.current.takePictureAsync(options);
    console.log(`Photo URI: ${data.uri}`);
    Alert.alert('¿Está satisfecho con la foto?','',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        //{text: 'Sí', onPress: () => { setIsCameraVisible(false); setPhotoUri(data.uri); }},
      ],
    );
  }
};

const handleRestorePassword = async () => {
  setCameraType(RNCamera.Constants.Type.front);
  setIsCameraVisible(true);
  if (cameraRef.current) {
    try {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(`Photo URI: ${data.uri}`);
      console.log(`Restoring password for phone: ${phone}, id: ${id}, date of birth: ${dateOfBirth}`);
    } catch (error) {
      console.log('Front camera is not available');
      setCameraType(RNCamera.Constants.Type.back);
    }
  }
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restore Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPhone}
        value={phone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        onChangeText={setId}
        value={id}
        placeholder="ID"
      />
      <DatePicker
        style={styles.datePicker}
        date={dateOfBirth}
        mode="date"
        placeholder="Date of Birth"
        format="YYYY-MM-DD"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        onDateChange={setDateOfBirth}
      />
      {isCameraVisible ? (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.fullScreenCamera}
            type={cameraType}
          />
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}/>
        </>
      ) : (
        <Button title="Restore Password" onPress={handleRestorePassword} />
      )}
    </View>
  );
};
export default RestorePassword;
