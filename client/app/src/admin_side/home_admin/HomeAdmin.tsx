import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import api from '../../../ApiConfigs/ApiRoute'
import { useToast } from 'react-native-toast-notifications';

type LivroProp = { livro: Livros };
type PedidoProp = { orders: Pedidos[] };

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
};

function formatToBRL(number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(number));
}

const HomeAdmin = () => {
  
  const toast = useToast();
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);
  const [activeTab, setActiveTab] = useState('On Shipping');

  const fetchPedidos = async () => {
    api.get('/pedidos/get-all/')
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
  }

  const RenderLivros = ({ livro }: LivroProp) => (
    <View style={styles.containerLivro}>
      <Image source={{ uri: livro.imagemLivro }} style={styles.livroImagem} />
      <View>
        <Text style={styles.livroNome}>{livro.nome}</Text>
        <Text style={styles.livroPreco}>{formatToBRL(livro.preco * livro.quantidade)} x {livro.quantidade}</Text>
      </View>
    </View>
  );

  const RenderPedidos = ({ orders }: PedidoProp) => (
    <View>
      {orders.map((pedido) => (
        <View key={pedido.id} style={styles.pedidoContainer}>
          <View style={styles.pedidoInformation}>
            <View style={styles.pedidoTopInformation}>
              <Text style={styles.statusText}>Ordered on {pedido.dataPedido}</Text>
              <Text style={styles.statusText}>
                {pedido.statusPedido ? 'Arrived' : 'In preparation'}
              </Text>
            </View>
            <FlatList
              data={pedido.livros}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <RenderLivros livro={item} />}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
            />
          </View>
          <View style={styles.containerPrecoDetalhes}>
            <Text style={styles.valorTotalText}>{formatToBRL(pedido.valorTotal)} ({pedido.livros.length} items)</Text>
            <Pressable style={styles.buttomDetails}>
              <Text style={styles.detailsText}>Details</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTab = () => {
    if (pedidos && pedidos.length > 0) {
      const pedidosFilter = pedidos.filter((pedido) =>
        activeTab === 'On Shipping' ? !pedido.statusPedido : activeTab === 'Arrived' ? pedido.statusPedido : false
      );
      return pedidosFilter.length > 0 ? <RenderPedidos orders={pedidosFilter} /> : <Text style={styles.noDataText}>Nada para ser mostrado</Text>;
    } else {
      return <Text style={styles.noDataText}>Nenhum pedido ainda? :c</Text>;
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.tabBar}>
        {['On Shipping', 'Arrived', 'Cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={{ flex: 1 }}>
        {renderTab()}
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeAdmin

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'orange',
    elevation: 4,
  },
  tabText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  activeTabText: {
    color: 'white',
  },
  pedidoContainer: {
    margin: 10,
    borderColor: '#FFA500',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pedidoInformation: {
    margin: 10,
    padding: 10,
  },
  pedidoTopInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    color: '#FFA500',
    fontWeight: '500',
  },
  containerLivro: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: '3%',
    backgroundColor: '#FFA500',
    borderRadius: 10,
  },
  containerPrecoDetalhes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFA500',
    padding: 10,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
  },
  livroImagem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  livroNome: {
    color: 'white',
    fontWeight: 'bold',
  },
  livroPreco: {
    color: 'white',
  },
  valorTotalText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttomDetails: {
    backgroundColor: '#ff6b35',
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  detailsText: {
    color: 'white',
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    color: '#8E8E93',
    marginVertical: 20,
  },
})