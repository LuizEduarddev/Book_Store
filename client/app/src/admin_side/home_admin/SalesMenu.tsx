import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
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
                <View style={styles.containerPedidos}>
                    <View style={styles.salesDetails}>
                        <Text style={styles.totalVenda}>{totalVendas}</Text>
                        <Text style={{color:'white', fontWeight:'400'}}>Sales profit</Text>
                    </View>
                    <View style={styles.salesDetails}>
                        <Text>{quantidadePedidos}</Text>
                        <Text>Products selling</Text>
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
                  <Text style={{color:'black', fontWeight:'700'}}>Here's happening in your sales last week 👋</Text>  
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
    containerPedidos:{
        alignItems:'center',
        flexDirection:'row'
    },
    salesDetails:{
        backgroundColor:'orange',
        borderRadius:15,
        padding:15,
        width:'50%',
        alignItems:'center'
    },
    totalVenda:{
        borderRadius:15,
        backgroundColor:'white',
        color:'orange',
        padding:10
    }
})