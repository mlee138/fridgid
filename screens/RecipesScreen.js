import React, { Component } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

export default class RecipesScreen extends Component {
  render(){
    return(
      <ScrollView>
        
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
