/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
  },
  title: {
    fontSize: 64,
    marginBottom: 126,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#e36f1e',
    padding: 5,
    marginBottom: 26,
    marginTop: 26,
    borderRadius: 20,
  },
  bacbutton: {
    padding: 5,
    marginTop: 56,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  olvieContrasenia: {
    color: '#f9f9f9',
  },
  inputTitle: {
    color: '#000',
    marginBottom: 4,
    marginTop: 19,
  },
  spacer: {
    height: 75,
  },
  loginContainer: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 16,
  },
  forgotPassword: {
    color: 'blue',
    marginBottom: 16,
    marginTop: 38,
    textAlign: 'center',
  },
  circle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 500,
    backgroundColor: '#FADADD',
    right: 150,
    top: 225,
  },
  circleTwo: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 600,
    backgroundColor: '#AEC6CF',
    right: -80,
    top: 475,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    height: '30%',
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: '#e36f1e',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default styles;
