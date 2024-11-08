import { SafeAreaView, StyleSheet, Text, View, Image, StatusBar } from 'react-native';
import React, { useState } from 'react';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';

type Livros = {
  id: string,
  nome: string,
  preco: number,
  quantidade: number,
  imagemLivro:string
};

type Pedidos = {
  id: string,
  valorTotal: number,
  dataPedido: string,
  horaPedido: string,
  statusPedido: boolean, 
  livros: Livros[],
};

function formatToBRL(number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(number));
}

const Pedidos = () => {
  const toast = useToast();
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setPedidos([]);
      fetchPedidos();
    }, [])
  );

  const fetchPedidos = async () => {
    api.get('/pedidos/get-by-user/')
      .then(response => {
        if (response.status === 200) {
          setPedidos(response.data);
        } else {
          toast.show("Falha ao tentar buscar os pedidos", {
            type: "warning",
            placement: "top",
            duration: 1000,
            animationType: "slide-in",
          });
        }
      })
      .catch(error => {
        toast.show("Falha ao tentar buscar os pedidos", {
          type: "warning",
          placement: "top",
          duration: 1000,
          animationType: "slide-in",
        });
      });
  };

  const renderLivros = (livros: Livros[]) => {
    return livros.map((livro) => (
      <View key={livro.id} >
        <Image source={{ uri: livro.imagemLivro}}  />
        <View>
          <Text>{livro.nome}</Text>
          <Text>Quantidade: {livro.quantidade}</Text>
        </View>
        <View >
          <Text >Total: {formatToBRL(livro.preco * livro.quantidade)}</Text>
        </View>
      </View>
    ));
  };

  const renderPedidos = () => {
    if (pedidos && pedidos.length > 0) {
      return pedidos.map((pedido) => (
        <View key={pedido.id} style={styles.pedidosContainer}>
          <View style={styles.pedidoTopInformartion}>
            <Text>{pedido.dataPedido}</Text>
            <Text>Status: {pedido.statusPedido ? 'Completo' : 'Pendente'}</Text>
          </View>
          {renderLivros(pedido.livros)}
          <Text>Valor Total: {formatToBRL(pedido.valorTotal)}</Text>
        </View>
      ));
    } else {
      return (
        <View >
          <Text>Nenhum pedido ainda? :c</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {renderPedidos()}
      </View>
    </SafeAreaView>
  );
};

export default Pedidos;

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:StatusBar.currentHeight
  },
  pedidosContainer:{
    borderColor:'black',
    borderWidth:1,
    margin:10,
  },
  pedidoTopInformartion:{
    flexWrap:'wrap',
    flexDirection:'row',
    justifyContent:'space-between'
  }
});