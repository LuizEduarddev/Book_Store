import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import debounce from 'lodash.debounce'
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';

type Livros = {
    id: string,
    nome: string,
    preco: number,
    quantidadeVendido: number,
    estoque:string,
    imagemLivro:string,
    totalEarned:number,
};

const BuscarLivro = ({ onSearchResult }) => {
    
    const toast = useToast();
    const [busca, setBusca] = useState('');
    const [livro, setLivro] = useState<Livros[]>([]);

    const findProduto = async (query: string) => {
        const data = {
            nome:query
        }
        api.post('livros/get-by-nome/', data)
        .then(response => {
            setLivro(response.data);
            onSearchResult(response.data);
        })
        .catch(error => {
            toast.show('Seach failed', {
                type: 'warning',
                placement: 'top',
                duration: 4000,
                animationType: 'slide-in',
              });
        })
        
    };

    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query.length > 0) {
                findProduto(query);
            } else {
                setLivro([]);
                onSearchResult([]);
            }
        }, 600),
        []
    );

    useEffect(() => {
        debouncedSearch(busca);
        return () => {
            debouncedSearch.cancel();
        };
    }, [busca]);

    return (
        <SafeAreaView>
            <View>
                <TextInput
                    style={styles.field}
                    value={busca}
                    placeholder="🔍 | Search for a book"
                    onChangeText={setBusca}
                />
            </View>
        </SafeAreaView>
    );
};

export default BuscarLivro

const styles = StyleSheet.create({
    field: {
        width: '95%',
        borderWidth: 1,
        borderColor: 'orange',
        borderRadius: 15,
        padding: 10,
        fontSize: 16,
        color: 'black', 
        backgroundColor: 'white',
        alignSelf:'center'
    },
})