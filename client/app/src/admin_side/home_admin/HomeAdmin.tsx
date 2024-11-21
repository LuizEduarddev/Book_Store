import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import SalesMenu from './SalesMenu';
import TabelaMaisVendidos from './TabelaMaisVendidos';

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
  dataEntrega: string,
  enderecoEntrega: string,
  enderecoSaida: string
};

const HomeAdmin = ({navigation}) => {
  const toast = useToast();
  const [pedidos, setPedidos] = useState<Pedidos[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await api.get('pedidos/get-all/');
      setPedidos(response.data);
    } catch (error) {
      toast.show("Falha ao tentar buscar o livro", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      ) : (
        pedidos && <SalesMenu pedidos={pedidos} />
        
      )}
      <TabelaMaisVendidos navigation={navigation}/>
    </SafeAreaView>
  );
};

export default HomeAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
