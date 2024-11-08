import { Image, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Livro = {
  id: string;
  nome: string;
  preco: string;
  estoque: number;
  isbn: string;
  categoria: string;
  nome_autor: string;
  data_lancamento: string;
  foto_livro: string;
};

function formatToBRL(number: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(number));
}

type CarrinhoItem = {
  idlivro: string;
  quantidade: number;
};

const LivroDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const toast = useToast();
  const [livro, setLivro] = useState<Livro>();
  const [counter, setCounter] = useState<number>(1);

  useEffect(() => {
    const fetchLivros = async () => {
      const cookie = await AsyncStorage.getItem('Cookie');
      if (cookie === null) navigation.navigate('Login');

      const data = {
        id: id,
      };
      api
        .post('livros/get-by-id/', data, {
          headers: {
            'Cookie': cookie,
          },
        })
        .then((response) => {
          setLivro(response.data);
        })
        .catch((error) => {
          toast.show('Falha ao tentar buscar o livro', {
            type: 'warning',
            placement: 'top',
            duration: 4000,
            animationType: 'slide-in',
          });
        });
    };

    fetchLivros();
  }, []);

  const adicionarAoCarrinho = async () => {
    if (id && id !== null) {
      try {
        const cartString = await AsyncStorage.getItem('carrinho');
        const currentCart = cartString ? JSON.parse(cartString) : { orders: [] };

        const existingItemIndex = currentCart.orders.findIndex((item: CarrinhoItem) => item.idlivro === id);

        if (existingItemIndex !== -1) {
          if (currentCart.orders[existingItemIndex].quantidade !== counter) {
            currentCart.orders[existingItemIndex].quantidade = counter;
          }
        } else {
          currentCart.orders.push({ idlivro: id, quantidade: counter });
        }

        await AsyncStorage.setItem('carrinho', JSON.stringify(currentCart));
        toast.show('Adicionado ao carrinho', {
          type: 'success',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      } catch (error) {
        toast.show('Falha ao tentar adicionar no carrinho', {
          type: 'warning',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
        });
      }
    } else {
      toast.show('Falha ao tentar adicionar no carrinho', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
  };

  const incrementCounter = () => {
    if (livro && counter < livro.estoque) {
      setCounter((prev) => prev + 1);
    } else {
      toast.show('Estoque insuficiente', {
        type: 'warning',
        placement: 'top',
        duration: 1000,
        animationType: 'slide-in',
      });
    }
  };
  const decrementCounter = () => {
    if (counter > 1) setCounter((prev) => prev - 1);
  };

  const renderLivro = () => {
    if (livro) {
      return (
        <View style={styles.bookContainer}>
          {livro.foto_livro && (
            <Image
              source={{ uri: livro.foto_livro }}
              style={styles.bookImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.bookTitle}>{livro.nome}</Text>
          <Text style={styles.bookInfo}>Estoque: {livro.estoque}</Text>
          <Text style={styles.bookPrice}>{formatToBRL(livro.preco)}</Text>
          <Text style={styles.bookInfo}>ISBN: {livro.isbn}</Text>
          <Text style={styles.bookInfo}>Data de lançamento: {livro.data_lancamento}</Text>
          <Text style={styles.bookInfo}>Categoria: {livro.categoria}</Text>
          <Text style={styles.bookInfo}>Autor: {livro.nome_autor}</Text>

          <Pressable style={styles.addButton} onPress={adicionarAoCarrinho}>
            <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
          </Pressable>

          <View style={styles.counterContainer}>
            <Pressable onPress={decrementCounter} style={styles.counterButton}>
              <Text style={styles.counterText}>-</Text>
            </Pressable>
            <Text style={styles.counterValue}>{counter}</Text>
            <Pressable onPress={incrementCounter} style={styles.counterButton}>
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nada para mostrar no momento....</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        {renderLivro()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default LivroDetails;

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
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'orange',
    borderRadius: 50,
    padding: 10,
    zIndex: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
  },
  bookImage: {
    width: 200,
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  bookInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  bookPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'orange',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  counterButton: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  counterText: {
    color: 'white',
    fontSize: 18,
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
