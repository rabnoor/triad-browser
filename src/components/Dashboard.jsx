import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAndProcessFile } from '../utils/fetchData';
import * as d3 from 'd3';

class Dashboard extends Component {


    // Read the file
    // Then process the file
    // then store in the state of the component

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
        }
    }

    componentDidMount() {
        let widthTriadViz = 1800,
            heightTriadViz = 500;

        let widthViewfinder = 1800,
            heightViewfinder = 240;

        let xPos = 0,
            xCounterLine = 0,
            rectWidth = 1,
            paddingHorizontal = 0,
            paddingVertical = 20;

        let yRangeMinTriadViz = 18,
            yRangeMaxTriadViz = 0,
            yRangeMinViewfinder = 240,
            yRangeMaxViewfinder = 0;

        let rectRow = widthTriadViz / (rectWidth + paddingHorizontal);

        // append the svg object to the body of the page
        let svg = d3.select("#triad_viz")
            .attr("width", widthTriadViz)
            .attr("height", heightTriadViz);

        //append the SVG box to the body of the page            
        let svgViewfinder = d3.select('#viewfinder')
            .attr('width', widthViewfinder)
            .attr('height', heightViewfinder);

        // Parse the Data
        d3.tsv("/data/AT.txt").then(function(dataa) {
            let numberOfRows = Math.ceil(dataa.length / rectRow);
            let rectRowLast;

            dataa.forEach(function(d) {
                d.SG1 = +d.SG1;
                d.SG2 = +d.SG2;
                d.SG3 = +d.SG3;
            });

            let sortedSG1 = dataa.slice().sort((a, b) => d3.descending(a.SG1, b.SG1));
            let sortedSG2 = dataa.slice().sort((a, b) => d3.descending(a.SG2, b.SG2));
            let sortedSG3 = dataa.slice().sort((a, b) => d3.descending(a.SG3, b.SG3));

            // List of subgroups here
            let subgroups = dataa.columns.slice(1)

            // Draw stacked viz, sorted by SG variable
            for (let i = 0; i < numberOfRows; i++) {
                // drawStackGroup(sortedSG1.slice(rectRow * i, rectRow * (i + 1)), yRangeMinTriadViz, yRangeMaxTriadViz, i);
                // drawStackGroup(sortedSG2.slice(rectRow * i, rectRow * (i + 1)), yRangeMinTriadViz, yRangeMaxTriadViz, i);
                drawStackGroup(sortedSG3.slice(rectRow * i, rectRow * (i + 1)), yRangeMinTriadViz, yRangeMaxTriadViz, i);
            }

            // Draw Viewfinder
            // drawViewfinder(sortedSG1, yRangeMinViewfinder, yRangeMaxViewfinder);
            // drawViewfinder(sortedSG2, yRangeMinViewfinder, yRangeMaxViewfinder);
            drawViewfinder(sortedSG3, yRangeMinViewfinder, yRangeMaxViewfinder);


            function drawViewfinder(dataa, yRangeMin, yRangeMax) {
                let groups = d3.map(dataa, function (d) { return (d.Gene) }).keys()

                // Add X axis
                let x = d3.scaleBand()
                    .domain(groups)
                    .range([0, widthViewfinder])
                    .padding([0.2])
                svg.append("g")
                    .attr("transform", "translate(0," + heightViewfinder + ")");

                // Add Y axis
                let y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([yRangeMin, yRangeMax]);

                // color palette = one color per subgroup
                let color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(['#e41a1c', '#377eb8', '#4daf4a'])

                //stack the data? --> stack per subgroup
                let stackedData = d3.stack()
                    .keys(subgroups)
                    (dataa)

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

            function drawStackGroup(data, yRangeMin, yRangeMax, rowCounter) {

                let rectPerRow = data.length;

                // Add Y axis
                let y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([yRangeMin, yRangeMax]);

                // color palette = one color per subgroup
                let color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(['#e41a1c', '#377eb8', '#4daf4a'])

                //stack the data --> stack per subgroup
                let stackedData = d3.stack()
                    .keys(subgroups)
                    (data)

                // Show the bars
                svg.append("g")
                    .selectAll("g")
                    // Enter in the stack data = loop key per key = group per group
                    .data(stackedData)
                    .enter().append("g")
                    .attr("fill", function (d) { return color(d.key); })
                    .selectAll("rect")
                    // enter a second time = loop subgroup per subgroup to add all rectangles
                    .data(function (d) { return d; })
                    .enter().append("rect")
                    .attr("x", function (d) {
                        if (xCounterLine >= rectPerRow) {
                            xCounterLine = 1;
                            xPos = rectWidth + paddingHorizontal;
                        } else {
                            xPos += rectWidth + paddingHorizontal;
                            xCounterLine += 1;
                        }
                        return xPos;
                    })
                    .attr("y", function (d) {
                        return y(d[1]) + (rowCounter * paddingVertical)
                    })
                    .attr("height", function (d) { return y(d[0]) - y(d[1]); })
                    .attr("width", rectWidth)
            }
        });
    }


    render() {
        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                <svg id="viewfinder">

                </svg>

                <svg id="triad_viz">

                </svg>
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



