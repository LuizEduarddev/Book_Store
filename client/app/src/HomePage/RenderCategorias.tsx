import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../ApiConfigs/ApiRoute'
import { useToast } from 'react-native-toast-notifications'
import { SafeAreaView } from 'react-native-safe-area-context'
import RenderLivros from './RenderLivros'

const RenderCategorias = ({navigation}) => {
    
    const toast = useToast();
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        
        const fetchCategories = async () => {
            const cookie = await AsyncStorage.getItem('Cookie');
            if (cookie === null) {
                navigation.navigate('Login'); 
                return; 
            }
            
            api.get('livros/categorias/', {
                headers: {
                    "Cookie": cookie 
                },
            })
            .then(response => {
                setCategorias(response.data);
                console.log(response.data);
            })
            .catch(error => {
                toast.show("Falha ao tentar buscar as categorias", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
            })

        };

        fetchCategories(); 
    }, []);

    const renderCategorias = () => {
        if (categorias && categorias.length > 0) {
            return (
                <FlatList
                    data={categorias}
                    keyExtractor={(item) => item}
                    renderItem={({ item: categoria }) => (
                        <View>
                            <Pressable>
                                <Text>{categoria}</Text>
                                <RenderLivros navigation={navigation} categoria={categoria} />
                            </Pressable>
                        </View>
                    )}
                    nestedScrollEnabled={true}
                />
            );
        } else {
            return (
                <View>
                    <Text>Nada para mostrar no momento....</Text>
                </View>
            );
        }
    }

    return (
        <SafeAreaView>
            {renderCategorias()}
        </SafeAreaView>
  )
}

export default RenderCategorias

const styles = StyleSheet.create({})