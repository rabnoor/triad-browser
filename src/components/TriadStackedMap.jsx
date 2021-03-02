import React, { Component } from 'react';
import { select, scaleBand, scaleLinear, scaleOrdinal, stack } from 'd3';
import { clearAndGetContext, drawLines, generateLinesFromMap } from '../utils/canvasUtilities';
import _ from 'lodash';

const WIDTH = window.screen.width - 200, HEIGHT = 800;

export default class TriadStackedMap extends Component {

    componentDidMount() { this.drawChart() }

    componentDidUpdate() { this.drawChart() }

    drawChart = () => {

        let { triadData = [], columns = [] } = this.props;

        let context = clearAndGetContext(this.canvas)

        if (triadData.length > 0) {

            // List of subgroups here
            let subgroups = columns.slice(1);
            let groups = _.map(triadData, (d) => d.Gene);

            // Add X axis
            let x = scaleBand()
                .domain(groups)
                .range([0, WIDTH])
                .padding([0.2]);


            // Add Y axis
            let y = scaleLinear()
                .domain([0, 100])
                .range([HEIGHT, 0]);

            // color palette = one color per subgroup
            let color = scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c', '#377eb8', '#4daf4a']);

            let colours = ['#e41a1c', '#377eb8', '#4daf4a'];

            //stack the data? --> stack per subgroup
            let stackedData = stack()
                .keys(subgroups)
                (triadData);


            // let TRACK_HEIGHT = 100;
            // for (let x = 0; x < stackedData.length; x++) {
            //     for (let i = 0; i < stackedData[x].length; i++) {
            //         context.beginPath();
            //         context.lineWidth = 0.1;
            //         context.strokeStyle = colours[x];
            //         context.rect(i-HEIGHT,i-HEIGHT,0.1,0.1)
            //         context.stroke();
            //     }
            // }
            // drawLines(context, stackedData, "FFFFFF", 1);

            //     // Show the bars
            //     triadStackedMap.append("g")
            //         .selectAll("g")
            //         // Enter in the stack data = loop key per key = group per group
            //         .data(stackedData)
            //         .enter().append("g")
            //         .attr("fill", function (d) { return color(d.key); })
            //         .selectAll("rect")
            //         // enter a second time = loop subgroup per subgroup to add all rectangles
            //         .data(function (d) { return d; })
            //         .enter().append("rect")
            //         .attr("x", function (d) { return x(d.data.Gene); })
            //         .attr("y", function (d) { return y(d[1]); })
            //         .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            //         .attr("width", x.bandwidth());
        }


    }

    render() {

        return (
            <div className="mycanvas">
                <canvas id="viewfinder" width={WIDTH} height={HEIGHT} ref={(el) => { this.canvas = el }} > </canvas>
            </div>
        );
    }
}


