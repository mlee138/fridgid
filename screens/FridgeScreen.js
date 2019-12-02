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
      addVisible: false,
      showPicker: false,
      item: '',
      date:"05-15-2018",
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("fridge", (error, result) => {
      this.setState({ data: JSON.parse(result)}, function(){ console.log("fridge loaded!")})
    });

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

  storeFridge = (newFridge) => {
    AsyncStorage.setItem('fridge', JSON.stringify(newFridge))
    .then(json => console.log('fridge saved!'))
    .catch(error => console.log('error saving fridge!'));
  }

  addFridgeItem = () => {
    if(this.state.item){

    } else {
      var newElement = {
        name: this.state.item,
        date: this.state.date,
      }
      var newData = [...this.state.data, newElement];
      this.setState({ data: newData});
      this.storeFridge(newData);

      this.setModalVisible(!this.state.addVisible);
    }
    
  }

  setModalVisible = (visible) => {
    this.setState({ addVisible: visible });
  }

  render(){    
    return (
      <ScrollView style={styles.container}>
        <View>
          <Button
            title="Add Item"
            onPress={() => {
              this.setModalVisible(!this.state.addVisible)
            }}/>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.addVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.addVisible)
          }}>
          <Text>Add Fridge Item</Text>
          <View style={styles.datepicker}>
            <Input
              placeholder="Item name"
              label="Name"
              value={this.state.item}
              onChangeText= { text => this.setState({ item: text})}/>
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
              <View style={styles.modalBtns}>
                <Button
                title="cancel"
                onPress={() => this.setModalVisible(!this.state.addVisible)}
                />
                <Button
                title="confirm"
                onPress={() => this.addFridgeItem}
                />
              </View>
            </View>            
        </Modal>
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
