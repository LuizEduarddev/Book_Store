import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../../../ApiConfigs/ApiRoute'
import { useToast } from 'react-native-toast-notifications'
import { SafeAreaView } from 'react-native-safe-area-context'
import RenderLivros from './RenderLivros'

const RenderCategorias = ({navigation}) => {
    
    const toast = useToast();
    const [categorias, setCategorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 

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
                setIsLoading(false); 
            })
            .catch(error => {
                toast.show("Falha ao tentar buscar as categorias", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    animationType: "slide-in",
                });
                setIsLoading(false); 
            })

        };

        fetchCategories(); 
    }, []);

    const renderCategorias = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" /> 
                    <Text>Loading....</Text>
                </View>
            );
        }

        if (categorias && categorias.length > 0) {
            return (
              <FlatList
                data={categorias}
                keyExtractor={(item) => item}
                renderItem={({ item: categoria }) => (
                  <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color:"orange" }}>{categoria}</Text>
                    <RenderLivros navigation={navigation} categoria={categoria} />
                  </View>
                )}
                nestedScrollEnabled={true}
              />
            );
          } else {
            return (
              <View>
                <Text style={{fontSize: 18, marginLeft: 10}}>Nada para mostrar no momento....</Text>
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

const styles = StyleSheet.create({
loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
});
