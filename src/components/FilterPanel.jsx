import React, { Component } from 'react';
import _ from 'lodash';


export default class FilterPanel extends Component {

    render() {

        const { subGenomes = [], onSubGenomeChange, activeSubGenome = '' } = this.props;

        return (
            <div className='filter-panel m-a'>
                <label className='m-a'>Select Active Subgenome</label>
                <select className='customSelect' onChange={onSubGenomeChange} value={activeSubGenome}>
                    {_.map(subGenomes, (subGenome) => <option key={subGenome} value={subGenome}> {subGenome}</option>)}
                </select>
            </div>

        );
    }
}


