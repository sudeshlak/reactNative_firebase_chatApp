import React, { useState, useContext } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import { View, StyleSheet } from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 24,
        marginBottom: 10
    },
    loginButtonLabel: {
        fontSize: 22
    },
    navButtonText: {
        fontSize: 18
    },
    navButton: {
        marginTop: 10
    },
    error:{
        fontSize: 10,
        color:'red',
    }
});

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const [error,setError]= useState('');

    function handleOnRegister() {
        setError('');
        if(!email||password){
            setError('Invalid password or email')
            return;
        }
        register(email, password)
    }

    return (
        <View style={styles.container}>
            <Title style={styles.titleText}>Register to chat</Title>
            <FormInput
                labelName="Email"
                value={email}
                autoCapitalize="none"
                onChangeText={userEmail => setEmail(userEmail)}
            />
            <FormInput
                labelName="Password"
                value={password}
                secureTextEntry={true}
                onChangeText={userPassword => setPassword(userPassword)}
            />
            <Title style={styles.error}>
                {error}
            </Title>
            <FormButton
                title="Signup"
                modeValue="contained"
                labelStyle={styles.loginButtonLabel}
                onPress={() => handleOnRegister()}
            />
            <IconButton
                icon="backspace"
                size={30}
                style={styles.navButton}
                color="#6646ee"
                onPress={() => navigation.goBack()}
            />
        </View>
    );
}