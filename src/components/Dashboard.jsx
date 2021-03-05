import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loading';
import { getFile } from '../utils/fetchData';
import _ from 'lodash';
import TriadStackedMap from './TriadStackedMap';
import TriadSubRegion from './TriadSubRegion';
import FilterPanel from './FilterPanel';
import TriadGenomeMap from './TriadGenomeMap'
import { scaleLinear } from 'd3';
import { CHART_WIDTH } from '../utils/chartConstants';

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            triadData: [],
            columns: [],
            genomeData: [],
            chromosomes: [],
            activeChromosome: 'AT1',
            activeSubGenome: 'SG1',
            region: {
                start: 0,
                end: 0,
            },
        }
    }

    onSubGenomeChange = (event) => {
        const activeSubGenome = event.value,
            triadData = _.sortBy(this.state.triadData, (d) => d[activeSubGenome]),
            genomeData = this.state.genomeData, chromosomes = this.state.chromosomes;

        _.map(chromosomes, (chromosome) => {
            genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) => d[activeSubGenome])
        })

        this.setState({ activeSubGenome, triadData, genomeData });
    }

    onChromosomeChange = (event) => {
        const activeChromosome = event,
            genomeData = this.state.genomeData,
            activeSubGenome = this.state.activeSubGenome,
            triadData = _.sortBy(genomeData[activeChromosome], (d) => d[activeSubGenome]);

        this.setState({ activeChromosome, triadData });
    }

    componentDidMount() {

        const { activeSubGenome, activeChromosome } = this.state;

        // Turn loader onON
        this.setState({ 'loader': true });

        getFile('data/AT.txt')
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

                let genomeData = _.groupBy(records, (d) => d.activeChromosome);

                // Get the chromosome names and put into array
                let chromosomes = _.sortBy(Object.keys(genomeData));

                // Sort each array of chromosomes by the active subGenome
                _.map(chromosomes, (chromosome) => {
                    genomeData[chromosome] = _.sortBy(genomeData[chromosome], (d) => d[activeSubGenome])
                })

                // TODO select none to not sort

                // sort the data by the default set sort key
                let triadData = _.sortBy(genomeData[activeChromosome], (d) => d[activeSubGenome]);
                // Set the data onto the state
                this.setState({ triadData, columns, genomeData, chromosomes });
            })
            .catch(() => {
                alert("Sorry there was an error in fetching and parsing the file");
                console.log('error');
            })
            .finally(() => { this.setState({ 'loader': false }) });

    }

    setRegionWindow = (region) => {
        this.setState({ 'region': { ...region } })
    }

    render() {

        const { loader = false, triadData = [], columns = [], genomeData = [], chromosomes = [], activeSubGenome, region } = this.state,
            subGenomes = [...columns.slice(1)];

        const chartScale = scaleLinear()
            .domain([0, triadData.length - 1])
            .range([0, CHART_WIDTH]);

        let { start = 0, end = 0 } = region;

        if (end == 0) {
            end = Math.round(chartScale.invert(50));
        }

        const innerTriadData = triadData.slice(start, end);
        const innerChartScale = scaleLinear()
            .domain([0, innerTriadData.length - 1])
            .range([0, CHART_WIDTH]);


        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                {loader ?
                    <Loader className='loading-spinner' type='spin' height='100px' width='100px' color='#d6e5ff' delay={- 1} /> :
                    <div className='dashboard-inner-root text-center'>
                        <FilterPanel
                            activeSubGenome={activeSubGenome}
                            subGenomes={subGenomes}
                            onSubGenomeChange={this.onSubGenomeChange} />
                        {triadData.length > 0 ?
                            <div>
                                <TriadGenomeMap
                                    genomeData={genomeData}
                                    subGenomes={subGenomes}
                                    chartScale={chartScale}
                                    chromosomes={chromosomes}
                                    onChromosomeChange={this.onChromosomeChange}
                                />
                                <TriadStackedMap
                                    subGenomes={subGenomes}
                                    triadData={triadData}
                                    chartScale={chartScale}
                                    setRegionWindow={this.setRegionWindow}
                                />
                                <TriadSubRegion
                                    subGenomes={subGenomes}
                                    triadData={innerTriadData}
                                    chartScale={innerChartScale}
                                />
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
            // fill in with actions here 
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        // fill in with props that you need to read from state
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);



