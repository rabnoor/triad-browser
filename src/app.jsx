/*global $*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ChromosomeView, GenomeView} from './components';
import configureStore from './redux/store/configureStore';
import { Provider } from 'react-redux';

//Root sass file for webpack to compile
import './sass/main.scss';

//Initial Default settings 
const store = configureStore();


class App extends Component {

  render() {
    return (
      <Provider store={store} >
        <GenomeView />
      </Provider>)
  }
}

ReactDOM.render(<App />, document.getElementById('triad-browser-mount'));


