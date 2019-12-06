import React, { Component } from 'react';
import { Alert, AsyncStorage, Modal, ScrollView, StyleSheet, Text, View, Button, } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'

export default class FridgeScreen extends Component  {
  constructor(props){
    super(props);
    this.today;

    this.state = {
      data: [],
      update: true,
      modalVisible: false,
      modal: 'Add',
      showPicker: false,
      item: '',
      date:"05-15-2018",
    }
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('fridge');
      if(value !== null){
        this.setState({data: JSON.parse(value)});
      }
    } catch (error){
      console.log("Error loading FRIDGE from memory");
      console.log(error);
    }

    this.convertDate();
  }

  convertDate = () => {
    this.today = new Date();
    this.today = this.today.toISOString().substr(0,10);
    var res = this.today.split("-");
    var year = res[0];
    res.shift();
    res.push(year);
    str1 = res.toString()
            .replace(new RegExp(",", "g"), '-');
    console.log(str1);
    this.today = str1;
    this.setState({ date: str1 });
  }

  storeFridge = async (newFridge) => {
    try {
      await AsyncStorage.setItem('fridge', JSON.stringify(newFridge));
    } catch (error) {
      console.log(error);
    }
  }

  handleOpenModal = (modalType, itemName, itemDate) => {
    switch(modalType){
      case 'Add':
          this.setState({ item: ''});
          this.setState({ date: this.today});
        break;
      case 'Update':
          this.setState({ item: itemName });
          this.setState({ oldItem: itemName });
          this.setState({ date: itemDate });
        break;
      default:
        console.log("handleOpenModal Error probably");
        break;
    }
    this.setState({ modal: modalType});
    this.setModalVisible(!this.state.modalVisible);
  }

  handleFridgeSubmit = () => {
    switch(this.state.modal){ 
      case "Add":
        this.addFridgeItem();
        break;
      case "Update":
        this.updateFridgeItem();
        break;
      default:
        console.log("Well this is awkward");
        break;
    }
  }

  noDuplicates = () => {
    var noDuplicates = true;
    this.state.data.forEach(element => {
      if(element.name == this.state.item){ 
        noDuplicates = false;
      }
    })
    return noDuplicates;
  }

  addFridgeItem = () => {
    if(this.state.item && this.noDuplicates()){
      var newElement = {
        name: this.state.item,
        date: this.state.date,
      }
      var newData = [...this.state.data, newElement];
      this.setState({ data: newData});
      this.storeFridge(newData);

      this.setModalVisible(!this.state.modalVisible);
    } else {
      Alert.alert(
        'User Error',
        'The item entered is either a duplicate or has no name',
        [ 
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
      );
    }
  }

  updateFridgeItem = () => {
    var oldName = this.state.oldItem;
    var newName = this.state.item;
    var newDate = this.state.date;

    var newArray = this.state.data.map(function(obj){
      var newObj = {};
      if(obj.name === oldName){
        newObj = {
          name: newName,
          date: newDate,
        }
        return newObj;
      } else{
        return obj;
      }
    })
    this.storeFridge(newArray);
    this.setState({ data: newArray});
    this.setModalVisible(!this.state.modalVisible);
  }

  deleteItem = (itemName) => {
    const newData = this.state.data;
    for(i = 0; i < newData.length; i++){
      if(newData[i].name === itemName){
        newData.splice(i, 1);
        this.storeFridge(newData);
        this.setState({data: newData}); 
      }
    }
    if(newData.length === 0){ this.setState({data: []}); }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render(){    
    return (
      <ScrollView style={styles.container}>
        <View>
          <Button
            title="Add Item"
            onPress={() => this.handleOpenModal('Add')}/>
        </View>
        <FlatList
          data={ this.state.data }
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              bottomDivider
              onPress={() => this.handleOpenModal('Update', item.name, item.date) }
              onLongPress={() => this.deleteItem(item.name)}
            />
          )}
          keyExtractor={item => item.name}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible)
          }}>
          <Text>{this.state.modal} Fridge Item</Text>
          <View style={styles.datepicker}>
            <Input
              placeholder="Item name"
              label="Name"
              value={this.state.item}
              onChangeText= { text => this.setState({ item: text})}
              autoFocus/>
              <View>
                <Text>Date put in fridge:</Text>
                <DatePicker
                  style={{width: 200}}
                  date={this.state.date} //initial date from state
                  mode="date" //The enum of date, datetime and time
                  placeholder="select date"
                  format="MM-DD-YYYY"
                  minDate="01-01-2016"
                  maxDate={this.today}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />
              </View>
              
              <View>
                <Button
                title="cancel"
                onPress={() => this.setModalVisible(!this.state.modalVisible)}
                />
                <Button
                title={this.state.modal}
                onPress={ this.handleFridgeSubmit}
                />
              </View>
            </View>            
        </Modal>
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
  datepicker: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'space-evenly',
    marginTop: 50,
    padding:16
 },
 modalBtns: {
    flexDirection: 'row',
 }, 
});
