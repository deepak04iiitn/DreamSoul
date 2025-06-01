import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chats Screen</Text>
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

export default ChatsScreen; 