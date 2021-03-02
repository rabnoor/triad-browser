import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

export default class ViewFinder extends Component {

    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    drawChart = () => {
        let width = window.screen.width - 200,
            height = 240;

        let yMin = 240,
            yMax = 0;



        //append the SVG box to the body of the page            
        let svgViewfinder = d3.select('#viewfinder_1')
            .attr('width', width)
            .attr('height', height);

        let { triadData = [], columns = [] } = this.props;

        debugger;

        if (triadData.length > 0) {
            // List of subgroups here
            let subgroups = columns.slice(1);

            let groups = d3.map(triadData, function (d) { return (d.Gene) }).keys();

            // Add X axis
            let x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])


            // Add Y axis
            let y = d3.scaleLinear()
                .domain([0, 100])
                .range([yMin, yMax]);

            // color palette = one color per subgroup
            let color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c', '#377eb8', '#4daf4a'])

            //stack the data? --> stack per subgroup
            let stackedData = d3.stack()
                .keys(subgroups)
                (triadData)


            // Show the bars
            svgViewfinder.append("g")
                .selectAll("g")
                // Enter in the stack data = loop key per key = group per group
                .data(stackedData)
                .enter().append("g")
                .attr("fill", function (d) { return color(d.key); })
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                .data(function (d) { return d; })
                .enter().append("rect")
                .attr("x", function (d) { return x(d.data.Gene); })
                .attr("y", function (d) { return y(d[1]); })
                .attr("height", function (d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())
        }


    }

    render() {

        return (
            <svg id="viewfinder_1">
            </svg>
        );
    }
}


