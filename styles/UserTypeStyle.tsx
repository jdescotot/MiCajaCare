/* eslint-disable prettier/prettier */
// RegisterStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
  },
  title: {
    fontSize: 74,
    marginBottom: 126,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#f9f9f9',
    padding: 5,
    marginBottom: 16,
  },
  camera: {
    // Add your desired styles for the camera here
    width: '100%',
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePicker: {
    // Add your desired styles for the datepicker here
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 50,
    width: 70,
    height: 70,
  },
  fullScreenCamera: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
