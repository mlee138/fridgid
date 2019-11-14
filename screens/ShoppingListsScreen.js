import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  AsyncStorage,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ListItem, CheckBox } from 'react-native-elements';
import { MonoText } from '../components/StyledText';



export default class ShoppingListsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      text: ''
    };
  }

  componentDidMount = () => {
    AsyncStorage.getItem('list', (error,result) => {
      this.setState({ data: JSON.parse(result)}, function(){console.log('success!')})
    });
  }

  setName = () => {
    var newElement = {
      name: this.state.text,
      checked: false,
    }
    var newData = [...this.state.data, newElement];
    this.setState({ data: newData});
    AsyncStorage.setItem('list', JSON.stringify(newData))
      .then(json => console.log('success!'))
      .catch(error => console.log('error!'));
  }

  checkItem = () => {
    console.log(this.state.click);
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Shopping List</Text>
        </View>
        <TextInput
          value={this.state.text}
          style={styles.textInput} 
          onChangeText = {(value) => this.setState({text: value})}
          onSubmitEditing = {this.setName}
          onFocus = {() => this.setState({text: ''})}
          placeholder = 'Add item'/>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <CheckBox
              title={item.name}
              onPress={(title) => console.log(title),this.checkItem}
            />
          )}
          keyExtractor={item => item.name}
        />
      </View>
    );
  }
}

ShoppingListsScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
    padding: 3,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 5,
  },
});
