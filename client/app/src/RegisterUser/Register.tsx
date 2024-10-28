import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../ApiConfigs/ApiRoute";
import { useToast } from 'react-native-toast-notifications'
export default function Register({ navigation }) {
    
    const toast = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function tryRegister() {
        const dataLogin = new URLSearchParams(); 
    
        dataLogin.append('username', username); 
        dataLogin.append('password', password);
        
        api.post('playground/auth/login/', dataLogin, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
        })
        .then(response => {
            if (response.status === 200) {
                navigation.navigate("Login");
                toast.show("Succefully register", {
                    type: "success",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
            }
            else{
                toast.show("Error during register, try again later", {
                    type: "warning",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });    
            }
        })
        .catch(error => {
            toast.show("Error during register, try again later", {
                type: "warning",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
            });
        })
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.box}>
                    <TextInput
                        style={styles.field}
                        placeholder="Create your user"
                        placeholderTextColor={'white'}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        keyboardType="default"
                    />
                    <TextInput
                        style={styles.field}
                        placeholder="Create your password"
                        placeholderTextColor={'white'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.buttonLogin} onPress={tryRegister}>
                        <Text style={styles.textButtonLogin}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Dark background for the entire screen
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
    },
    innerContainer: {
        width: '100%', // Ensures the inner container uses full width
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        backgroundColor: '#1E1E1E', // Slightly lighter black for the input box
        borderRadius: 10,
        padding: 30,
        elevation: 5,
        alignItems: 'center',
        width: '90%', // Optional: Set a max width for the box
    },
    field: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        padding: 15,
        fontSize: 16,
        color: 'white', 
        backgroundColor: '#2B2B2B',
    },
    buttonLogin: {
        width: '100%',
        backgroundColor: '#007BFF', // Bright blue for the login button
        borderRadius: 10,
        padding: 15,
        marginVertical: 20,
    },
    buttonForgot: {
        marginTop: 10,
        padding: 10,
    },
    textButtonLogin: {
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
    },
    textButtonForgot: {
        textAlign: 'center',
        color: '#B0BEC5', // Light gray for "forgot password" text
        fontSize: 14,
    },
});
