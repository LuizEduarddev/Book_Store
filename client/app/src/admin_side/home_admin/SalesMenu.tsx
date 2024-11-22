import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

type Livros = {
    id: string,
    nome: string,
    preco: number,
    quantidade: number,
    imagemLivro: string,
    categoria:string
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

const calculateCategoryData = (pedidos: Pedidos[]) => {
    const categoryMap: { [key: string]: number } = {};
  
    pedidos.forEach((pedido) => {
      pedido.livros.forEach((livro) => {
        const categoria = livro.categoria;
        const quantidade = livro.quantidade;
        (livro.categoria);
        if (categoryMap[categoria]) {
          categoryMap[categoria] += quantidade;
        } else {
          categoryMap[categoria] = quantidade;
        }
      });
    });
  
    const labels = Object.keys(categoryMap);
    const data = Object.values(categoryMap);
    return { labels, data };
  };

function formatToBRL(number: string) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(number));
}

const SalesMenu = ({pedidos}:{pedidos:Pedidos[]}) => {
  
    const toast = useToast();
    const [quantidadePedidos, setQuantidadePedidos] = useState(0);
    const [totalVendas, setTotalVendas] = useState('');
    
    const fetchQuantidadePedidos = () => {
        if (pedidos && pedidos.length > 0)
        {
            let total = 0;
            pedidos.forEach((pedido) => {
                total += 1
            })
            setQuantidadePedidos(total);
        }
    }

    const fetchTotalVendas = () => {
        if (pedidos && pedidos.length > 0)
        {
            let total = 0;
            pedidos.forEach((pedido) => {
                total += pedido.valorTotal
            })
            setTotalVendas(formatToBRL(total.toString()))
        }
    }

    useEffect(() => {
        fetchQuantidadePedidos();
        fetchTotalVendas();
    }, [])

    const renderMenu = () => {
        if (pedidos && pedidos.length > 0)
        {
            return(
                <View style={styles.container}>
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
                        <Text style={styles.amount}>{quantidadePedidos}</Text>
                        <View style={styles.percentageContainer}>
                            <Text style={styles.percentageText}>6%</Text>
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
                                <Text style={styles.title}>Total</Text>
                                <Text style={styles.title}>Earned</Text>
                            </View>
                        </View>
                        <Text style={styles.amount}>{totalVendas}</Text>
                        <View style={styles.percentageContainer}>
                            <Text style={styles.percentageText}>6%</Text>
                            <MaterialIcons name="arrow-upward" size={16} color="white" style={styles.arrowUpward}/>
                        </View>
                    </View>
                </View>
            );
        }
        else{
            return(
                <View>
                    
                </View>
            );
        }
    }
    
    return (
        <SafeAreaView>
            <View>
                {pedidos && pedidos.length > 0 ? (
                    <View style={styles.headerContainer}>
                        <Text style={{marginLeft:8}}>Here's happening in your sales last week 👋</Text>  
                    </View>
                ):(
                    <></>
                )}
                {renderMenu()}
            </View>
        </SafeAreaView>
    )
}

export default SalesMenu

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:"space-between",
        width:'95%',
        alignSelf:'center',
    },
    summaryContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'orange',
        padding:15,
        width:'95%',
        alignSelf:'center',
        marginTop:10,
        borderRadius:15,
        height:100,
        alignItems:'center'
    },
    summaryProfit:{
        backgroundColor:'#FF6F00',
        padding:10,
        borderRadius:15,
        width:'45%',
        alignItems:'center'
    },
    labelText: {
        fontSize: 14,
        color: '#fff',
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
        fontSize: 22,
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
      headerContainer:{
        borderColor:"orange",
        borderWidth:1,
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
        justifyContent: 'center', 
      }
})  