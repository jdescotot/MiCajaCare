/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e36f1e',
  },
  upperContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
    padding: 16,
    marginBottom: '50%',
  },
  secondcontainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'lightgrey',
  },
  numberText: {
    fontSize: 48,
    color: '#000000',
    textAlign: 'center',
    backgroundColor: '#e36f1e',
  },
  title: {
    fontSize: 44,
    marginBottom: 26,
    color: '#000000', // Changed color to black
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'grey',
    padding: 5,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Changed color to black
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  centeredView:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#000000', // Changed color to black
  },
  input:{
    height: 40,
    borderColor: 'white',
    backgroundColor: 'grey',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    color: '#000000', // Changed color to black
  },
});

export default styles;
