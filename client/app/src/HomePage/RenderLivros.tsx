import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../ApiConfigs/ApiRoute';
import { SafeAreaView } from 'react-native-safe-area-context';

const RenderLivros = ({navigation, categoria}) => {
  
    const toast = useToast();
    const [livros, setLivros] = useState([]);

    useEffect(() => {
        const fetchLivros = async () => {
            const cookie = await AsyncStorage.getItem('Cookie');
            if (cookie === null) navigation.navigate('Login');
            
            const data = {
                categoria:categoria
            }
            api.post('livros/get-by-categoria/', data, {
                headers:{
                    "Cookie":cookie
                }
            })
            .then(response => {
            setLivros(response.data);
            })
            .catch(error => {
                toast.show("Falha ao tentar buscar os livros", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
            })
        }

        fetchLivros();
    }, [])

    const livrosList = () => {
        if (livros && livros.length > 0) {
            return (
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {livros.map((livro) => {
                            return (
                                <View key={livro.id} style={styles.livroItem}>
                                    <Text style={styles.livroNome}>{livro.nome}</Text>
                                    <Text>{livro.preco}</Text>
                                    <Text>{livro.estoque}</Text>
                                    <Text>{livro.isbn}</Text>
                                    <Text>{livro.categoria}</Text>
                                    <Text>{livro.nome_autor}</Text>
                                    <Text>{livro.data_lancamento}</Text>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            );
        } else {
            return (
                <View>
                    <Text>Nada para mostrar no momento....</Text>
                </View>
            );
        }
    };
    

    return (
        <SafeAreaView>
            <View>
                {livrosList()}
            </View>
        </SafeAreaView>
  )
}

export default RenderLivros

const styles = StyleSheet.create({})