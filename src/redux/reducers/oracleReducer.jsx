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
      return Object.assign({}, state, { 'activeGenes': [...action.activeGenes] })
    case types.SET_GENOME_REGION:
      return Object.assign({}, state, { 'genomeRegion': { ...action.genomeRegion } })
    case types.SET_ROOM_NAME:
      return Object.assign({}, state, { 'RoomName': action.RoomName })
    case types.SET_USER_NAME:
      return Object.assign({}, state, { 'Username': action.Username })
    case types.SET_CONNECTION_STATUS:
      return Object.assign({}, state, { 'Connection': action.Connection })
    default:
      return state;
  }
}
