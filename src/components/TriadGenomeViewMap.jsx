import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10, scaleLinear } from 'd3';
import TriadLegend from './TriadLegend';

export default class TriadGenomeViewMap extends Component {

    componentDidMount() { this.drawChart(); }

    componentDidUpdate() { this.drawChart(); }

    drawChart = () => {
        const { genomeData = [], subGenomes = [] } = this.props;

        let overallSize = 0;
        let context = clearAndGetContext(this.canvas);

        let overallData = _.map(genomeData, (data) => {
            let chartData = _.map(data, (dataPoint) => {
                let values = _.map(subGenomes, (d) => dataPoint[d]);
                return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))
            });
            overallSize += chartData.length;
            return chartData;
        })

        let yMax = _.max(_.max(_.map(overallData, (d) => _.max(d))));

        let scaleFactor = CHART_HEIGHT / yMax;

        context.lineWidth = CHART_WIDTH / overallSize;

        _.map(overallData, (dataPoint, dataIndex) => {
            _.map(dataPoint, (d, stackIndex) => {

                const scale = CreateScale(dataPoint, CHART_WIDTH);
                const padding_from_left = scale(stackIndex);

                console.log(scale);
                console.log(padding_from_left)

                _.map(d, (x, stackIndex2) => {
                    context.beginPath();
                    context.strokeStyle = schemeTableau10[stackIndex2];
                    context.moveTo(padding_from_left, CHART_HEIGHT - (stackIndex2 == 0 ? 0 : d[stackIndex2 - 1] * scaleFactor));
                    context.lineTo(padding_from_left, CHART_HEIGHT - (d[stackIndex2] * scaleFactor));
                    context.stroke();
                });
            });
        });
    }

    render() {
        const { genomeData = [], chromosomes = [], activeChromosome, subGenomes = [], } = this.props;

        return (
            <div className="view-finder-container">
                <canvas className="viewfinder" width={CHART_WIDTH} height={CHART_HEIGHT} ref={(el) => { this.canvas = el }} > </canvas>
            </div>
        );
        
        // return (
        //     <div className='genomemap-container'>
        //         <div className="text-center">
        //             <TriadLegend
        //                 subGenomes={subGenomes} />
        //             <h4 className='text-primary chart-title'>Genome</h4>
        //         </div>
        //         <canvas className='genomemap-canvas' width={CHART_WIDTH} height={CHART_HEIGHT} ref={(el) => { this.canvas }}/>
        //     </div>
        // );
    }
}

function ChartScale(genomeData, chromosomes, chromIndex) {
    return Math.round((genomeData[chromosomes[chromIndex]].length / _.sum(_.map(genomeData, (genome) => genome.length)) * CHART_WIDTH));
}

function CreateScale(data, width) {
    return scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);
}