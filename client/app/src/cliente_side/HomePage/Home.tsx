import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useToast } from 'react-native-toast-notifications'
import RenderCategorias from './RenderCategorias';

const Home = ({navigation}) => {
  const toast = useToast();

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <RenderCategorias navigation={navigation}/>
        </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,          
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,           
    justifyContent: 'center',
    alignItems: 'center',    
    padding: 16,       
  },
  text: {
    fontSize: 18,
  }
})
