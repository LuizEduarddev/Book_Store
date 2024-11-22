import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications';
import api from '../../../ApiConfigs/ApiRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart } from "react-native-chart-kit";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

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
          const salesByDate = response.data.pedidos.reduce((acc, pedido) => {
            const { data_pedido, quantidade } = pedido;
            acc[data_pedido] = (acc[data_pedido] || 0) + Math.floor(quantidade); // Sum quantities for the same date
            return acc;
          }, {});
    
          const labels = Object.keys(salesByDate);
          const quantities = Object.values(salesByDate);
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
          (error);
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

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="attach-money" size={24} color="white" />
            </View>
            <Text>   </Text>
            <View>
              <Text style={styles.title}>Total</Text>
              <Text style={styles.title}>Received</Text>
            </View>
          </View>
          <Text style={styles.amount}>${pedidoData.total_earnings}</Text>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>12%</Text>
            <MaterialIcons name="arrow-upward" size={16} color="white" style={styles.arrowUpward}/>
          </View>
        </View>

        <View style={styles.card}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <View style={styles.iconContainer}>
              <FontAwesome name="book" size={24} color="white" />
            </View>
            <Text>   </Text>
            <View>
              <Text style={styles.title}>Quantity</Text>
              <Text style={styles.title}>Sold</Text>
            </View>
          </View>
          <Text style={styles.amount}>{pedidoData.total_books_sold}</Text>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>6%</Text>
            <MaterialIcons name="arrow-upward" size={16} color="white" style={styles.arrowUpward}/>
          </View>
        </View>
      </View>

      <View>
        {
          loadingChartData === false ? (
            <LineChart
              data={dataGraph}
              width={Dimensions.get("window").width - 15 }
              height={300}
              verticalLabelRotation={30}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 0, 
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
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
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
      <ScrollView>
        <View>
          <Pressable onPress={() => navigation.goBack()} style={styles.buttonGoBack}>
            <MaterialIcons name="arrow-back" size={16} color="orange" style={{backgroundColor:'white', padding:5, borderRadius:15}}/>
            <Text style={{color:'black', marginLeft:5}}>go back</Text>
          </Pressable>
          <View style={styles.headerContainer}>
            {pedidoData && (
              <View style={{flexDirection:'row', alignSelf:'center'}}>
                <Text>Hi there 👋. Here are the summary of</Text>
                <Text style={{fontWeight:'900'}}> {pedidoData.book.nome}</Text>
              </View>
            )}
          </View>
          {pedidoData && (
            <RenderPedidoDetails/>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DetailsLivroVendido

const styles = StyleSheet.create({
  headerContainer: {
    marginTop:10,
    backgroundColor: '#F7F7F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    borderRadius: 15,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center', // Centers content vertically
  },
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
    marginTop: 8, // Reduced margin between cards
    backgroundColor: '#FF9800',
    borderRadius: 10, // Slightly smaller border radius
    padding: 8, // Reduced padding
    width: '46%', // Reduced width
    elevation: 4, 
},
iconContainer: {
    backgroundColor: '#F57C00',
    borderRadius: 50,
    padding: 8, // Reduced icon container size
    marginBottom: 8, // Reduced margin
},
  title: {
    color: '#FFFFFF', 
    fontSize: 16,
    marginBottom: 5,
  },
  amount: {
    color: '#FFFFFF', 
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  percentageText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 4,
    fontWeight:'900',
    textAlign:"center"
  },
  arrowUpward:{
    backgroundColor: '#F57C00', 
    borderRadius: 50,
    padding:3
  },
  cardContainer:{
    flexDirection:"row",
    justifyContent:'space-between',
    width:'95%'
  },
  buttonGoBack: {
    marginLeft:5,
    backgroundColor: '#F57C00',
    borderRadius: 50,
    paddingVertical: 10, // Adjusts top/bottom padding
    paddingHorizontal: 15, // Adjusts left/right padding
    flexDirection: 'row',
    alignItems: 'center',
    width:'40%'
  },
})