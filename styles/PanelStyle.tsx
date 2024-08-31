/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: windowWidth - 40,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    color: '#e36f1e',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    fontSize: 16,
  },
  inputWhite: {
    height: 100,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e36f1e',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    marginBottom: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
    color: '#e36f1e',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    width: windowWidth - 80,
    borderColor: '#ddd',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#e36f1e',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#ff4c4c',
  },
  slider: {
    width: windowWidth - 40,
    height: 40,
    marginBottom: 20,
  },
});

export default styles;
