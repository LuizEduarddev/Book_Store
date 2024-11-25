import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../ApiConfigs/ApiRoute';
import { useToast } from 'react-native-toast-notifications';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchImageLibrary } from 'react-native-image-picker'; 
import { PermissionsAndroid } from 'react-native';

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

const CriarLivro = ({ navigation}) => {
  const toast = useToast();
  
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

  const tryEditarProduto = async () => {
    const data = {
      nomeLivro:nomeLivro,
      precoLivro:preco,
      estoqueLivro:estoque,
      isbn:isbn,
      categoria:categoria,
      dataLancamento:dataLancamento,
      autor:nomeAutor
    }
    api.post('livros/alterar/', data)
    .then(response => {
      toast.show('Sucefully updated!', {
        type: 'success',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    })
    .catch(error => {
      toast.show('Fail to update the book', {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    })
  }

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission to access photos',
          message: 'We need access to your photos to select an image.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can access the photos');
        return true; // Permissions granted
      } else {
        console.log('Permission denied');
        return false; // Permissions denied
      }
    } catch (err) {
      console.warn(err);
      return false; // Handle errors gracefully
    }
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

  const handlePickImage = async () => {
    // Request permissions before launching the image picker
    const hasPermission = await requestPermissions();
    if (hasPermission) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: false,
        },
        (response) => {
          if (response.didCancel) {
            console.log('User canceled image picker');
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {
            // Handle the selected image, for example, logging the image URI
            console.log(response.assets[0].uri); // You can use this URI as the selected image
          }
        }
      );
    } else {
      console.log('Permission denied. Cannot pick image.');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.bookContainer}>
            <Pressable onPress={handlePickImage} style={styles.pickImageEmpty}>
                {fotoLivro ? (
                    <Image source={{ uri: fotoLivro }} style={styles.bookImage} resizeMode="cover" />
                ) : (
                    <Text style={{color:'white', fontWeight:'900', fontSize:20}}>Pick an image</Text>
                )}
            </Pressable>      

          <View style={styles.inputContainer}>
            <Text>Nome do livro</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder='Book name'
              placeholderTextColor={'gray'}
              value={nomeLivro}
              onChangeText={setNomeLivro}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Estoque</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder='Stock'
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
              placeholder='Price'
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
              placeholder='ISBN'
              placeholderTextColor={'gray'}
              value={isbn}
              onChangeText={setIsbn}
              keyboardType="numeric" 
            />
          </View>
          <View style={styles.inputContainer}>
            <Text>Launch date</Text>
            <Pressable onPress={showDatePicker} style={styles.textInputStyle}>
              <Text style={{ color: dataLancamento ? 'black' : 'gray' }}>
                {dataLancamento || '01/01/1990'}
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
              placeholder='Autor name'
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
                    <Text>Confirma alteração de produto?</Text>
                    <View style={styles.modalButtons}>
                      <Pressable style={styles.buttonConfirm} onPress={() => {setModal(false), tryEditarProduto()}}>
                        <Text style={styles.textButton}>Sim</Text>
                      </Pressable>
                      <Pressable style={styles.buttonDeny} onPress={() => setModal(false)}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default CriarLivro;

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
    backgroundColor:'red    ',
    borderRadius:15,
    padding:10,
    width:'45%',
    alignItems:'center'
  },
  pickImageEmpty:{
    backgroundColor:'orange',
    color:'white',
    padding:30,
    width:'100%',
    alignItems:'center',
    borderRadius:15,
    margin:10
}
});
