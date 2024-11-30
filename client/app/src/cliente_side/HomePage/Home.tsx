import { Modal, Pressable, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import RenderCategorias from './RenderCategorias';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalAthena from './ModalAthena';

const Home = ({ navigation }) => {
  const [modal, setModal] = useState(false);
  const [safeRequest, setSafeRequest] = useState(false); // State to track the safe request status

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoriesContainer}>
        <RenderCategorias navigation={navigation} />
      </View>

      <Pressable style={styles.buttonAthena} onPress={() => setModal(true)}>
        <AntDesign name="search1" size={35} color="white" />
      </Pressable>

      {modal === true ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => setModal(false)}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={() => setModal(false)} // Close modal if outside is pressed
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              {/* Pass setModal and setSafeRequest to ModalAthena */}
              <ModalAthena 
                navigation={navigation} 
                setModal={setModal} 
                setSafeRequest={setSafeRequest} 
              />
            </View>
          </Pressable>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  categoriesContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  buttonAthena: {
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
    height: '80%',
    alignItems: 'center',
  },
});
