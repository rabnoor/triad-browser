import React, { Component } from 'react';
import _ from 'lodash';
import ReactSelect from 'react-select';
import NumericInput from 'react-numeric-input';

export default class FilterPanel extends Component {

    formatText = (num) => {
        return num + "%";
    }

    render() {

        const { subGenomes = [], onSubGenomeChange, onSubGenomeChangeThreshold, activeSubGenome = '' } = this.props;

        let options = _.map(subGenomes, (subGenome) => {
            return { label: subGenome, value: subGenome }
        });

        options.unshift({ label: 'N/A', value: 'N/A' });
        options.push({ label: 'SG1 + SG2 > 30%', value: 'SG1 + SG2 > 30%' });
        options.push({ label: 'SG2 + SG3 > 30%', value: 'SG2 + SG3 > 30%' })
        options.push({ label: 'SG1 + SG3 > 30%', value: 'SG1 + SG3 > 30%' })
        options.push({ label: 'SG1 + SG2 + SG3 > 30%', value: 'SG1 + SG2 + SG3 > 30%' })


        let defaultActiveSubGenome = { 'label': activeSubGenome, 'value': activeSubGenome };

        return (
            <div className='filter-panel'>
                <div className="line-select">
                    <div className="text-container ">
                        <div className='inner-span-text'>
                            <b className="percent-subgenome-text">SG1</b>
                            <NumericInput id="sortingPercent" min={0} max={100} step={0.1} precision={2} value={0} format={this.formatText}/>
                        </div>
                        <div className='inner-span-text'>
                            <b className="percent-subgenome-text">SG2</b>

                            <NumericInput id="sortingPercent2" min={0} max={100} step={0.1} precision={2} value={0} format={this.formatText}/>
                        </div>
                        <div className='inner-span-text'>
                            <b className="percent-subgenome-text">SG3</b>
                            <NumericInput id="sortingPercent3" min={0} max={100} step={0.1} precision={2} value={0} format={this.formatText}/>
                        </div>
                        <button onClick={onSubGenomeChangeThreshold}>Submit</button>
                    </div>
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