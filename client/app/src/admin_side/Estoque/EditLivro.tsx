import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import DateTimePickerModal

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

const CATEGORIES = [
  { value: 'FICCAO_CIENTIFICA', label: 'Ficção Científica' },
  { value: 'ROMANCE', label: 'Romance' },
  { value: 'FANTASIA', label: 'Fantasia' },
  { value: 'BIOGRAFIA', label: 'Biografia' },
  { value: 'AVENTURA', label: 'Aventura' },
  { value: 'HISTORIA', label: 'História' },
  { value: 'MISTERIO', label: 'Mistério' },
  { value: 'TERROR', label: 'Terror' },
  { value: 'AUTOAJUDA', label: 'Autoajuda' },
  { value: 'EDUCACIONAL', label: 'Educacional' },
];

const EditLivro = ({ navigation, route }) => {
  const toast = useToast();
  const { id } = route.params ? route.params : 0;
  console.log(id);

  const [livro, setLivro] = useState<Livro>();
  
  const [nomeLivro, setNomeLivro] = useState('');
  const [estoque, setEstoque] = useState(0);
  const [preco, setPreco] = useState('');
  const [isbn, setIsbn] = useState('');
  const [categoria, setCategoria] = useState('');
  const [nomeAutor, setNomeAutor] = useState('');
  const [dataLancamento, setDataLancamento] = useState('');
  const [fotoLivro, setFotoLivro] = useState('');
  
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchLivro();
  }, []);

  const fetchLivro = async () => {
    if (id === 0) navigation.goBack();
    const data = { id };
    api
      .post('livros/get-by-id/', data)
      .then((response) => {
        const livroData = response.data;
        setLivro(livroData);

        setNomeLivro(livroData.nome);
        setEstoque(livroData.estoque);
        setPreco(livroData.preco);
        setIsbn(livroData.isbn);
        setCategoria(livroData.categoria);
        setNomeAutor(livroData.nome_autor);
        setDataLancamento(livroData.data_lancamento);
        setFotoLivro(livroData.foto_livro);
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

  const handleConfirmDate = (date: Date) => {
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    setDataLancamento(formattedDate);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
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

          <View style={styles.inputContainer}>
            <Text>Nome do livro</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder={livro.nome}
              placeholderTextColor={'gray'}
              value={nomeLivro}
              onChangeText={setNomeLivro}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Estoque</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder={livro.estoque.toString()}
              placeholderTextColor={'gray'}
              value={estoque.toString()}
              onChangeText={(text) => setEstoque(Number(text))}
              keyboardType="numeric" 
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Preço</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder={formatToBRL(livro.preco)}
              placeholderTextColor={'gray'}
              value={preco}
              onChangeText={setPreco}
              keyboardType="numeric" 
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>ISBN</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder={livro.isbn}
              placeholderTextColor={'gray'}
              value={isbn}
              onChangeText={setIsbn}
              keyboardType="numeric" 
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Data de lançamento</Text>
            <Pressable onPress={showDatePicker} style={styles.textInputStyle}>
              <Text style={{ color: dataLancamento ? 'black' : 'gray' }}>
                {dataLancamento || livro.data_lancamento}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.inputContainer, styles.pickerWrapper]}>
            <Text>Categoria</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
              >
                {CATEGORIES.map((category) => (
                  <Picker.Item key={category.value} label={category.label} value={category.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text>Autor</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder={livro.nome_autor}
              placeholderTextColor={'gray'}
              value={nomeAutor}
              onChangeText={setNomeAutor}
            />
          </View>
          <Pressable style={styles.updateButton} onPress={() => setModal(true)}>
            <Text style={{ fontSize: 16, color: 'white' }}>Save updates</Text>
          </Pressable>
        
          <Modal
              animationType="slide"
              transparent={true}
              visible={modal}
              onRequestClose={() => setModal(false)}
          >
              <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text>Confirma alteração de pedido?</Text>
                    <View style={styles.modalButtons}>
                      <Pressable style={styles.buttonConfirm}>
                        <Text style={styles.textButton}>Sim</Text>
                      </Pressable>
                      <Pressable style={styles.buttonDeny}>
                        <Text style={styles.textButton}>Não</Text>
                      </Pressable>
                    </View>
                  </View>
              </View>
          </Modal>
        

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
          />
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
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainViewContainer}>{renderLivro()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditLivro;

const styles = StyleSheet.create({
  mainViewContainer: {},
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
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '100%',
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
  updateButton: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  pickerWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems:'center'
  },
  modalButtons:{
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%',
  },
  buttonConfirm:{
    backgroundColor:'green',
    borderRadius:15,
    padding:10,
    width:'45%',
    alignItems:'center'
  },
  textButton:{
    fontSize:14,
    color:'white'
  },
  buttonDeny:{
    backgroundColor:'red',
    borderRadius:15,
    padding:10,
    width:'45%',
    alignItems:'center'
  }
});
