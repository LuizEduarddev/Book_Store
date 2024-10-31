import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

type Livro = {
  id: string;
  nome: string;
  preco: string;
  estoque: number;
  isbn: string;
  categoria: string;
  nome_autor: string;
  data_lancamento: string;
};


const LivroDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const toast = useToast();
  const [livro, setLivro] = useState<Livro>();

  useEffect(() => {
    const fetchLivros = async () => {
      const cookie = await AsyncStorage.getItem('Cookie');
      console.log(cookie)
      console.log(id)
      if (cookie === null) navigation.navigate('Login');
      
      const data = {
        id:id
      }
      api.post('livros/get-by-id/', data, {
        headers:{
          "Cookie":cookie
        }
      })
      .then(response => {
        setLivro(response.data);
      })
      .catch(error => {
        toast.show("Falha ao tentar buscar o livro", {
            type: "warning",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
        });
      })
  }

  fetchLivros();
  }, [])

  const renderLivro = () =>{
    if (livro && livro !== null)
    {
      return(
        <View>
            <Text>{livro.nome}</Text>
            <Text>{livro.preco}</Text>
            <Text>{livro.estoque}</Text>
            <Text>{livro.isbn}</Text>
            <Text>{livro.categoria}</Text>
            <Text>{livro.nome_autor}</Text>
            <Text>{livro.data_lancamento}</Text>
            <Pressable style={{borderColor:'black', borderWidth:1, backgroundColor:'blue'}}>
              <Text>Adicionar ao carrinho</Text>
            </Pressable>
        </View>
      );
    }
    else{
      return(
        <View>
          <Text>Nada para mostrar no momento....</Text>
        </View>
      );
    }
  }

  return (
    <SafeAreaView>
      <View>
        <Pressable 
          style={{borderColor:'black', borderWidth:1, backgroundColor:'blue', borderRadius:15, width:45}} 
          onPress={() => navigation.goBack()}
        >
          <Text> Voltar </Text>
        </Pressable>
        {renderLivro()}
      </View>
    </SafeAreaView>
  );
};

export default LivroDetails

const styles = StyleSheet.create({})