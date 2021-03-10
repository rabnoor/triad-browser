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

        const padding_from_left = 15;
        context.fillStyle = "white";
        context.fillText("LEGEND", subGenomes.length*50/subGenomes.length, 35);
        let y_coord = 50;

        _.map(subGenomes, (subGenome, index) => {
            context.beginPath();
            context.strokeStyle = "black";
            context.fillStyle = schemeTableau10[index];
            context.moveTo(padding_from_left, y_coord);
            context.fillRect(padding_from_left,y_coord,20,20);
            context.stroke();
            context.fillText(subGenome, padding_from_left*3, y_coord+15)
            y_coord += 25;
        });
    }

    render() {
        const { subGenomes = [] } = this.props;

        return (
            <div className="legend-container">
                <canvas className="legend-canvas" width={subGenomes.length*50} height={subGenomes.length*50} ref={(el) => { this.canvas = el }} > </canvas>
            </div>
        );
    }
}
