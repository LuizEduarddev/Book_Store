import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../ApiConfigs/ApiRoute';
import { useFocusEffect } from '@react-navigation/native';

type Livro = {
  id: string;
  nome: string;
  preco: string;
  estoque: number;
  isbn: string;
  categoria: string;
  nome_autor: string;
  data_lancamento: string;
  quantidade: number;
};

type CarrinhoItem = {
  idlivro: string;
  quantidade: number; 
};

const Carrinho = () => {
  const toast = useToast();
  const [livros, setLivros] = useState<Livro[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setLivros([]);
      fetchLivros();
    }, [])
  );

  const fetchLivros = async () => {
    const carrinho: CarrinhoItem[] = await getLivrosCarrinho();
    if (carrinho && carrinho.length > 0) {
      try {
        const livroPromises = carrinho.map(async (item) => {
          const response = await api.post('livros/get-by-id/', {
            id: item.idlivro,
          });
          return { ...response.data, quantidade: item.quantidade }; 
        });

        const fetchedLivros = await Promise.all(livroPromises);
        setLivros(fetchedLivros);
      } catch (error) {
        toast.show("Falha ao tentar buscar o livro", {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      }
    }
  };

  const getLivrosCarrinho = async () => {
    const getCarrinho = await AsyncStorage.getItem('carrinho');
    const carrinho = getCarrinho ? JSON.parse(getCarrinho) : [];
    return carrinho.orders.map((item: CarrinhoItem) => ({
      idlivro: item.idlivro,
      quantidade: item.quantidade, 
    }));
  };

  const decrementCounter = async (livro) => {
    const carrinho = await getLivrosCarrinho();
    
    const updatedCarrinho = carrinho.map(item => {
      if (item.idlivro === livro.id) {
        return { ...item, quantidade: Math.max(item.quantidade - 1, 1) };
      }
      return item;
    });
  
    await AsyncStorage.setItem('carrinho', JSON.stringify({ orders: updatedCarrinho }));
  
    setLivros(prevLivros => 
      prevLivros.map(item => 
        item.id === livro.id ? { ...item, quantidade: Math.max(item.quantidade - 1, 1) } : item
      )
    );
  };

  const incrementCounter = async (livro) => {
    const carrinho = await getLivrosCarrinho();
  
    const updatedCarrinho = carrinho.map(item => {
      if (item.idlivro === livro.id) {
        if (item.quantidade < livro.estoque) {
          return { ...item, quantidade: item.quantidade + 1 };
        } else {
          toast.show("Estoque insuficiente", {
            type: "warning",
            placement: "top",
            duration: 1000,
            animationType: "slide-in",
          });
          return item; 
        }
      }
      return item;
    });
  
    await AsyncStorage.setItem('carrinho', JSON.stringify({ orders: updatedCarrinho }));
  
    setLivros(prevLivros => 
      prevLivros.map(item => 
        item.id === livro.id && item.quantidade < livro.estoque
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  };
  

  const deleteItem = async (livro) => {
    try
    {
      const carrinho = await getLivrosCarrinho();
    
      const updatedCarrinho = carrinho.filter(item => item.idlivro !== livro.id)
      await AsyncStorage.setItem('carrinho', JSON.stringify({ orders: updatedCarrinho }));
    
      setLivros(livros.filter(item => item.id !== livro.id));
      
      toast.show("Item deletado com sucesso", {
        type: "success",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    }
    catch(error)
    {
      toast.show("Falha ao deletar o item", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    }
  }

  const tryFazerPedido = async () => {
    const carrinho = await getLivrosCarrinho();
    if (carrinho && Array.isArray(carrinho) && carrinho.length > 0) {
      const transformedData = {
        livros: carrinho.map(item => ({
          id_livros: item.idlivro, 
          quantidade: item.quantidade,
        }))
      };
      api.post('pedidos/adicionar/', transformedData)
      .then(response => {
        if (response.status === 200) {
          try
          {
            AsyncStorage.removeItem('carrinho');
            setLivros([]);
            fetchLivros();
            toast.show("Pedido criado com sucesso", {
              type: "success",
              placement: "top",
              duration: 2000,
              animationType: "slide-in",
            });
          }
          catch(error)
          {
            toast.show("Pedido criado mas falha ao limpar o carrinho", {
              type: "success",
              placement: "top",
              duration: 2000,
              animationType: "slide-in",
            });
          }
        }
        else if (response.status === 401){
          toast.show("Livro sem estoque", {
            type: "warning",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          }); 
        }
        else {
          toast.show("Falha ao criar o pedido", {
            type: "warning",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
        }
      })
      .catch(error => {
        toast.show("Falha ao criar o pedido", {
          type: "warning",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        });
      })
    } else {
      toast.show("Carrinho vazio. Não é possível fazer o pedido.", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    }
  };
  

  const renderCarrinho = () => {
    if (livros && Array.isArray(livros) && livros.length > 0) {
      return (
        <View>
          {livros.map((livro) => (
            <ScrollView>
              <View key={livro.id} style={{ borderColor: 'black', borderWidth: 1, marginBottom: 10, padding: 10 }}>
                <Text>{livro.nome}</Text>
                <Text>Preço: {livro.preco}</Text>
                <Text>ISBN: {livro.isbn}</Text>
                <Text>Categoria: {livro.categoria}</Text>
                <Text>Autor: {livro.nome_autor}</Text>
                <Text>Data de Lançamento: {livro.data_lancamento}</Text>
                
                <View style={styles.counterContainer}>
                  <Pressable onPress={() => decrementCounter(livro)} style={styles.counterButton}>
                    <Text style={styles.counterText}>-</Text>
                  </Pressable>
                  <Text style={styles.counterValue}>{livro.quantidade}</Text>
                  <Pressable onPress={() => incrementCounter(livro)} style={styles.counterButton}>
                    <Text style={styles.counterText}>+</Text>
                  </Pressable>
                  <Pressable onPress={() => deleteItem(livro)} style={styles.counterButton}>
                    <Text style={styles.counterText}>deletar</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          ))}
          <Pressable style={{borderColor:'black', borderWidth:1}} onPress={() => tryFazerPedido()}>
            <Text>Fazer pedido</Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <View>
          <Text>Você ainda não comprou nada? :c </Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView>
      <View>
        {renderCarrinho()}
      </View>
    </SafeAreaView>
  );
};

export default Carrinho;

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
