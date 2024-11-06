import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute'
import { useToast } from 'react-native-toast-notifications'

type Livros = {
  id: string,
  nome: string
  preco: number,
  quantidade: number
}

type Pedidos = {
  id: string,
  valorTotalfloat: number,
  dataPedido:string 
  horaPedido:string, 
  livros: Livros[]
}

const Pedidos = () => {
  
  const toast = useToast();
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);

  useEffect(() => {
    api.get('/pedidos/get-by-user/')
    .then(response => {
      if (response.status === 200)
      {
        setPedidos(response.data);
      }
      else{
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
    })
  })

  const renderLivros = (pedido: Pedidos) => {
    if (pedido && pedido.livros.length > 0){
      return(
        <View>
          {pedido.livros.map((livro) => {
            return(
              <View key={livro.id}>
                <Text>{livro.nome}</Text>
                <Text>{livro.preco}</Text>
                <Text>{livro.quantidade}</Text>
              </View>
            );
          })}
        </View>
      );
    }
    else{
      return(
        <View>
          <Text>nenhum livro</Text>
        </View>
      );
    }
  }
  
  const renderPedidos = () => {
    if (pedidos && pedidos.length > 0)
    {
      return(
        <View>
          {pedidos.map((pedido) => {
            return(
              <View key={pedido.id} style={{borderColor:'black', borderWidth:1}}>
                <Text>{pedido.dataPedido} {pedido.horaPedido}</Text>
                {renderLivros(pedido)}
                <Text>{pedido.valorTotalfloat}</Text>
              </View>
            );
          })}
        </View>
      );
    }
    else{
      return(
        <View>
          <Text>Nenhum pedido ainda? :c</Text>
        </View>
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            {renderPedidos()}
        </View>
    </SafeAreaView>
  )
}

export default Pedidos

const styles = StyleSheet.create({
  container: {
    flex: 1,          
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,           
    justifyContent: 'center',
    alignItems: 'center',    
    padding: 16,       
  },
  text: {
    fontSize: 18,
  }
})
