import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PairScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pair Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    color: '#333',
  },
});

export default PairScreen; 