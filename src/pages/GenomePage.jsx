import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loading';
import { getFile } from '../utils/fetchData';
import _ from 'lodash';
import { scaleLinear } from 'd3';
import { CHART_WIDTH } from '../utils/chartConstants';
import { setGenomeData, setChromosomeData, setDefaultDataWholeGenome, setGenomeViewData, sortGenomeViewData, setActiveSubGenome } from '../redux/actions/actions';
import { SubRegionMap, FilterPanel, TriadGenomeViewMap, Tooltip, GeneRefMap, SubRegionGenomeView } from '../components';

class GenomePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            hideChromosome: true,
            subGenomes: [],
            chromosomes: [],
        }
    }

    onSubGenomeChange = (event) => {
        this.props.actions.sortGenomeViewData(event.value);
    }

    componentDidMount() {

        let { activeSubGenome, activeChromosome, actions } = this.props;


        // get the source name based on window query params
        let { sourceID = "" } = this.props.params;

        // If no source ID is set, check if there is a default set in the window object
        // this default is set when the webapp is launched with a sourceID set in the URL
        if (sourceID.length == 0) {
            // If there is no default set in the window object then default to AT camelina
            if (window.defaultSourceID && window.defaultSourceID.length > 0) {
                sourceID = window.defaultSourceID;
            }
            else {
                sourceID = "AT_camelina";
            }
        }
        else {
            // store the sourceID that the webapp was launched with so it can be used when the tab is switched
            window.defaultSourceID = sourceID;
        }
        // The first part tells you the reference gene file name and the second part tells you the gene expression file name
        let geneSource = sourceID.split("_")[0] + "_genes.gff",
            expressionFileSource = sourceID.split("_")[1] + ".txt";


        let geneData = [];

        // Turn loader on
        this.setState({ 'loader': true });

        getFile('data/' + geneSource)
            .then((geneFile) => {

                let lineData = geneFile.split('\n').slice(1).map((d) => d.split('\t'));

                geneData = _.groupBy(_.map(lineData, (d) => {
                    let coords = _.sortBy([+d[2], +d[3]]);
                    return {
                        'Chromosome': d[0],
                        'gene': d[1],
                        'start': coords[0],
                        'end': coords[1]
                    };
                    // group the array by Chromosome
                }), (e) => e.Chromosome);
                return getFile('data/' + expressionFileSource);
            })
            .then((rawData) => {
                // processing the data
                let lineArray = rawData.split("\n");
                let columns = lineArray.slice(0, 1)[0].trim().split('\t'),
                    records = lineArray.slice(1)
                        .map((d) => {
                            let lineData = d.split('\t'), tempStore = {};
                            columns.map((columnName, columnIndex) => {
                                // typecast to number 
                                tempStore[columnName] = columnIndex == 0 ? lineData[columnIndex] : +lineData[columnIndex];
                            })
                            // TODO deal with +10 chromosomes
                            tempStore['activeChromosome'] = lineData[0].slice(0, 3);
                            return tempStore;
                        });

                // Set the current active subgenome to be nothing.
                activeSubGenome = "N/A";
                actions.setActiveSubGenome(activeSubGenome);


                // Group the data by the chromosome, make a deep clone of the data so we can go back to the "unsorted" data later.
                let genomeData = _.groupBy(records, (d) => d.activeChromosome);
                let originalGenomeData = _.cloneDeep(genomeData);

                // Get the chromosome names and put into array
                let chromosomes = _.sortBy(Object.keys(genomeData));

                // Sort each array of chromosomes by the active subGenome
                _.map(chromosomes, (chromosome) => {
                    genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) => d[activeSubGenome])
                })

                // sort the data by the default set sort key
                let chromosomeData = _.sortBy(genomeData[activeChromosome], (d) => d[activeSubGenome]);
                let originalChromosomeData = _.cloneDeep(chromosomeData);

                let subGenomes = [...columns.slice(1)]

                let tempGenomeData = _.reduce(_.keys(genomeData).sort(), (acc, value) => [...acc, ...genomeData[value]], []);
                let genomeViewData = _.cloneDeep(tempGenomeData);

                // Dumping original data to window so that it can be used later on
                window.triadBrowserStore = { 'chromosomeData': originalChromosomeData, 'genomeData': originalGenomeData };
                actions.setDefaultDataWholeGenome(chromosomeData, genomeData, geneData, genomeViewData);

                // Set the data onto the state
                this.setState({ subGenomes, chromosomes });

            })
            .catch(() => {
                alert("Sorry there was an error in fetching and parsing the file");
                console.log('error');
            })
            .finally(() => {
                this.setState({ 'loader': false })
            });

    }

    render() {

        const { chromosomeData, isTooltipVisible, tooltipData, activeSubGenome, activeChromosome, region, genomeRegion, genomeViewData } = this.props;

        const { loader = false, chromosomes = [], subGenomes = [], hideChromosome = true } = this.state;

        // Create chart scale for TriadGenomeViewMap to allow proper visualization of the data
        const chartScale = scaleLinear()
            .domain([0, genomeViewData.length - 1])
            .range([0, CHART_WIDTH]);

        // If the region end point is somehow at 0, move the end point 
        if (region.end == 0) {
            region.end = Math.round(chartScale.invert(75));
        }

        if (genomeRegion.end == 0) {
            genomeRegion.end = Math.round(chartScale.invert(75));
        }

        // Get data for SubRegionGenomeView and create a chart scale for it
        const innerGenomeData = genomeViewData.slice(genomeRegion.start, genomeRegion.end);
        const innerGenomeChartScale = scaleLinear()
            .domain([0, innerGenomeData.length - 1])
            .range([0, CHART_WIDTH]);

        // Get data for SubRegionMap and create a chart scale for it
        const innerTriadData = innerGenomeData.slice(region.start, region.end);
        const innerChartScale = scaleLinear()
            .domain([0, innerTriadData.length - 1])
            .range([0, CHART_WIDTH]);

        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                {loader ?
                    <Loader className='loading-spinner' type='spin' height='100px' width='100px' color='#d6e5ff' delay={- 1} /> :
                    <div className='dashboard-inner-root text-center'>
                        <div className="instruction-panel"><p><b> Instructions: </b> The interactive graph below is a bar graph of Brassica Napus. You are able to sort the graph by changing the active subgenome using the drop down menu or by clicking the "Percentage Sort" button, using the sliders and then clicking the "Sort" button. This graph has a window that is both draggable and resizable. This window will change the contents of the Subregion graph below. Once you move to the Subregion graph, you will find a similar graph with another window, which will allow you to "zoom" in another level. Once you move to the Inner Subregion, you can hover over the individual genes with your mouse to get their Gene Name as well as their composition. Hovering over a gene will cause the gene in the Reference Gene Map to highlight white. If you want to use a window to select multiple genes at one time, you can click the "Select Region" button and use the window as used in the previous visualization.</p></div>
                        <FilterPanel
                            activeSubGenome={activeSubGenome}
                            subGenomes={subGenomes}
                            onSubGenomeChange={this.onSubGenomeChange}
                            activeChromosome={activeChromosome}
                        />

                        {genomeViewData.length > 0 ?
                            <div>
                                {/* code chunk to show tooltip*/}
                                {isTooltipVisible && <Tooltip {...tooltipData} />}
                                <TriadGenomeViewMap
                                    genomeViewData={genomeViewData}
                                    subGenomes={subGenomes}
                                    chartScale={chartScale}
                                    chromosomes={chromosomes}
                                    onChromosomeChange={this.onChromosomeChange} />
                                <SubRegionGenomeView
                                    subGenomes={subGenomes}
                                    activeChromosome={activeChromosome}
                                    hideChromosome={hideChromosome}
                                    chromosomeData={innerGenomeData}
                                    chartScale={innerGenomeChartScale} />
                                <SubRegionMap
                                    subGenomes={subGenomes}
                                    activeChromosome={activeChromosome}
                                    hideChromosome={hideChromosome}
                                    subRegionData={innerTriadData}
                                    chartScale={innerChartScale}
                                />
                                <GeneRefMap />
                            </div>
                            : <h2>Sorry the data file is empty.</h2>}
                    </div>}

            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setGenomeData,
            setChromosomeData,
            setDefaultDataWholeGenome,
            setGenomeViewData,
            sortGenomeViewData,
            setActiveSubGenome,
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        // fill in with props that you need to read from state
        genomeData: state.genome.genomeData,
        genomeViewData: state.genome.genomeViewData,
        chromosomeData: state.genome.chromosomeData,
        geneData: state.genome.geneData,
        activeSubGenome: state.oracle.activeSubGenome,
        activeChromosome: state.oracle.activeChromosome,
        isTooltipVisible: state.oracle.isTooltipVisible,
        tooltipData: state.oracle.tooltipData,
        region: state.oracle.region,
        genomeRegion: state.oracle.genomeRegion,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenomePage);



