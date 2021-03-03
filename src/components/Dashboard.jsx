import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loader from 'react-loading';
import { getFile } from '../utils/fetchData';
import _ from 'lodash';
import TriadStackedMap from './TriadStackedMap';
import FilterPanel from './FilterPanel';

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loader: false,
            triadData: [],
            columns: [],
            activeSubGenome: 'SG2'
        }

    }

    onSubGenomeChange = (event) => {

        const activeSubGenome = event.target.value, triadData = _.sortBy(this.state.triadData, (d) => d[activeSubGenome]);

        this.setState({ activeSubGenome, triadData });
    }

    componentDidMount() {

        const { activeSubGenome } = this.state;

        // Turn loader onON
        this.setState({ 'loader': true });


        getFile('/data/AT.txt')
            .then((rawData) => {

                // processing the data
                let lineArray = rawData.split("\n");
                let columns = lineArray.slice(0, 1)[0].trim().split('\t'),
                    records = lineArray.slice(1)
                        .map((d) => {
                            let lineData = d.split('\t'), tempStore = {};
                            columns.map((columnName, columnIndex) => {
                                // typecast to number 
                                tempStore[columnName] = columnIndex == 0 ? lineData[columnIndex] : +lineData[columnIndex];
                            })
                            return tempStore;
                        })
                // sort the data by the default set sort key
                let triadData = _.sortBy(records, (d) => d[activeSubGenome]);
                // Set the data onto the state
                this.setState({ triadData, columns });
            })
            .catch(() => {
                alert("Sorry there was an error in fetching and parsing the file");
                console.log('error');
            })
            .finally(() => { this.setState({ 'loader': false }) });

    }

    render() {

        const { loader = false, triadData = [], columns = [], activeSubGenome } = this.state,
            subGenomes = [...columns.slice(1)];

        // set the dimensions of the graph
        return (
            <div className='dashboard-root container-fluid'>
                {loader ?
                    <Loader className='loading-spinner' type='spin' height='100px' width='100px' color='#d6e5ff' delay={- 1} /> :
                    <div className='dashboard-inner-root text-center'>
                        <FilterPanel
                            activeSubGenome={activeSubGenome}
                            subGenomes={subGenomes}
                            onSubGenomeChange={this.onSubGenomeChange} />
                        {triadData.length > 0 ?
                            <TriadStackedMap
                                triadData={triadData}
                                columns={columns} /> :
                            <h2>Sorry the data file is empty.</h2>}
                    </div>}

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



