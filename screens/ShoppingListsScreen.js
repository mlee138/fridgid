import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, CheckBox, Icon, Tooltip } from 'react-native-elements';

export default class ShoppingListsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      text: '',
    };
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('list');
      if(value !== null){
        this.setState({data: JSON.parse(value)});
      }
    } catch (error){
      console.log("Error loading LIST from memory");
      console.log(error);
    }
  }

  storeList = async (newList) => {
    try {
      await AsyncStorage.setItem('list', JSON.stringify(newList));
    } catch (error) {
      console.log(error);
    }
  }

  handleAdd = (e) => {
    var input = e.nativeEvent.text;
    if(!this.checkDuplicate(input)){
      this.addItem(input);
    } else{
        Alert.alert(
          'No Duplicates Allowed',
          'Item has not been added',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
        );  
    }
    this.setState({ text: '' })
  }

  checkDuplicate = (input) => {
    var oldData = this.state.data;
    for(i=0; i<oldData.length; i++){
      if(oldData[i].name === input){
        return true;
      }
    }
    return false;
  }

  addItem = (input) => {
    var newElement = {
      name: input,
      checked: false,
    }
    var newData = [...this.state.data, newElement];
    this.setState({ data: newData});
    this.storeList(newData);
  }

  checkItem = (item) => {
    var newArray = this.state.data.map(function(obj){
      var newObj = {};
      newObj['name'] = obj.name;
      (obj.name === item ? 
        newObj['checked'] = !obj.checked : 
        newObj['checked'] = obj.checked)
      return newObj;
    });
    this.storeList(newArray);
    this.setState({data: newArray});
  }

  deleteItem = (itemName) => {
    const newData = this.state.data;
    for(i = 0; i < newData.length; i++){
      if(newData[i].name === itemName){
        newData.splice(i, 1);
        this.storeList(newData);
        this.setState({data: newData}); 
      }
    }
    if(newData.length === 0){ this.setState({data: []}); }
  }

  discardList = () => {
    console.log("delete entire list");
    Alert.alert(
      'Delete entire list?',
      'Are you sure you want to remove all items from your shopping list?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => {
          this.setState({data: []});
          this.storeList([]);
          }
        },
      ],
    ); 
  }

  fridgeAlert = () => {
    Alert.alert(
      'Send Checked items to Fridge?',
      'Any item sent will be placed in the fridge and removed from your shopping list.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.sendToFridge()},
      ],
    ); 
  }

  sendToFridge = () => {
    console.log("OK: send items to fridge");
    var date = new Date();
    dateStr = date.toDateString();
    var fridgeArray = [];
    this.state.data.forEach(element => {
      if(element.checked){
        var newObj = {
          name: element.name,
          date: dateStr,
        }
        fridgeArray.push(newObj);
        this.deleteItem(element.name);
      }
    });

    AsyncStorage.getItem('fridge', (error,result) => {
      var newFridge = JSON.parse(result).concat(fridgeArray);
      AsyncStorage.setItem('fridge', JSON.stringify(newFridge));
      AsyncStorage.setItem('updateFridge', 'true');
    });
  }

  render(){
    return (
      <ScrollView style={styles.container}>
        <View style={styles.inputs}>
          <TextInput
            maxLength={20}
            style={ styles.textInput }
            value = { this.state.text }
            onChangeText = {value => this.setState({ text: value })}
            onSubmitEditing = {e => this.handleAdd(e)}
            blurOnSubmit = {false}
            placeholder = 'Add item'/>
          <Text style={styles.divider}/>
          <Button
            type="clear"
            onPress={ this.discardList }
            icon={
              <Icon 
                name='trash' 
                type='entypo'
              />
            }
          />
          <Text style={styles.divider}/>
          <Button
            type="clear"
            onPress={ this.fridgeAlert }
            icon={
              <Icon 
                name='export' 
                type='entypo'
                color='#00aced'
              />
            }
          />
        </View>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <CheckBox
              title={item.name}
              checked={item.checked}
              onPress={() => this.checkItem(item.name)}
              onLongPress={() => this.deleteItem(item.name)}
            />
          )}
          keyExtractor={item => item.name}
        />
      </ScrollView>
    );
  }
}

ShoppingListsScreen.navigationOptions = {
  title: "Shopping List",
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
  inputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  textInput: {
    flexGrow:2,
    borderRadius: 20,
    backgroundColor: '#ececec',
    padding: 3,
    paddingLeft: 15,
    paddingRight: 15,
    marginRight: 8,
  },
  divider: {
    borderColor: 'gray',
    borderWidth: 1,
  },
});
