import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default class FridgeScreen extends Component  {
  render(){
    return (
      <ScrollView style={styles.container}>

      </ScrollView>
    );
  }
}

FridgeScreen.navigationOptions = {
  title: 'My Fridge',
  headerTitleStyle: {
    flexGrow: 2,
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
