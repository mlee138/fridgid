import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { AsyncStorage, Modal, View, SectionList, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Card, Input, ListItem, Text } from 'react-native-elements';

export default class RecipesScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [
        {
          title: 'Chicken Cutlet',
          ingrediants: ['chicken breasts', 'bread-crumbs', 'flour', 'eggs'],
          steps: ['first', 'second'],
        },

        {
          title: 'PB&J',
          ingrediants: ['bread', 'jam', 'peanut butter'],
          steps: ['first', 'second'],
        },
      ],
      editVisible: false,
      recipeName: '',
      viewRecipe: false,
      recipeIndex: 0,
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

  showEditModal = (visible) => {
    this.setState({ editVisible: visible });
  }

  viewRecipe = (visible, index) => {
    this.setState({viewRecipe: visible});
    this.setState({ recipeIndex: index});
  }

  render(){
    const DATA =[
      
    ]
    return(
      <ScrollView>
        <Button
          title="New Recipe"
          onPress={() => this.showEditModal(!this.state.editVisible)}/>
        <SafeAreaView>
        <FlatList
        data={this.state.data}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item, index }) => (
          <ListItem 
            title={item.title} 
            onPress={()=> this.viewRecipe(!this.state.viewRecipe, index)}
            bottomDivider
            chevron
          />
        )}
      />
        </SafeAreaView>
        
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.editVisible}
          onRequestClose={() => {
            this.showEditModal(!this.state.editVisible)
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

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.viewRecipe}
          onRequestClose={() => {
            this.viewRecipe(!this.state.viewRecipe, 0)
          }}>
          <Text h3>{this.state.data[this.state.recipeIndex].title}</Text>
          <Card title="Ingrediants">
            <FlatList
              data={this.state.data[this.state.recipeIndex].ingrediants}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <ListItem 
                  title={item} 
                  bottomDivider
                />)}
            />
          </Card>
        
          <Card title="Directions">
            <FlatList
              data={this.state.data[this.state.recipeIndex].steps}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <ListItem 
                  title={item} 
                  bottomDivider
                />)}
            />
          </Card>
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


const styles = StyleSheet.create({
  SectionList: {
    textAlign: 'center',
  },
  SectionListHeader:{
    textAlign: 'center',
    backgroundColor : '#CDDC39',
    fontSize : 20,
    padding: 5,
    color: '#fff',
  },
 
  SectionListItem:{
 
    fontSize : 15,
    padding: 5,
    color: '#000',
    backgroundColor : '#F5F5F5'
 
  }
});