import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ShoppingListsScreen from '../screens/ShoppingListsScreen';
import FridgeScreen from '../screens/FridgeScreen';
import RecipesScreen from '../screens/RecipesScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const ShoppingListsStack = createStackNavigator(
  {
    Home: ShoppingListsScreen,
  },
  config
);

ShoppingListsStack.navigationOptions = {
  tabBarLabel: 'Shopping List',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-list-box${focused ? '' : '-outline'}`
          : 'md-list-box'
      }
    />
  ),
};

ShoppingListsStack.path = '';

const FridgeStack = createStackNavigator(
  {
    Links: FridgeScreen,
  },
  config
);

FridgeStack.navigationOptions = {
  tabBarLabel: 'Fridge',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-nutrition' : 'md-nutrition'} />
  ),
};

FridgeStack.path = '';

const RecipesStack = createStackNavigator(
  {
    Settings: RecipesScreen,
  },
  config
);

RecipesStack.navigationOptions = {
  tabBarLabel: 'Recipes',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-paper' : 'md-paper'} />
  ),
};

RecipesStack.path = '';

const tabNavigator = createBottomTabNavigator({
  ShoppingListsStack,
  FridgeStack,
  RecipesStack,
});

tabNavigator.path = '';

export default tabNavigator;
