import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications'
import RenderCategorias from './RenderCategorias';

const Home = ({navigation}) => {
  const toast = useToast();

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
