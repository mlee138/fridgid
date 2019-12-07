import React, { Component } from 'react';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { Alert, AsyncStorage, Modal, View, SectionList, SafeAreaView, StyleSheet } from 'react-native';
import { Button, Card, Input, ListItem, Text } from 'react-native-elements';

export default class RecipesScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: [
        {
          title: "Chicken Cutlets",
          ingrediants: ["chicken"],
          steps: ['preheat over', 'done'],
        }
      ],
      editVisible: false,
      recipeName: '',
      oldRecipeName: '',
      newIngrediants: '',
      newDirections: '',
      viewRecipe: false,
      recipeIndex: 0,
    }
  }

  componentDidMount = async () => {
    try {
      const value = await AsyncStorage.getItem('recipes');
      if(value !== null){
        this.setState({ data: JSON.parse(value)});
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

  toCustomString = () => {

  }

  showEditModal = (visible, updateIndex) => {
    if(updateIndex === -1){
      this.setState({ recipeName: '' });
      this.setState({ newIngrediants: '' });
      this.setState({ newDirections: '' });
    } else {
      var currentRecipe = this.state.data[updateIndex];
      var ingrediants = currentRecipe.ingrediants.join(",");
      var steps = currentRecipe.steps.join("/");
      var name = currentRecipe.title;
      this.setState({ recipeName: name });
      this.setState({ oldRecipeName: name });
      this.setState({ newIngrediants: ingrediants });
      this.setState({ newDirections: steps });
    }
    this.setState({ editVisible: visible });
  }

  viewRecipe = (visible, index) => {
    this.setState({viewRecipe: visible});
    this.setState({ recipeIndex: index});
  }

  noDuplicates = () => {
    for(i=0; i<this.state.data.length; i++){
      if(this.state.data[i].name == this.state.recipeName){
        return false;
      }
    }
    return true;
  }

  handleRecipeSubmit = () => {
    if(this.state.recipeName){
      (this.state.modalType == 'new' ?
      this.addRecipe() :
      this.editRecipe()
      );
      this.showEditModal(!this.state.editVisible, -1);
    } else{
      Alert.alert(
        'Error: Empty recipe name',
        'No recipe name was found',
        [ 
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
      );
    }
    
  }

  addRecipe = () => {
    if(this.state.recipeName && this.noDuplicates()){
      var ingrediants = this.state.newIngrediants.split(",");
      var directions = this.state.newDirections.split('/');

      var newElement = {
        title: this.state.recipeName,
        ingrediants: ingrediants,
        steps: directions,
      }

      var newData = [...this.state.data, newElement];
      this.setState({ data: newData});
      this.storeRecipes(newData);

    } else {
      Alert.alert(
        'No Duplicates Allowed',
        'The recipe name duplicate',
        [ 
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
      );
    }
  }

  editRecipe = () => {
    var newObj = {
      title: this.state.recipeName,
      ingrediants: this.state.newIngrediants.split(','),
      steps: this.state.newDirections.split('/'),
    };

    var oldName = this.state.oldRecipeName;

    var newArray = this.state.data.map(function(obj){
      if(obj.title === oldName){
        return newObj;
      } else { return obj; }
    });
    this.storeRecipes(newArray);
    this.setState({ data: newArray });
  }

  deleteRecipe = () => {
    const newData = this.state.data;
    newData.splice(this.state.recipeIndex, 1);
    this.storeRecipes(newData);
    this.setState({ data: newData });

    if(newData.length === 0){ this.setState({ data: [] }); }
    this.setState({ recipeIndex: 0});
    this.setState({ viewRecipe: false });
  }

  render(){
    return(
      <ScrollView>
        <Button
          title="New Recipe"
          onPress={() => (
            this.setState({ modalType: "new"}),
            this.showEditModal(!this.state.editVisible, -1)
          )}/>
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
            this.showEditModal(!this.state.editVisible, -1)
          }}>
          <View>
            <Input
              placeholder="Ex: Chicken Cutlets"
              label="Recipe Name"
              value={this.state.recipeName}
              onChangeText= { text => this.setState({ recipeName: text})}/>
            <Input
              placeholder="separate items with commas (Ex: chicken breast, eggs)"
              label="Ingrediants"
              value={this.state.newIngrediants}
              onChangeText= {text => this.setState({ newIngrediants: text})}/>
            <Input 
              placeholder="separate steps with /"
              label="Directions"
              value={this.state.newDirections}
              onChangeText={text => this.setState({ newDirections: text })}/>     
            
            <View>
                <Button
                title="cancel"
                onPress={() => this.showEditModal(!this.state.editVisible, -1)}
                />
                <Button
                title="confirm"
                onPress={ this.handleRecipeSubmit}
                />
              </View>
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
          <Button
            title="Edit"
            onPress={() => (
              this.setState({ modalType: 'edit' }),
              this.showEditModal(!this.state.showEditModal, this.state.recipeIndex)
            )}/>
          <Button
            title="Delete"
            onPress={() => this.deleteRecipe()}/>
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