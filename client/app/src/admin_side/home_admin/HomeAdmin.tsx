import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

type Livros = {
  id: string,
  nome: string,
  preco: number,
  quantidade: number,
  imagemLivro: string
};

type Pedidos = {
  id: string,
  valorTotal: number,
  dataPedido: string,
  horaPedido: string,
  statusPedido: boolean,
  livros: Livros[],
  dataEntrega:string,
  enderecoEntrega:string,
  enderecoSaida:string
};

const HomeAdmin = () => {
  const toast = useToast();
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [pedidos, setPedidos] = useState<Pedidos[]>();

  useEffect(() => {
    fetchPedidos();
  }, [])

  const fetchPedidos = async () => {
    api.get('pedidos/get-all/')
    .then(response => {
      console.log(response.data);
    })
    .catch(error => 
      toast.show("Falha ao tentar buscar o livro", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      })
    )
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Do zero</Text>
      </View>
    </SafeAreaView>
  )
}

export default HomeAdmin

const styles = StyleSheet.create({})