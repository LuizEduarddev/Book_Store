import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../ApiConfigs/ApiRoute';

type GroupedPedidos = Record<string, Pedidos[]>;
type PedidosProps = { pedidos: GroupedPedidos };
type LivroProp = { livro: Livros };

type Livros = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagemLivro: string;
};

type Pedidos = {
  id: string;
  valorTotal: number;
  dataPedido: string;
  horaPedido: string;
  statusPedido: boolean;
  livros: Livros[];
};

function formatToBRL(number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(number));
}

const Pedidos = ({ navigation }) => {
  const toast = useToast();
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);
  const [activeTab, setActiveTab] = useState('On Shipping');

  useFocusEffect(
    React.useCallback(() => {
      setPedidos([]);
      fetchPedidos();
    }, [])
  );

  const fetchPedidos = async () => {
    api
      .get('/pedidos/get-by-user/')
      .then((response) => {
        if (response.status === 200) {
          if (Array.isArray(response.data)) setPedidos(response.data);
        } else {
          toast.show('Failed to fetch orders', {
            type: 'warning',
            placement: 'top',
            duration: 1000,
            animationType: 'slide-in',
          });
        }
      })
      .catch((error) => {
        toast.show('Failed to fetch orders', {
          type: 'warning',
          placement: 'top',
          duration: 1000,
          animationType: 'slide-in',
        });
      });
  };

  const RenderLivros = ({ livro }: LivroProp) => (
    <View style={styles.bookCard}>
      {livro.imagemLivro && (
        <Image source={{ uri: livro.imagemLivro }} style={styles.livroImagem} />
      )}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{livro.nome}</Text>
        <Text style={styles.bookPrice}>
          {formatToBRL(livro.preco * livro.quantidade)} x {livro.quantidade}
        </Text>
      </View>
    </View>
  );

  const RenderPedidos = ({ pedidos }: PedidosProps) => (
    <View>
      {Object.entries(pedidos).map(([date, pedidosForDate]) => (
        <View key={date}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          {pedidosForDate.map((pedido) => (
            <View key={pedido.id} style={styles.pedidoContainer}>
              {pedido.livros.map((livro) => (
                <RenderLivros key={livro.id} livro={livro} />
              ))}
              <View style={styles.pedidoFooter}>
                <Text style={styles.totalText}>
                  Total: {formatToBRL(pedido.valorTotal)}
                </Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('PedidoDetails', { id: pedido.id })}
                >
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );

  const renderTab = () => {
    if (pedidos && pedidos.length > 0) {
      const pedidosFilter = pedidos.filter((pedido) =>
        activeTab === 'On Shipping'
          ? !pedido.statusPedido
          : activeTab === 'Arrived'
          ? pedido.statusPedido
          : false
      );

      const pedidosByDate = pedidosFilter.reduce((group, pedido) => {
        if (!group[pedido.dataPedido]) {
          group[pedido.dataPedido] = [];
        }
        group[pedido.dataPedido].push(pedido);
        return group;
      }, {} as Record<string, Pedidos[]>);

      if (pedidosFilter.length > 0) {
        return <RenderPedidos pedidos={pedidosByDate} />;
      } else {
        return <Text style={styles.noDataText}>No orders to show</Text>;
      }
    } else {
      return <Text style={styles.noDataText}>No orders yet?</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        {['On Shipping', 'Arrived', 'Cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scrollView}>{renderTab()}</ScrollView>
    </SafeAreaView>
  );
};

export default Pedidos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#F8F9FA',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  dateHeader: {
    padding: 15,
    backgroundColor: '#FF6B35',
    borderRadius: 5,
    marginTop: 15,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pedidoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bookCard: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  livroImagem: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  bookInfo: {
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  bookPrice: {
    fontSize: 13,
    color: '#666',
  },
  pedidoFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  detailsButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontSize: 16,
  },
});
