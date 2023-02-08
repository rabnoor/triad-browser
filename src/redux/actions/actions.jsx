import * as types from './actionTypes';
import _ from 'lodash';
import { dispatch } from 'd3-dispatch';

export function showTooltip(isTooltipVisible, tooltipData) {
    return dispatch => {


        if (!!tooltipData) {

            dispatch({ type: types.SET_TOOLTIP_DATA, tooltipData });
            // dispatch(setActiveGenes([tooltipData.gene]));
            dispatch({ type: types.SET_TOOLTIP_VISIBILITY, isTooltipVisible });
        } else {

            dispatch({ type: types.SET_TOOLTIP_VISIBILITY, isTooltipVisible });
            // dispatch(setActiveGenes([]));
        }
    };
}



export function setChromosomeData(activeChromosome, genomeData) {
    const chromosomeData = genomeData[activeChromosome];
    return dispatch => {
        dispatch(setActiveGenes([]));
        dispatch(showTooltip(false));
        dispatch({ type: types.SET_ACTIVE_CHROMOSOME, activeChromosome });
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
    };
}

export function setGenomeData(activeSubGenome, activeChromosome) {

    let { chromosomeData, genomeData } = _.cloneDeep(window.triadBrowserStore);

    if (activeSubGenome != "N/A" && !activeSubGenome.includes('%')) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) => d[activeSubGenome])
        });
        chromosomeData = genomeData[activeChromosome];
    }

    return dispatch => {
        dispatch(setActiveGenes([]));
        dispatch(showTooltip(false));

        dispatch({ type: types.SET_ACTIVE_SUBGENOME, activeSubGenome });
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
    };
}

export function setGenomeDataThreshold(activeSubGenome, activeChromosome) {
    let { chromosomeData, genomeData } = _.cloneDeep(window.triadBrowserStore);

    function checkThreshold(activeSubGenome, d){

        {for (var subG in d){
            if (d[subG] < activeSubGenome[subG]){
                return false;
            }
        }
        return true;
    }
}
   
    _.map(_.keys(genomeData), (chromosome) => {
        genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
            checkThreshold(activeSubGenome, d)
        );
    });

    chromosomeData = genomeData[activeChromosome];
    return dispatch => {

        dispatch(setActiveGenes([]));
        dispatch(showTooltip(false));

        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
    };
}


export function sortGenomeViewData(activeSubGenome) {
    let { genomeData } = _.cloneDeep(window.triadBrowserStore);

    let genomeViewData = _.reduce(_.keys(genomeData).sort(), (acc, value) => [...acc, ...genomeData[value]], []);

    if (activeSubGenome != "N/A" && !activeSubGenome.includes('%')) {
       
        genomeViewData = _.sortBy(genomeViewData, (d) => d[activeSubGenome]);

    }

    return dispatch => {
        dispatch(setActiveGenes([]));
        dispatch(showTooltip(false));

        dispatch({ type: types.SET_ACTIVE_SUBGENOME, activeSubGenome });
        dispatch({ type: types.SET_GENOME_VIEW_DATA, genomeViewData });
    };
}

export function sortGenomeViewDataThreshold(activeSubGenome, activeChromosome) {
    let { genomeData } = _.cloneDeep(window.triadBrowserStore);

    let genomeViewData = _.reduce(_.keys(genomeData).sort(), (acc, value) => [...acc, ...genomeData[value]], []);


    function sortingLogic(activeSubGenome, d){
        for (var subG in d){
            if (d[subG] < activeSubGenome[subG] && activeSubGenome[subG] != 0){
                return false;
            }
        }
        return true;
    
    }
    genomeViewData = _.sortBy(genomeViewData, (d) => 
            sortingLogic(activeSubGenome, d)
        );
    return dispatch => {
        dispatch(setActiveGenes([]));
        dispatch(showTooltip(false));

        dispatch({ type: types.SET_ACTIVE_SUBGENOME, activeSubGenome });
        dispatch({ type: types.SET_GENOME_VIEW_DATA, genomeViewData });
    };
}

export function setDefaultDataWholeGenome(chromosomeData, genomeData, geneData, genomeViewData) {
    return dispatch => {
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
        dispatch({ type: types.SET_GENE_DATA, geneData });
        dispatch({ type: types.SET_GENOME_VIEW_DATA, genomeViewData });

    };
}


export function setDefaultDataChromosome(chromosomeData, genomeData, geneData, region) {
    return dispatch => {
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
        dispatch({ type: types.SET_GENE_DATA, geneData });
        dispatch({ type: types.SET_REGION, region });
    };
}

export function setUsernameAndRoom(RoomName, Username, Connection) {
    return dispatch => {
        dispatch({ type: types.SET_ROOM_NAME, RoomName });
        dispatch({ type: types.SET_USER_NAME, Username });
        dispatch({type: types.SET_CONNECTION_STATUS, Connection})
    };
}

export function setGenomeViewData(genomeViewData) {
    return ({ type: types.SET_GENOME_VIEW_DATA, genomeViewData });
}

export function setRegion(region) {

    let toSet = false
    return dispatch => {
        
        // dispatch(setActiveGenes([]));
        dispatch(showTooltip(false));

        dispatch({ type: types.SET_REGION, region });
    dispatch({ type: types.SET_TOOLTIP_VISIBILITY, toSet })
}
}

export function setGenomeRegion(genomeRegion) {

    return ({ type: types.SET_GENOME_REGION, genomeRegion })
}

export function setActiveGenes(activeGenes) {


    return ({ type: types.SET_ACTIVE_GENES, activeGenes });
}

export function setActiveSubGenome(activeSubGenome) {
    return ({ type: types.SET_ACTIVE_SUBGENOME, activeSubGenome })
}

export function disconnectFromRoom(Connection) {
    return ({type: types.SET_CONNECTION_STATUS, Connection})
}