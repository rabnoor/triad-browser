import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10, scaleLinear } from 'd3';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { setActiveGenes, showTooltip } from '../redux/actions/actions';

import TriadLegend from './TriadLegend';
import interact from 'interactjs';
import { TriadGenomeMap } from '.';


class TriadStackedMap extends Component {

    
    constructor(props) {
        super(props)
        this.state = {
            chartHeight: CHART_HEIGHT,
            paddingLeft: 0
            
        };


    }

    componentDidMount() {
        const { genomeData = [], subGenomes = [], chromosomes = [] } = this.props;

        _.map(chromosomes, (chromosome, chromIndex) => {
            let subWidth = ChartScale(genomeData, chromosomes, chromIndex);
            this.drawChart(genomeData, subGenomes, chromosome, subWidth)
        })
    }

    componentDidUpdate() {
        const { genomeData = [], subGenomes = [], chromosomes = [], } = this.props;

        _.map(chromosomes, (chromosome, chromIndex) => {
            let subWidth = ChartScale(genomeData, chromosomes, chromIndex);
            this.drawChart(genomeData, subGenomes, chromosome, subWidth)
        })
    }

    chromosomeClick = (event) => {
        const chromosomeID = event.currentTarget.id.split('-')[1];

        this.props.actions.showTooltip(false)
        this.props.onChromosomeChange(chromosomeID);
        this.props.markers.length = 0;



    }

    drawChart = (genomeData, subGenomes, chromosome, subWidth) => {

        let context = clearAndGetContext(this['canvas-' + chromosome]);

        let chartData = _.map(genomeData[chromosome], (dataPoint) => {

            let values = _.map(subGenomes, (d) => dataPoint[d]);

            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        });

        this.attachResizing();

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = this.state.chartHeight / yMax;

        context.lineWidth = subWidth / genomeData[chromosome].length;

        _.map(chartData, (dataPoint, dataIndex) => {

            const scale = CreateScale(chartData, subWidth);
            const padding_from_left = scale(dataIndex);
            this.state.paddingLeft = padding_from_left;

            _.map(dataPoint, (d, stackIndex) => {
                context.beginPath();
                context.strokeStyle = schemeTableau10[stackIndex];
                context.moveTo(padding_from_left, this.state.chartHeight - (stackIndex == 0 ? 0 : dataPoint[stackIndex - 1] * scaleFactor));
                context.lineTo(padding_from_left, this.state.chartHeight - (dataPoint[stackIndex] * scaleFactor));
                context.stroke();
            })
        });
    }

    attachResizing = ()  => {
        

        interact('.genomemap-canvas').resizable({
            // resize from all edges and corners
            edges: { left: false, right: false, bottom: true, top: false },
            listeners: {
                'move': (event) => {

                    var target = event.target;

                    // update the element's style
                    let chartHeight = this.state.chartHeight + event.deltaRect.bottom;
                    this.setState({chartHeight})

                },
                'end': (event) => {

                }
            },
            modifiers: [
                // keep the edges inside the parent
                // interact.modifiers.restrictEdges({
                //     outer: 'parent'
                // }),
                // minimum size
                interact.modifiers.restrictSize({
                    min: { height: 100 }
                })
            ],
            inertia: true
        })

        
    }

    render() {
        const { genomeData = [], chromosomes = [], activeChromosome, subGenomes = [], } = this.props;
        let totWidth = 0;
        const canvasList = _.map(chromosomes, (chrom, chromIndex) => {
            const subWidth = ChartScale(genomeData, chromosomes, chromIndex);
            totWidth  += this.state.paddingLeft + subWidth;
            return <div
                key={"canvas-" + chromIndex}
                id={'chromID-' + chrom}
                className={'genomemap-canvas-wrapper ' + (activeChromosome == chrom ? 'selected' : '')}
                onClick={this.chromosomeClick}>
                <canvas className='genomemap-canvas'
                    width={subWidth}
                    height={this.state.chartHeight}
                    ref={(el) => { this['canvas-' + chrom] = el }} />
                <h3>{chrom}</h3>
            </div>
        });

        return (
            <div  className='genomemap-container'>
                <div  width={CHART_WIDTH} style={{ "position":"relative", "left":"20"}} className="text-center ">
                <TriadLegend 
                    subGenomes={subGenomes} />
                    <h4 className='text-primary chart-title'>Genome</h4>
                </div>
                {canvasList}
            </div>
        );
    }
}

function ChartScale(genomeData, chromosomes, chromIndex) {
    return Math.floor((genomeData[chromosomes[chromIndex]].length / _.sum(_.map(genomeData, (genome) => genome.length)) * CHART_WIDTH));
}

function CreateScale(data, width) {
    return scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ showTooltip }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(TriadStackedMap);