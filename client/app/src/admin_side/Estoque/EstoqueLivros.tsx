import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabelaMaisVendidos from '../home_admin/TabelaMaisVendidos';
import BuscarLivro from './BuscarLivro';
import TabelaBusca from './TabelaBusca';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const EstoqueLivros = ({ navigation }) => {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchResult = (results) => {
        setSearchResults(results);
    };

    return (
        <SafeAreaView style={styles.container}>
            <BuscarLivro onSearchResult={handleSearchResult} />

            {searchResults.length === 0 ? (
                <FlatList
                    data={[{}]}
                    renderItem={() => <TabelaMaisVendidos navigation={navigation} from={"estoque"} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <TabelaBusca livros={searchResults} navigation={navigation} />
            )}

            <Pressable style={styles.buttonAdicionar} onPress={() => navigation.navigate("CriarLivro")}>
                <FontAwesome5 name="plus" size={35} color="white" />
            </Pressable>
        </SafeAreaView>
    );
};

export default EstoqueLivros;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonAdicionar: {
        borderRadius: 100,
        padding: 10,
        backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
        height: 55, 
        position: 'absolute',
        bottom: 20, 
        right: 20, 
    },
});
