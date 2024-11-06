import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

type Livro = {
  id: string;
  nome: string;
  preco: string;
  estoque: number;
  isbn: string;
  categoria: string;
  nome_autor: string;
  data_lancamento: string;
};

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
      api.post('livros/get-by-id/', data, {
        headers: {
          "Cookie": cookie,
        },
      })
      .then(response => {
        setLivro(response.data);
      })
      .catch(error => {
          toast.show("Falha ao tentar buscar o livro", {
            type: "warning",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
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
        const cart = await AsyncStorage.getItem('carrinho');
        const carro = JSON.parse(cart);
        console.log(carro);
        toast.show("Adicionado ao carrinho", {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      } catch (error) {
        toast.show("Falha ao tentar adicionar no carrinho", {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      }
    } else {
      toast.show("Falha ao tentar adicionar no carrinho", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    }
  };

  const incrementCounter = () => {
    if (livro && counter < livro.estoque)
    {
      setCounter(prev => prev + 1)
    }
    else{
      toast.show("Estoque insuficiente", {
        type: "warning",
        placement: "top",
        duration: 1000,
        animationType: "slide-in",
      });
    }
  };
  const decrementCounter = () => {
    if (counter > 1) setCounter(prev => prev - 1); 
  };

  const renderLivro = () => {
    if (livro && livro !== null) {
      return (
        <View>
          <Text>{livro.nome}</Text>
          <Text>{livro.preco}</Text>
          <Text>{livro.estoque}</Text>
          <Text>{livro.isbn}</Text>
          <Text>{livro.categoria}</Text>
          <Text>{livro.nome_autor}</Text>
          <Text>{livro.data_lancamento}</Text>

          <Pressable 
            style={{ borderColor: 'black', borderWidth: 1, backgroundColor: 'blue' }} 
            onPress={adicionarAoCarrinho}
          >
            <Text style={{ color: 'white' }}>Adicionar ao carrinho</Text>
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
        <View>
          <Text>Nada para mostrar no momento....</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Pressable 
          style={{ borderColor: 'black', borderWidth: 1, backgroundColor: 'blue', borderRadius: 15, width: 45 }} 
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: 'white' }}> Voltar </Text>
        </Pressable>
        {renderLivro()}
      </View>
    </SafeAreaView>
  );
};

export default LivroDetails;

const styles = StyleSheet.create({
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  counterButton: {
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  counterText: {
    color: 'white',
    fontSize: 18,
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
