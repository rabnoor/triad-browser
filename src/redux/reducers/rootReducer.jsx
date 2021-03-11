import { combineReducers } from 'redux';
import oracle from './oracleReducer';
import genome from './genomeReducer';

const rootReducer = combineReducers({
  // short hand property names
  oracle,
  genome
})

export default rootReducer;  