import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Livros = {
  id: string,
  nome: string,
  preco: string,
  quantidade: number,
  imagemLivro: string,
  isbn:string,
  nomeAutor:string
};

type Pedido = {
  id: string,
  valorTotal: string,
  dataPedido: string,
  horaPedido: string,
  statusPedido: boolean,
  livros: Livros[],
  dataEntrega: string,
  enderecoSaida: string,
  enderecoEntrega: string
};

function formatToBRL(number: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(number));
}

const DetailsPedido = ({route, navigation}) => {
  const toast = useToast();
  const { id } = route.params;
  const [pedido, setPedido] = useState<Pedido>();
  const planePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPedido();
  }, []);

  const fetchPedido = async () => {
    api.get("pedidos/get-by-id/", {
      params:{
        id:id
      }
    })
    .then(response => {
      setPedido(response.data);
    })
    .catch(error => {
      toast.show("Falha ao tentar buscar o pedido", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    })
  }

  const renderLivros = (livro:Livros) => {
    return(
      <View key={livro.id} style={styles.bookContainer}>
        {livro.imagemLivro && (
            <Image
              source={{ uri: livro.imagemLivro }}
              style={styles.bookImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.bookDescription} >
            <Text>{livro.nome}</Text>
            <View style={styles.bookValue}>
              <Text style={{color:'black', fontWeight:'900'}}>{formatToBRL(livro.preco)}</Text>
              <Text style={{color:'grey', fontWeight:'500'}}>x{livro.quantidade}</Text>
            </View>
            <Text>isbn: {livro.isbn}</Text>
            <Text>Autor: {livro.nomeAutor}</Text>
          </View>
      </View>
    );
  }

  const renderPedido = () => {
    if (pedido && pedido !== null)
    {
      return(
        <View style={styles.pedidoContainer}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <View style={styles.pedidoIdContainer}>
            <Text style={styles.pedidoIdText}>ID do pedido</Text>
            <Text style={styles.pedidoId}>{pedido.id}</Text>
          </View>

        <View style={{borderColor:'orange', padding:5, borderWidth:1, borderRadius:15, alignItems:'center', marginTop:10}}>
          {pedido.statusPedido === true ? <Text>Entregue</Text> : <Text>Em preparação</Text>}
          <View style={styles.pedidoStatusContainer}>
            <View style={styles.pedidoEnderecoContainer}>
              <Text style={styles.textStatus}>{pedido.enderecoSaida}</Text>
            </View>

            <Text>○ ........ ✈</Text>

            <View style={styles.pedidoEnderecoContainer}>
              <Text style={styles.textStatus}>{pedido.enderecoEntrega}</Text>
            </View>
          </View>
        </View>

          <View style={styles.pedidoDataPedido}>
            <Text>Realizado em:</Text>
            <Text style={styles.pedidoDataPedidoText}> {pedido.dataPedido} - {pedido.horaPedido}</Text>
          </View>
          <Text>{pedido.statusPedido}</Text>
            {pedido.livros.map((livro) => (
                renderLivros(livro)
              ))}
          <View style={styles.pedidoTotalContainer}>
            <Text style={styles.pedidoTotalText}>Total: {formatToBRL(pedido.valorTotal)}</Text>
          </View>
        </View>
      );
    }
    else{
      return(
        <View style={styles.pedidoContainer}>
          <Text>Nada para mostrar no momento</Text>
        </View>
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {renderPedido()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default DetailsPedido

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'orange',
    borderRadius: 50,
    padding: 10,
    marginBottom:10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pedidoContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },  // More pronounced shadow
    shadowOpacity: 0.1,  // Lower opacity for subtle shadow
    shadowRadius: 10,  // Increase blur radius for a softer shadow
    elevation: 5, // For Android shadow
    alignItems: 'center',
  },
  bookImage: {
    width: 50,
    height: 100,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    marginRight:20
  },
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4, // Android shadow effect
  },
  pedidoIdContainer: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  pedidoIdText: {
    color: 'white',
    alignItems: 'center',
    fontWeight: '900',
  },
  pedidoId: {
    color: 'white',
  },
  pedidoStatusContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: 10,
    width: "100%",
  },
  pedidoEnderecoContainer: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  textStatus: {
    color: 'black',
  },
  pedidoDataPedido: {
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: 'orange',
    borderWidth: 2,
    padding: 10,
  },
  pedidoDataPedidoText: {
    color: 'orange',
    fontWeight: '900',
  },
  pedidoTotalContainer: {
    marginTop: 10,
    backgroundColor: 'orange',
    width: '100%',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 4,
  },
  pedidoTotalText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '800',
  },
  bookDescription: {
    flex: 2,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
  },
  bookValue: {
    flexDirection: 'row',
  },
});
