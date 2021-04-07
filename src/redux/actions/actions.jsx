import * as types from './actionTypes';
import _ from 'lodash';
import { active } from 'd3-transition';

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

    if (activeSubGenome != "N/A" && !activeSubGenome.includes('%')) {
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

export function setGenomeDataThreshold(activeSubGenome, activeChromosome) {
    let { chromosomeData, genomeData } = _.cloneDeep(window.triadBrowserStore);
    console.log(activeSubGenome.SG1);
    if (activeSubGenome.SG1 > 0 &&  activeSubGenome.SG2 > 0 && activeSubGenome.SG3 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG1 >= activeSubGenome.SG1 && d.SG2 >= activeSubGenome.SG2 && d.SG3 >= activeSubGenome.SG3
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG1 > 0 &&  activeSubGenome.SG2 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG1 >= activeSubGenome.SG1 && d.SG2 >= activeSubGenome.SG2
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG1 > 0 &&  activeSubGenome.SG3 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG1 >= activeSubGenome.SG1 && d.SG3 >= activeSubGenome.SG3
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG2 > 0 &&  activeSubGenome.SG3 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG2 >= activeSubGenome.SG2 && d.SG3 >= activeSubGenome.SG3
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }


    return dispatch => {
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
    };
}


export function setGenomeViewData(activeSubGenome) {
    let { genomeData } = _.cloneDeep(window.triadBrowserStore);
    let tempGenomeData = _.reduce(_.keys(genomeData).sort(), (acc, value) => [...acc, ...genomeData[value]], []);
    if (activeSubGenome != "N/A" && !activeSubGenome.includes('%')) {
        genomeData = _.sortBy(tempGenomeData, (d) => d.SG1);
    }

    return dispatch => {
        dispatch({ type: types.SET_ACTIVE_SUBGENOME, activeSubGenome });
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