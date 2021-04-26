import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import ItemsNavigator from './navigation/ItemsNavigator';
import itemsReducer from './store/items-reducer'
import { init } from './components/database'

//initializing the database at the start of the app
init().then(() => {
  console.log('Initialized Database')
}).catch(error => {
  console.log('Database failed to load');
  console.log(error);
});

//implementing reduce file using REDUX and REDUX thunk
const rootReducer = combineReducers({
  items: itemsReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


export default function App() {
  return (<Provider store={store}><ItemsNavigator /></Provider>);
}


//test
//testing to transfer repository
