import React, { Component } from 'react';
import { Alert, AsyncStorage, Modal, ScrollView, StyleSheet, Text, View, Button, } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Input } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class FridgeScreen extends Component  {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      update: true,
      addVisible: false,
      showPicker: false,
      date: new Date(),
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("fridge", (error, result) => {
      this.setState({ data: JSON.parse(result)}, function(){ console.log("fridge loaded!")})
    });
    var today = new Date();
    today = today.toDateString();
    this.setState({ date: today });

  }

  setAddModalVisible = (visible) => {
    this.setState({ addVisible: visible });
  }

  showDatePicker = (visible) => {
    this.setState({ showPicker: visible })
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  }


  render(){    
    return (
      <ScrollView style={styles.container}>
        <View>
          <Button
            title="Add Item"
            onPress={() => {
              this.setAddModalVisible(!this.state.addVisible)
            }}/>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.addVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <Text>Add Fridge Item</Text>
          <Input
            placeholder="Item name"
            label="Name"/>
          <Text>{this.state.date}</Text>
          <Button 
            onPress={() => this.showDatePicker(!this.state.showPicker)} title="Show date picker!" />
          <Button
            title="back"
            onPress={() => this.setAddModalVisible(!this.state.addVisible)}
            />
          { this.state.showPicker && <RNDateTimePicker value={this.state.date}
                    display="default"
                    onChange={this.setDate} />
        }
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
});
