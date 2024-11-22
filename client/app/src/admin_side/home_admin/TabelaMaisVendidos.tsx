import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailsLivroVendido from './DetailsLivroVendido';

type Livros = {
    id: string,
    nome: string,
    preco: number,
    quantidadeVendido: number,
    estoque:string,
    imagemLivro:string,
    totalEarned:number,
};

const TabelaMaisVendidos = ({navigation, from}) => {
    
    const toast = useToast();
    const [livros, setLivros] = useState<Livros[]>();
    const origin = from ? from : ""
    
    useEffect(() => {
        fetchPedidos();
    }, [])

    const fetchPedidos = async () => {
        api.get('livros/vendidos/')
        .then(response => {
            setLivros(response.data)
        })
        .catch(error => {
            toast.show("Falha ao tentar buscar o livro", {
                type: "warning",
                placement: "top",
                duration: 4000,
                animationType: "slide-in",
            });
        })
    } 

    const renderTableVendas = () => {
        if (livros && livros.length > 0) {
          
            const sortedLivros = [...livros].sort((a, b) => b.quantidadeVendido - a.quantidadeVendido);

            return (
            <View style={styles.tableContainer}>
                {origin === 'home' ? (
                    <Text>Top selling products</Text>
                ):(
                    <Text>Estoque</Text>
                )}
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}></Text>
                    <Text style={styles.headerText}>Name</Text>
                    <Text style={styles.headerText}>Stock</Text>
                    <Text style={styles.headerText}>Price</Text>
                    <Text style={styles.headerText}>Sold</Text>
                    <Text style={styles.headerText}>Earnings</Text>
                </View>
      
              <FlatList
                data={sortedLivros}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: livro }) => (
                    <Pressable style={styles.tableRow} onPress={() => {
                        if (from === 'home') navigation.navigate('LivroVendidoDetails', { id: livro.id });
                        else if (from === 'estoque') navigation.navigate('EditLivro', {id: livro.id})
                        else {
                            toast.show("Falha não identificada", {
                                type: "warning",
                                placement: "top",
                                duration: 4000,
                                animationType: "slide-in",
                            });
                        }
                        }}>
                        <View style={styles.imageContainer}>
                        {livro.imagemLivro && (
                            <Image
                            source={{ uri: livro.imagemLivro }}
                            style={styles.productImage}
                            />
                        )}
                        </View>
                        <Text style={styles.rowText}>{livro.nome}</Text>
                        <Text style={styles.rowText}>{livro.estoque}</Text>
                        <Text style={styles.rowText}>${livro.preco}</Text>
                        <Text style={styles.rowText}>{livro.quantidadeVendido}</Text>
                        <Text style={styles.rowText}>${livro.totalEarned}</Text>
                    </Pressable>
                )}
              />
            </View>
          );
        } else {
          return (
            <View>
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          );
        }
      };

    return (
        <SafeAreaView>
            <View>
                {renderTableVendas()}
            </View>
        </SafeAreaView>
  )
}

export default TabelaMaisVendidos

const styles = StyleSheet.create({
    tableContainer:{
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
        borderColor:'orange',
        borderWidth:1 
    },
    tableHeader: {
        width:'100%',
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#f4f4f4",
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    tableRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    imageContainer: {
        width: 50,
        height: 50,
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 12,
        flex: 1,
        textAlign: "center",
    },
    rowText: {
        fontSize: 12,
        flex: 1,
        textAlign: "center",
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
        color: "#888",
        marginTop: 20,
    },
})