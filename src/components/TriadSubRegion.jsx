import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10 } from 'd3';

export default class TriadStackedMap extends Component {

    componentDidMount() { this.drawChart() }

    componentDidUpdate() { this.drawChart() }

    drawChart = () => {

        const { triadData = [], subGenomes = [], chartScale } = this.props;
        let context = clearAndGetContext(this.canvas);

        let chartData = _.map(triadData, (dataPoint) => {

            let values = _.map(subGenomes, (d) => dataPoint[d]);

            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        });

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = CHART_HEIGHT / yMax;

        context.lineWidth = CHART_WIDTH / triadData.length;

        _.map(chartData, (dataPoint, dataIndex) => {

            const padding_from_left = chartScale(dataIndex);

            _.map(dataPoint, (d, stackIndex) => {
                context.beginPath();
                context.strokeStyle = schemeTableau10[stackIndex];
                context.moveTo(padding_from_left, CHART_HEIGHT - (stackIndex == 0 ? 0 : dataPoint[stackIndex - 1] * scaleFactor));
                context.lineTo(padding_from_left, CHART_HEIGHT - (dataPoint[stackIndex] * scaleFactor));
                context.stroke();
            })
        });
    }

    render() {
        return (
            <div style={{ 'width': CHART_WIDTH }} className="triad-stack-container">
                <canvas className="triad-stack-canvas" width={CHART_WIDTH} height={CHART_HEIGHT} ref={(el) => { this.canvas = el }} > </canvas>
            </div>
        );
    }
}
