import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function genomeReducer(state = initialState.genome, action) {
    switch (action.type) {
        case types.SET_GENOME_DATA:
            return Object.assign({}, state, { 'genomeData': { ...action.genomeData } });
        case types.SET_CHROMOSOME_DATA:
            return Object.assign({}, state, { 'chromosomeData': [...action.chromosomeData] });
        case types.SET_GENE_DATA:
            return Object.assign({}, state, { 'geneData': {...action.geneData} });
        default:
            return state;
    }
}
