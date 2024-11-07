import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../ApiConfigs/ApiRoute';
import { SafeAreaView } from 'react-native-safe-area-context';

type Livro = {
  id: string,
  nome: string,
  preco: string,
  estoque: number,
  isbn: string,
  categoria: string,
  nome_autor: string,
  data_lancamento: string,
  imagem:string
};

function formatToBRL(number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number);
  }
  

const RenderLivros = ({navigation, categoria}) => {
  
    const toast = useToast();
    const [livros, setLivros] = useState<Livro[]>([]);

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
              <FlatList
                  data={livros}
                  horizontal={true}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item: livro }) => (
                      <View key={livro.id} style={{ margin: 10, borderColor: 'lightgray', borderWidth: 1, borderRadius: 8, padding: 10, width: 150 }}>
                          <Pressable onPress={() => navigation.navigate('LivroDetails', { id: livro.id })}>
                              {livro.imagem &&  (
                                  <Image
                                      source={{ uri: livro.imagem }}
                                      style={{ width: '100%', height: 100, borderRadius: 8 }}
                                      resizeMode="cover"
                                  />
                              )}
                              <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{livro.nome}</Text>
                              <Text style={{fontWeight:'bold', marginTop: 5 }}>Estoque: {livro.estoque}</Text>
                              <Text style={{ marginTop: 5 }}>{formatToBRL(livro.preco)}</Text>
                          </Pressable>
                      </View>
                  )}
                  showsHorizontalScrollIndicator={false}
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