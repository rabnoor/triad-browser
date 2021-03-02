import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as d3 from 'd3';
import Loader from 'react-loading';
import { getFile } from '../utils/fetchData';
import _ from 'lodash';

class Dashboard extends Component {

    // Read the file
    // Then process the file
    // then store in the state of the component

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            triadData: []
        }
    }

    componentDidMount() {


        let widthViewfinder = 1800,
            heightViewfinder = 240;

        let yRangeMinViewfinder = 240,
            yRangeMaxViewfinder = 0;


        //append the SVG box to the body of the page            
        let svgViewfinder = d3.select('#viewfinder_1')
            .attr('width', widthViewfinder)
            .attr('height', heightViewfinder);


        // Turn loader onON
        this.setState({ 'loader': true });


        getFile('/data/AT.txt')
            .then((rawData) => {

                let sortKey = 'SG1';

                // processing the data
                let lineArray = rawData.split("\n");
                let columns = lineArray.slice(0, 1)[0].split('\t'),
                    records = lineArray.slice(1).map((d) => {
                        let lineData = d.split('\t'), tempStore = {};
                        columns.map((columnName, columnIndex) => {
                            tempStore[columnName.trim()] = columnIndex == 0 ? lineData[columnIndex] : +lineData[columnIndex];
                        })
                        return tempStore;
                    });


                // let sortedBySubGenome = _.sortBy(records, (a, b) => (!!a && !!b) ? a.sortKey - b.sortKey : 0);

                // List of subgroups here
                let subgroups = columns.slice(1);



                let groups = d3.map(records, function (d) { return (d.Gene) }).keys()

                // Add X axis
                let x = d3.scaleBand()
                    .domain(groups)
                    .range([0, widthViewfinder])
                    .padding([0.2])


                // Add Y axis
                let y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([yRangeMinViewfinder, yRangeMaxViewfinder]);

                // color palette = one color per subgroup
                let color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(['#e41a1c', '#377eb8', '#4daf4a'])

                //stack the data? --> stack per subgroup
                let stackedData = d3.stack()
                    .keys(subgroups)
                    (records)


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




            })
            .catch(() => {
                console.log('error')
            })
            .finally(() => {
                // turn off the loader 
                this.setState({ 'loader': false });
            });

    }


    render() {


        const { loader = false } = this.state;


        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                {loader && <Loader className='loading-spinner' type='spin' height='100px' width='100px' color='#d6e5ff' delay={- 1} />}
                <svg id="viewfinder_1">

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



