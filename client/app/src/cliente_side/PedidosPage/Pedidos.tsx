import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Pedidos = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.text}>Olá, de pedidos!</Text>
        </View>
    </SafeAreaView>
  )
}

export default Pedidos

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
