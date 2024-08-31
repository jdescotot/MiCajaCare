/* eslint-disable prettier/prettier */
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF', // Fondo blanco para un look más limpio
    },
    listItem: {
        fontSize: 16,
        color: '#333333', // Un color oscuro pero suave para el texto
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#F9F9F9', // Fondo claro para el input
        marginVertical: 10,
    },
    slider: {
        width: '100%',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#FF5722', // Color fuerte y destacado para los botones
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
