import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import api from '../../../ApiConfigs/ApiRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from "react-native-chart-kit";

interface Book {
  id: string;
  nome: string;
  preco: string; 
  estoque: number;
  isbn: string;
  categoria: string;
  nome_autor: string;
  data_lancamento: string;
  foto_livro: string;
}

interface Pedido {
  pedido_id: string;
  valor_total: string; 
  data_pedido: string;
  hora_pedido: string;
  status_pedido: boolean;
  data_pedido_entregue: string;
  endereco_entrega: string;
  endereco_saida: string;
  quantidade: number; 
}

interface BookOrderData {
  book: Book;
  pedidos: Pedido[];
  total_earnings: string;
  total_books_sold: number;
}

const DetailsLivroVendido = ({ route, navigation }) => {
  
  const { id } = route.params;
  const toast = useToast();
  const [pedidoData, setPedidoData] = useState<BookOrderData>();
  const [dataGraph, setDataGraph] = useState<any>();
  const [loadingChartData, setLoadingChartData] = useState(true);

  useEffect(() => {
    fetchLivro();
  }, [])
  
  const fetchLivro = async () => {
    api.get('livros/vendidos/detalhes', {
      headers:{
        id:id
      }
    }) 
    .then(response => {
      setPedidoData(response.data);
      if (response && response.data && response.data.pedidos)
      {
        try
        {
          const labels = response.data.pedidos.map((pedido) => pedido.data_pedido); 
          const quantities = response.data.pedidos.map((pedido) => Math.floor(pedido.quantidade));
          const dataGraph = {
            labels: labels,
            datasets: [
              {
                data: quantities,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
              }
            ],
          }
          setDataGraph(dataGraph)
        }
        catch(error)
        {
          console.log(error);
          toast.show('Falha ao renderizar o gráfico', {
            type: 'warning',
            placement: 'top',
            duration: 4000,
            animationType: 'slide-in',
          });
        }
      }
    })
    .catch(error => {
      toast.show('Falha ao tentar buscar os dados livro', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    })
    .finally(() => {
      setLoadingChartData(false);
    }
    )
  }

  const RenderPedidoDetails = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.livroDataContainer}>
        {pedidoData.book.foto_livro && (
            <Image
              source={{ uri: pedidoData.book.foto_livro }}
              style={styles.imagemLivro}
              resizeMode="cover"
            />
          )}
        <View style={styles.livroDataText}>
          <Text>{pedidoData.book.nome}</Text>
          <Text>{pedidoData.book.estoque}</Text>
          <Text>{pedidoData.book.data_lancamento}</Text>
          <Text>{pedidoData.book.isbn}</Text>
          <Text>{pedidoData.book.preco}</Text>
          <Text>{pedidoData.book.nome_autor}</Text>
        </View>
      </View>

      <View style={styles.livroSummary}>
        <View>
          <Text>{pedidoData.total_books_sold}</Text>
          <Text>{pedidoData.book.nome} solded</Text>
        </View>
        
        <View>
          <Text>{pedidoData.total_earnings}</Text>
          <Text>Total earned</Text>
        </View>
      </View>

      <View>
        {
          loadingChartData === false ? (
            <LineChart
              data={dataGraph}
              width={Dimensions.get("window").width}
              height={256}
              verticalLabelRotation={30}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
            />
          ):(
            <ActivityIndicator size="large" color="#6200EE" />
          )
        }
      </View>
    </View>
  );

  return (
    <SafeAreaView>
      <View>
        <Pressable onPress={() => navigation.goBack()} style={{backgroundColor:'blue', borderRadius:15, padding:10}}>
          <Text style={{color:'white'}}>{'<'}- Voltar</Text>
        </Pressable>
        {pedidoData && (
          <RenderPedidoDetails/>
        )}
      </View>
    </SafeAreaView>
  )
}

export default DetailsLivroVendido

const styles = StyleSheet.create({
  detailsContainer:{

  },
  livroDataContainer:{
    flexDirection:"row",
    borderRadius:15,
    justifyContent:'space-between',
    padding:15
  },
  livroDataText:{},
  livroSummary:{
    flexDirection:"row"
  },
  imagemLivro:{
    width:100,
    height:150,
    borderRadius:15,
    objectFit:'cover'
  }
})