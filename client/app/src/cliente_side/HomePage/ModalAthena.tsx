import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

const ModalAthena = ({ navigation, setModal, setSafeRequest }) => {
  
    const toast = useToast();
    const [prompt, setPrompt] = useState('')
    const [loading, setLoading] = useState(false);
    const [textRequest, setTextRequest] = useState('');
    const [idLivro, setIdLivro] = useState('');
    const [book, setBook] = useState('');

    const setWholeData = async (response) => {
        const cleanedData = response.replace(/```(?:json)?|```/g, '').trim();
        
        const parsedLog: { text: string; id_book: string} = JSON.parse(cleanedData);
        
        const cleanText = parsedLog.text.replace(/\*.*?\*/, '').trim();

        setTextRequest(cleanText);

        if (parsedLog.id_book !== null && parsedLog.id_book !== undefined)
        {
            const match = parsedLog.text.match(/\*(.*?)\*/);
            const bookName = match ? match[1] : null;

            setIdLivro(parsedLog.id_book);
            setBook(bookName);
        }
        
    }

    const tryGetResult = async () => {
        setLoading(true);
        api.get('athena/prompt', {
            headers:{
                prompt
            }
        })
        .then(response => {
            try
            {
                setWholeData(response.data);
                setLoading(false); 
            }
            catch(error) 
            {
                toast.show('Something goes wrong..', {
                    type: 'warning',
                    placement: 'top',
                    duration: 2000,
                    animationType: 'slide-in',
                }); 
            }
        })
        .catch(error => {
            toast.show('Erro trying to get the result from athena', {
                type: 'warning',
                placement: 'top',
                duration: 1000,
                animationType: 'slide-in',
            });
        })
    }

    return (
    <View>
        <View style={styles.header}>
            <TextInput
                placeholder="Type a prompt to Athena"
                placeholderTextColor={'gray'}
                value={prompt}
                onChangeText={setPrompt}
                style={styles.prompt}
            />
            <Pressable style={styles.buttonSearch} onPress={() => tryGetResult()}>
                <AntDesign name="search1" size={25} color="white" />
            </Pressable>
        </View>

        {loading === false && textRequest !== '' ?(
            <View style={styles.responseContainer}>
                <Text>{textRequest}</Text>
                {idLivro !== '' ? (
                    <Pressable onPress={() => {
                        setModal(false); // Close the modal
                        setSafeRequest(true); // Set safeRequest to true
                        navigation.navigate('LivroDetails', { id: idLivro });
                    }}>
                        <Text style={styles.textButton}>{book}</Text>
                    </Pressable>
                ):(<></>)}
            </View>
        ):<></>}
        
        {loading === true ? (
            <View style={styles.loadingResult}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Processing.....</Text>
            </View>
        ):(<></>)}
        
    </View>
  )
}

export default ModalAthena

const styles = StyleSheet.create({
    header:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:'100%'
    },
    prompt:{
        borderColor:'orange',
        borderWidth:1,
        width:'75%',
        borderRadius:15,
        padding:10
    },
    buttonSearch:{
        backgroundColor: 'orange',
        borderRadius: 10,
        padding: 5,
        justifyContent: 'center', 
        alignItems: 'center',
        width:'20%'
    },
    loadingResult:{
        marginTop:20,
        alignItems:'center'
    },
    responseContainer:{
        borderColor:'orange',
        borderRadius:15,
        borderWidth:1,
        padding:10,
        marginTop:10
    },
    textButton:{
        fontWeight:'900',
        textDecorationLine:'underline'
    }
})
