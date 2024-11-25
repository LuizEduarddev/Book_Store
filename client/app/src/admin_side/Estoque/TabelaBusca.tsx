import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const TabelaBusca = ({navigation, livros}) => {

    console.log(livros);
    const renderTableVendas = () => {
        if (livros && livros.length > 0) {
          
            return (
            <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}></Text>
                    <Text style={styles.headerText}>Name</Text>
                    <Text style={styles.headerText}>Stock</Text>
                    <Text style={styles.headerText}>Price</Text>
                </View>
      
              <FlatList
                data={livros}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item: livro }) => (
                    <Pressable style={styles.tableRow} onPress={() => navigation.navigate('EditLivro', {id: livro.id})}>
                        <View style={styles.imageContainer}>
                        {livro.imagem  && (
                            <Image
                            source={{ uri: livro.imagem }}
                            style={styles.productImage}
                            />
                        )}
                        </View>
                        <Text style={styles.rowText}>{livro.nome}</Text>
                        <Text style={styles.rowText}>{livro.estoque}</Text>
                        <Text style={styles.rowText}>${livro.preco}</Text>
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

export default TabelaBusca

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