/* eslint-disable prettier/prettier */
import {StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
    color: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'white',
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  inputWhite: {
    height: 40,
    borderColor: 'black',
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    color: 'black',
  },
  button: {
    backgroundColor: '#f9f9f9',
    padding: 5,
    marginBottom: 16,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#f9f9f9',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#f9f9f9',
    padding: 5,
    marginBottom: 16,
  },
  TextInput: {
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
},
slider: {
  width: windowWidth - 22,
  height: 70,
  color: 'white',
},
sliderValue: {
  fontSize: 24,
  color: 'white',
  textAlign: 'center',
},
});

export default styles;
