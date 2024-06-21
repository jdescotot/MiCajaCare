/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e8c7cc',
        color: 'black',
        padding: 15,
        borderRadius: 35,
    },
    containertwo: {
        backgroundColor: '#f2f2f2',
        color: 'black',
        padding: 15,
        borderRadius: 35,
    },
    headerRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'ligtgrey',
    },
    headerText: {
        fontWeight: 'bold',
    },
    cell: {
        flex: 1,
    },
    totalInvestment: {
        fontSize: 30,
        color: 'black',
        borderRadius: 15,
    },
    requestContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 25,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#e36f1e',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: 'white',
        marginBottom: 50,
    },
    requestButton: {
        width: '45%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    view: {
      padding: 10,
  },
    jumbotron: {
      padding: 20,
      margin: 10,
      backgroundColor: '#C7E8E3',
      borderRadius: 5,
      fontSize: 30,
      textAlign: 'center',
      color: 'black',
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: 'black',
},
touchableArea: {
    backgroundColor: '#e36f1e',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    color: 'black',
},
TextInput: {
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  rowEven: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
},
rowOdd: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f2f2f2',
},
input: {
    height: 40,
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 20,
  },
  spacer: {
    height: 75,
  },
  buttonComprarAcciones: {
    backgroundColor: '#e36f1e',
    padding: 10,
    margin: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'white',
},
});

export default styles;
