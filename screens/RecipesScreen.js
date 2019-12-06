import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { AsyncStorage, Modal, Text, View } from 'react-native';
import { Button, Card, Input, ListItem } from 'react-native-elements';

export default class RecipesScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [
        {
          title: 'Chicken Cutlet',
          ingrediants: ['chicken breasts', 'bread-crumbs', 'flour', 'eggs'],
        },

        {
          title: 'PB&J',
          ingrediants: ['bread', 'jam', 'peanut butter'],
        },
      ],
      modalVisible: false,
      recipeName: '',
    }
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('recipes');
      if(value !== null){
        this.setState({ data: this.state.data.concat(JSON.parse(value))});
      }
    } catch (error) {
      console.log("Error loading RECIPES from storage");
      console.log(error);
    }
  }

  storeRecipes = async (newRecipes) => {
    try {
      await AsyncStorage.setItem('recipes', JSON.stringify(newRecipes));
    } catch (error) {
      console.log(error);
    }
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render(){
    return(
      <ScrollView>
        <Button
          title="New Recipe"
          onPress={() => this.setModalVisible(!this.state.modalVisible)}/>
        <FlatList
          data={ this.state.data }
          renderItem={({ item }) => (
            <Card title={ item.title }>
            </Card>
          )}
          keyExtractor={item => item.title}
        />
        
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!this.state.modalVisible)
          }}>
          <Text>Create Recipe</Text>
          <View>
            <Input
              placeholder="Ex: Chicken Cutlets"
              label="Recipe Name"
              value={this.state.recipeName}
              onChangeText= { text => this.setState({ recipeName: text})}/>
              
          </View>            
        </Modal>
      </ScrollView>
    );
  }
}

RecipesScreen.navigationOptions = {
  title: 'Recipes',
  headerTitleStyle: {
    flexGrow: 2,
  }
};
