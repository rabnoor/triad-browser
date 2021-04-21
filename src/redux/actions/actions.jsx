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
    if (activeSubGenome.SG1 > 0 && activeSubGenome.SG2 > 0 && activeSubGenome.SG3 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG1 >= activeSubGenome.SG1 && d.SG2 >= activeSubGenome.SG2 && d.SG3 >= activeSubGenome.SG3
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG1 > 0 && activeSubGenome.SG2 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG1 >= activeSubGenome.SG1 && d.SG2 >= activeSubGenome.SG2
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG1 > 0 && activeSubGenome.SG3 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG1 >= activeSubGenome.SG1 && d.SG3 >= activeSubGenome.SG3
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG2 > 0 && activeSubGenome.SG3 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG2 >= activeSubGenome.SG2 && d.SG3 >= activeSubGenome.SG3
            );
        });
        chromosomeData = genomeData[activeChromosome];
    } else if (activeSubGenome.SG1 > 0 && activeSubGenome.SG2 == 0 && activeSubGenome.SG3 == 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG1 >= activeSubGenome.SG1
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG1 == 0 && activeSubGenome.SG2 > 0 && activeSubGenome.SG3 == 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG2 >= activeSubGenome.SG2
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }
    else if (activeSubGenome.SG1 == 0 && activeSubGenome.SG2 == 0 && activeSubGenome.SG3 > 0) {
        _.map(_.keys(genomeData), (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) =>
                d.SG3 >= activeSubGenome.SG3
            );
        });
        chromosomeData = genomeData[activeChromosome];
    }

    return dispatch => {
        dispatch({ type: types.SET_CHROMOSOME_DATA, chromosomeData });
        dispatch({ type: types.SET_GENOME_DATA, genomeData });
    };
}


export function sortGenomeViewData(activeSubGenome) {
    let { genomeData } = _.cloneDeep(window.triadBrowserStore);

    let genomeViewData = _.reduce(_.keys(genomeData).sort(), (acc, value) => [...acc, ...genomeData[value]], []);

    if (activeSubGenome != "N/A" && !activeSubGenome.includes('%')) {
        if (activeSubGenome == "SG1") {
            genomeViewData = _.sortBy(genomeViewData, (d) => d.SG1);
        }
        else if (activeSubGenome == "SG2") {
            genomeViewData = _.sortBy(genomeViewData, (d) => d.SG2);
        } else {
            genomeViewData = _.sortBy(genomeViewData, (d) => d.SG3);
        }
    }

    return dispatch => {
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

export function setGenomeViewData(genomeViewData) {
    return ({ type: types.SET_GENOME_VIEW_DATA, genomeViewData });
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

export function setActiveSubGenome(activeSubGenome) {
    return ({ type: types.SET_ACTIVE_SUBGENOME, activeSubGenome })
}