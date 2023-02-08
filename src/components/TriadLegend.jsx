import React, { Component } from 'react';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10 } from 'd3';


export default class TriadLegend extends Component {

    componentDidMount() { this.drawLegend(); }

    componentDidMount() { this.drawLegend(); }

    drawLegend = () => {
        const { subGenomes = [] } = this.props;

        let context = clearAndGetContext(this.canvas);
        let padding_from_left = 15;
        const y_coord = 15;
        _.map(subGenomes, (subGenome, index) => {
            context.beginPath();
            context.strokeStyle = "black";
            context.fillStyle = schemeTableau10[index];
            context.moveTo(padding_from_left, y_coord + 5);
            context.fillRect(padding_from_left, y_coord + 5, 20, 20);
            context.stroke();
            context.fillText(subGenome, padding_from_left, y_coord)
            padding_from_left += 25;
        });
    }

    render() {
        const { subGenomes = [] } = this.props;

        return (

                <canvas className="legend-canvas" width={subGenomes.length * 40} height={subGenomes.length * 15} style = {{"position": "absolute"}} ref={(el) => { this.canvas = el }} > </canvas>

        );
    }
}
