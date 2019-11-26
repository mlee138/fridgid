import React, { Component } from 'react';
import { ScrollView, StyleSheet, AsyncStorage } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';

export default class FridgeScreen extends Component  {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      update: true,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("fridge", (error, result) => {
      this.setState({ data: JSON.parse(result)}, function(){ console.log("fridge loaded!")})
    });
  }

  updateFridge = () => {
    AsyncStorage.getItem("fridge", (error, result) => {
      this.setState({ data: JSON.parse(result)}, function(){ console.log("fridge loaded!")})
    });
    AsyncStorage.setItem('updateFridge', 'false');
  }


  render(){
    if(this.state.update){
      AsyncStorage.getItem("fridge", (error, result) => {
        var stateObj = {
          data: JSON.parse(result),
          update: false
        }
        this.setState(stateObj);
      });
    } else {
      console.log("it has updated");
    }
    
    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={ this.state.data }
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              bottomDivider
            />
          )}
          keyExtractor={item => item.name}
        />
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
