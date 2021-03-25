import React, { Component } from 'react';
import _ from 'lodash';
import ReactSelect from 'react-select';



export default class FilterPanel extends Component {

    render() {

        const { subGenomes = [], onSubGenomeChange, activeSubGenome = '' } = this.props;

        let options = _.map(subGenomes, (subGenome) => {
            return { label: subGenome, value: subGenome }
        });

        options.unshift({label: 'N/A', value: 'N/A'});
        options.push({label: 'SG1 + SG2 > 30%', value: 'SG1 + SG2 > 30%' });
        options.push({label: 'SG2 + SG3 > 30%', value: 'SG2 + SG3 > 30%' })
        options.push({label: 'SG1 + SG3 > 30%', value: 'SG1 + SG3 > 30%' })


        let defaultActiveSubGenome = { 'label': activeSubGenome, 'value': activeSubGenome };

        return (
            <div className='filter-panel'>
                <div className="line-select">
                    <span className='inner-span'>Sort By Subgenome</span>
                    <ReactSelect
                        value={defaultActiveSubGenome}
                        className='select-box source'
                        options={options}
                        styles={{
                            option: (styles) => ({
                                ...styles,
                                color: 'black', textAlign: 'left'
                            })
                        }}
                        onChange={onSubGenomeChange}
                    />
                </div>
            </div>
        );
    }
}