/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    innerContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        color: '#333333',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
        marginBottom: 20,
    },
    picker: {
        width: '100%',
        height: 50,
    },
    button: {
        backgroundColor: '#FF5722',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        color: '#333333',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 20,
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonCancel: {
        marginTop: 10,
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});
