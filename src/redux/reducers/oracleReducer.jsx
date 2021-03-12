import * as types from '../actions/actionTypes';
import initialState from './initialState';

// Perils of having a nested tree strucutre in the Redux State XD XD XD 
export default function oracleReducer(state = initialState.oracle, action) {
  switch (action.type) {
    case types.SET_TOOLTIP_VISIBILITY:
      return Object.assign({}, state, { 'isTooltipVisible': action.isTooltipVisible })
    case types.SET_TOOLTIP_DATA:
      return Object.assign({}, state, { 'tooltipData': action.tooltipData })
    case types.SET_ACTIVE_CHROMOSOME:
      return Object.assign({}, state, { 'activeChromosome': action.activeChromosome })
    case types.SET_ACTIVE_SUBGENOME:
      return Object.assign({}, state, { 'activeSubGenome': action.activeSubGenome })
    case types.SET_REGION:
      return Object.assign({}, state, { 'region': { ...action.region } })
    case types.SET_ACTIVE_GENES:
      return Object.assign({}, state, { 'activeGenes':  [...action.activeGenes] })
    default:
      return state;
  }
}
