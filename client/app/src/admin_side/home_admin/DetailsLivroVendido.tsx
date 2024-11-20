import { ActivityIndicator, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import api from '../../../ApiConfigs/ApiRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from "react-native-chart-kit";
import { MaterialIcons } from '@expo/vector-icons';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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

function formatToBRL(number: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(number));
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
          <View style={{flexDirection:'column', justifyContent:'space-between'}}>
            <Text>Título</Text>
            <Text>Estoque</Text>
            <Text>Data lançamento</Text>
            <Text>ISBN</Text>
            <Text>Preco</Text>
            <Text>Nome autor</Text>
          </View>
        <View style={styles.livroDataText}>
          <Text style={styles.livroData}>{pedidoData.book.nome}</Text>
          <Text style={styles.livroData}>{pedidoData.book.estoque}</Text>
          <Text style={styles.livroData}>{pedidoData.book.data_lancamento}</Text>
          <Text style={styles.livroData}>{pedidoData.book.isbn}</Text>
          <Text style={styles.livroData}>{formatToBRL(pedidoData.book.preco)}</Text>
          <Text style={styles.livroData}>{pedidoData.book.nome_autor}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <AttachMoneyIcon/>
        </View>
        <Text style={styles.cardTitle}>Today Received</Text>
        <Text style={styles.amount}>{formatToBRL(pedidoData.total_earnings)}</Text>
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.percentage}>12%</Text>
            <MaterialIcons name="arrow-upward" size={14} color="green" />
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
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
    alignItems:'center'
  },
  livroDataContainer:{
    width:'95%',
    flexDirection:"row",
    borderRadius:15,
    justifyContent:'space-between',
    padding:15,
    backgroundColor: '#F7F7F7', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 5
  },
  livroDataText:{
    justifyContent:'space-between'
  },
  livroSummary:{
    flexDirection:"row",
    justifyContent:'space-between',
    width:'95%'
  },
  imagemLivro:{
    width:100,
    height:150,
    borderRadius:15,
    objectFit:'cover'
  },
  livroData:{
    fontWeight:'900'
  },
  summaryData:{
    backgroundColor:'orange',
    borderRadius:15,
    padding:15,
    width:'45%',
    marginTop:15,
    alignItems:'center'
  },
  totalSummary:{
    borderRadius:100,
    padding:15,
    backgroundColor:'white',
    color:'orange'
  },
  totalText:{
    
  },
  card: {
    backgroundColor: '#12263F',
    borderRadius: 15,
    padding: 20,
    width: 200,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: '#1E3A5B',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  amount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    color: 'green',
    fontSize: 12,
    marginRight: 5,
  },
})