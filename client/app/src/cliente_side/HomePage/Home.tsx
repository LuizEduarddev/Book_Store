import { SafeAreaView, StyleSheet, View } from 'react-native'
import React from 'react'
import RenderCategorias from './RenderCategorias';

const Home = ({navigation}) => {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.categoriesContainer}>
        <RenderCategorias navigation={navigation} />
      </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
})
