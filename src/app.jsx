/*global $*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Container } from './components';
import ChromosomePage from './pages/ChromosomePage';
import GenomePage from './pages/GenomePage';
import configureStore from './redux/store/configureStore';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import GT from 'gt-client';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


//Root sass file for webpack to compile
import './sass/main.scss';

//Initial Default settings 
const store = configureStore();


class App extends Component {

  async componentDidMount() {
    const gt = new GT('http://localhost:3000/')

    try {
      await gt.connect()
      const myUniqueID = shortid();
      await gt.auth(myUniqueID)
    } catch (e) {
      // connection error! abort
      console.error(e)
      return
    }

    let { room, roomState, users } = await gt.join('roomName', { test: 'this argument is optional' })

    console.log(`We joined room ${room}\n\n`)

    console.log('The rooms state is:')
    console.log(roomState)
    console.log('\n\n')


    console.log('The users in the room and their states:')
    console.log(users)
    console.log('\n\n')

    // fires when WE disconnect.
    gt.on('disconnect', (reason) => {
      console.log(`We have disconnected from the server: ${reason}`)
    })

    // fires when someone has joined the room (including ourselves).
    gt.on('connected', (id, userState) => {
      console.log(`ID ${id} has joined with state:`)
      console.log(userState)
      console.log('\n\n')
    })

    // fires when someone left the room
    gt.on('disconnected', (id, reason) => {
      console.log(`ID ${id} has left with reason: ${reason}`)
    })


    // these will fire when the room/user state changes.
    gt.on('user_updated_reliable', (id, payloadDelta) => {
      console.log(`ID ${id} has updated their state:`)
      console.log(payloadDelta)
      console.log('\n\n')

      // handle the state change
    })
    gt.on('user_updated_unreliable', (id, payloadDelta) => {
      ///
    })

    gt.on('state_updated_reliable', (id, payloadDelta) => {
      console.log(`ID ${id} has updated the room's state:`)
      console.log(payloadDelta)
      console.log('\n\n')

      // handle the state change
    })
    gt.on('state_updated_unreliable', (id, payloadDelta) => {
      // ...
    })

  }

  render() {
    return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path='/' component={Container}>
            <IndexRoute component={ChromosomePage} />
            <Route path='genome-view' component={GenomePage} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('triad-browser-mount'));


function mapDispatchToProps(dispatch) {
  return {
      actions: bindActionCreators({
          setGenomeData,
          setGenomeDataThreshold,
          setChromosomeData,
          setDefaultDataChromosome,
          setActiveSubGenome,
      }, dispatch)
  };
}

function mapStateToProps(state) {
  return {
      // fill in with props that you need to read from state
      genomeData: state.genome.genomeData,
      chromosomeData: state.genome.chromosomeData,
      geneData: state.genome.geneData,
      activeSubGenome: state.oracle.activeSubGenome,
      activeChromosome: state.oracle.activeChromosome,
      isTooltipVisible: state.oracle.isTooltipVisible,
      tooltipData: state.oracle.tooltipData,
      region: state.oracle.region
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


