import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as d3 from 'd3';
import Loader from 'react-loading';
import { getFile } from '../utils/fetchData';
import _ from 'lodash';
import ViewFinder from './ViewFinder';

class Dashboard extends Component {

    // Read the file
    // Then process the file
    // then store in the state of the component

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            triadData: [],
            columns: []
        }
    }

    componentDidMount() {

        let width = window.screen.width - 200,
            height = 240;

        let yMin = 240,
            yMax = 0;


        //append the SVG box to the body of the page            
        let svgViewfinder = d3.select('#viewfinder_1')
            .attr('width', width)
            .attr('height', height);


        // Turn loader onON
        this.setState({ 'loader': true });


        getFile('/data/AT.txt')
            .then((rawData) => {

                let sortKey = 'SG1';

                // processing the data
                let lineArray = rawData.split("\n");
                let columns = lineArray.slice(0, 1)[0].split('\t'),
                    records = lineArray
                        .slice(1)
                        .map((d) => {
                            let lineData = d.split('\t'), tempStore = {};
                            columns.map((columnName, columnIndex) => {
                                tempStore[columnName] = columnIndex == 0 ? lineData[columnIndex] : +lineData[columnIndex];
                            })
                            return tempStore;
                        })

                let triadData = _.sortBy(records, (d) => d[sortKey]);

                this.setState({ triadData, columns });

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

        const { loader = false, triadData = [], columns = [] } = this.state;

        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                {loader && <Loader className='loading-spinner' type='spin' height='100px' width='100px' color='#d6e5ff' delay={- 1} />}
                <ViewFinder triadData={triadData} columns={columns} />
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



