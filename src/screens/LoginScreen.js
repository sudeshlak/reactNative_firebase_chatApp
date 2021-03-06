import React, { useState, useContext } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import { View, StyleSheet } from 'react-native';
import { Title } from 'react-native-paper';
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
        fontSize: 22,
    },
    navButtonText: {
        fontSize: 16
    },
    error:{
        fontSize: 10,
        color:'red',
    }
});

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const { login } = useContext(AuthContext);
    const [password, setPassword] = useState('');
    const [error,setError]= useState('');

    const handleOnLogin = () =>{
        setError('')
        if(!email||!password){
            setError('Invalid password or email')
            return;
        }
        login(email, password)
    }

    return (
        <View style={styles.container}>
            <Title style={styles.titleText}>Welcome to SChat</Title>
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
                title="Login"
                modeValue="contained"
                labelStyle={styles.loginButtonLabel}
                onPress={() => handleOnLogin()}
            />
            <FormButton
                title="New user? Join here"
                modeValue="text"
                uppercase={false}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('Signup')}
            />
        </View>
    );
}