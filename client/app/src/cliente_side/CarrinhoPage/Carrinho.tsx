import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../ApiConfigs/ApiRoute';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // For trash icon

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
    try {
      const carrinho = await getLivrosCarrinho();

      const updatedCarrinho = carrinho.filter(item => item.idlivro !== livro.id);
      await AsyncStorage.setItem('carrinho', JSON.stringify({ orders: updatedCarrinho }));

      setLivros(livros.filter(item => item.id !== livro.id));

      toast.show("Item deletado com sucesso", {
        type: "success",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    } catch (error) {
      toast.show("Falha ao deletar o item", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
    }
  };

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
            try {
              AsyncStorage.removeItem('carrinho');
              setLivros([]);
              fetchLivros();
              toast.show("Pedido criado com sucesso", {
                type: "success",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
              });
            } catch (error) {
              toast.show("Pedido criado mas falha ao limpar o carrinho", {
                type: "success",
                placement: "top",
                duration: 2000,
                animationType: "slide-in",
              });
            }
          } else if (response.status === 401) {
            toast.show("Livro sem estoque", {
              type: "warning",
              placement: "top",
              duration: 2000,
              animationType: "slide-in",
            });
          } else {
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
    let totalCarrinho = 0;

    if (livros && Array.isArray(livros) && livros.length > 0) {
      return (
        <View>
          {livros.map((livro) => {
            const totalItem = parseFloat(livro.preco) * livro.quantidade;
            totalCarrinho += totalItem;

            return (
              <View key={livro.id} style={styles.itemContainer}>
                <Image source={{ uri: livro.foto_livro }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{livro.nome}</Text>
                  <Text style={styles.itemTotal}>R$ {totalItem.toFixed(2)}</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <Pressable onPress={() => decrementCounter(livro)} style={styles.counterButton}>
                    <Text style={styles.counterText}>-</Text>
                  </Pressable>
                  <Text style={styles.counterValue}>{livro.quantidade}</Text>
                  <Pressable onPress={() => incrementCounter(livro)} style={styles.counterButton}>
                    <Text style={styles.counterText}>+</Text>
                  </Pressable>
                  <Pressable onPress={() => deleteItem(livro)} style={styles.deleteButton}>
                    <FontAwesome name="trash" size={20} color="red" />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      return (
        <View>
          <Text>Você ainda não comprou nada? :c</Text>
        </View>
      );
    }
  };

  const renderPreOrder = () => {
    let totalCarrinho = 0;

    if (livros && Array.isArray(livros) && livros.length > 0) {
      totalCarrinho = livros.reduce(
        (total, livro) => total + parseFloat(livro.preco) * livro.quantidade,
        0
      );

      return (
        <View style={styles.preOrderContainer}>
          <Text style={styles.totalText}>Total: R$ {totalCarrinho.toFixed(2)}</Text>
          <Pressable onPress={tryFazerPedido} style={styles.finalizeButton}>
            <Text style={styles.finalizeText}>Finalizar Pedido</Text>
          </Pressable>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {renderCarrinho()}
        {renderPreOrder()}
      </View>
    </SafeAreaView>
  );
};

export default Carrinho;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTotal: {
    fontSize: 14,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  totalCarrinho: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  checkoutText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  preOrderContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  finalizeButton: {
    backgroundColor: '#5cb85c',
    padding: 15,
    borderRadius: 5,
  },
  finalizeText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
