import * as types from './actionTypes';
import _ from 'lodash';

export function showTooltip(isTooltipVisible, tooltipData) {
    return dispatch => {
        if (!!tooltipData) {
            dispatch({ type: types.SET_TOOLTIP_DATA, tooltipData });
            dispatch(setActiveGenes([tooltipData.gene]));
            dispatch({ type: types.SET_TOOLTIP_VISIBILITY, isTooltipVisible });
        } else {
            dispatch({ type: types.SET_TOOLTIP_VISIBILITY, isTooltipVisible });
            dispatch(setActiveGenes([]));
        }
    };
}

export function setChromosomeData(activeChromosome, genomeData) {
    const chromosomeData = genomeData[activeChromosome];
    return dispatch => {
        dispatch({ type: types.SET_ACTIVE_CHROMOSOME, activeChromosome });
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
    };
}

export function setGenomeData(activeSubGenome, activeChromosome) {

    let { chromosomeData, genomeData } = _.cloneDeep(window.triadBrowserStore);

    if (activeSubGenome != "N/A") {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) => d[activeSubGenome])
        });
        chromosomeData = genomeData[activeChromosome];
    }

    return dispatch => {
        dispatch({ type: types.SET_ACTIVE_SUBGENOME, activeSubGenome });
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
    };
}

export function setDefaultData(chromosomeData, genomeData, geneData) {
    return dispatch => {
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
        dispatch({ type: types.SET_GENE_DATA, geneData });

    };
}

export function setRegion(region) {
    return ({ type: types.SET_REGION, region });
}

export function setGenomeRegion(genomeRegion) {
    return ({ type: types.SET_GENOME_REGION, genomeRegion })
}

export function setActiveGenes(activeGenes) {
    return ({ type: types.SET_ACTIVE_GENES, activeGenes });
}