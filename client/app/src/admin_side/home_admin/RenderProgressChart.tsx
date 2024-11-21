import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineChart, ProgressChart } from 'react-native-chart-kit'

const RenderProgressChart = ({data}) => {
  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Progressive Category Sales Chart</Text>

        <LineChart
          data={{
            labels: categories,
            datasets: [
              {
                data: cumulativeQuantities,
                strokeWidth: 2, // Line thickness
              },
            ],
          }}
          width={screenWidth - 40} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#ff6f00',
            backgroundGradientTo: '#ff3d00',
            decimalPlaces: 0, // Optional, to remove decimals
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
        />

        <Text style={{ marginTop: 20 }}>
          This chart shows the progressive sales of books by category.
        </Text>
      </View>
    </ScrollView>
  )
}

export default RenderProgressChart

const styles = StyleSheet.create({})