import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../ApiConfigs/ApiRoute";
import { useToast } from 'react-native-toast-notifications'
export default function Login({ navigation }) {
    
    const toast = useToast();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function storeData(response){
        const stringSession = String(response.headers);
        const sessionId = stringSession.split(/[,;]\s*/).filter(str => str.startsWith('sessionid='));
        if (sessionId && sessionId.length > 0)
        {
            try{
                AsyncStorage.setItem('Cookie', sessionId[0])
                navigation.navigate("Home");
            } catch (error) {
                toast.show("Falha ao tentar salvar os dados da sessão", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
            }
        }
        else{
            toast.show("Falha ao tentar salvar os dados da sessão", {
                type: "danger",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
            });
        }
    }

    async function tryLogin() {
        const dataLogin = new URLSearchParams(); 
    
        dataLogin.append('username', username); 
        dataLogin.append('password', password);
        
        api.post('auth/login/', dataLogin, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 
            },
        })
        .then(response => {
            if (response.status === 200) storeData(response);
            else{
                toast.show("undetected error", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });  
            }
        })
        .catch(error => {
            if (error.response)
            {
                if (error.response.status === 500)
                {
                    toast.show("Incorrect password or username", {
                        type: "warning",
                        placement: "top",
                        duration: 4000,
                        animationType: "slide-in",
                    }); 
                }
                else{
                    toast.show("undetected error", {
                        type: "danger",
                        placement: "top",
                        duration: 4000,
                        animationType: "slide-in",
                    });
                }
            }
            else{
                toast.show("Connection error", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
            }
        })
    }
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.box}>
                    <TextInput
                        style={styles.field}
                        placeholder="Type your login"
                        placeholderTextColor={'white'}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        keyboardType="default"
                    />
                    <TextInput
                        style={styles.field}
                        placeholder="Type your password"
                        placeholderTextColor={'white'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.buttonLogin} onPress={tryLogin}>
                        <Text style={styles.textButtonLogin}>Log in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonForgot} onPress={() => navigation.navigate("Register")}>
                        <Text style={styles.textButtonForgot}>Doesn't have an account yet?</Text>
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
