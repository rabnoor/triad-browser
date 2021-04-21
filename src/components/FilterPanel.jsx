import React, { Component } from 'react';
import _ from 'lodash';
import ReactSelect from 'react-select';
import NumericInput from 'react-numeric-input';
import Switch from 'react-switch';
import { Button } from 'reactstrap';

export default class FilterPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showDropDown: false,
        }
    }

    onToggleSelection = (showDropDown) => {
        this.setState({ showDropDown });
    }

    formatText = (num) => {
        return num + "%";
    }

    render() {

        const { subGenomes = [], onSubGenomeChange, onSubGenomeChangeThreshold, activeSubGenome = '' } = this.props;
        const { showDropDown = false } = this.state;

        // Create the dropdown menu options from the existing subGenomes
        let options = _.map(subGenomes, (subGenome) => {
            return { label: subGenome, value: subGenome }
        });

        options.unshift({ label: 'N/A', value: 'N/A' });

        let defaultActiveSubGenome = { 'label': activeSubGenome, 'value': activeSubGenome };

        return (
            <div className='filter-panel'>
                <div className="line-select">
                    <span className='switch-container'>
                        <div className='switch-inner'>
                            <label htmlFor="material-switch-norm">
                                <Switch
                                    checked={showDropDown}
                                    onChange={this.onToggleSelection}
                                    onColor="#86d3ff"
                                    onHandleColor="#2693e6"
                                    handleDiameter={16}
                                    uncheckedIcon={false}
                                    checkedIcon={false}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={12}
                                    width={35}
                                    className="react-switch"
                                    id="material-switch-norm" />
                            </label>
                        </div>
                        <span className='switch-label'>Percentage Sort</span>
                    </span>
                    {showDropDown ?
                        <div className="text-container ">
                            <div className='inner-span-text'>
                                <b className="percent-subgenome-text">SG1</b>
                                <NumericInput id="sortingPercent" min={0} max={100} step={0.1} precision={2} value={0} format={this.formatText} />
                            </div>
                            <div className='inner-span-text'>
                                <b className="percent-subgenome-text">SG2</b>

                                <NumericInput id="sortingPercent2" min={0} max={100} step={0.1} precision={2} value={0} format={this.formatText} />
                            </div>
                            <div className='inner-span-text'>
                                <b className="percent-subgenome-text">SG3</b>
                                <NumericInput id="sortingPercent3" min={0} max={100} step={0.1} precision={2} value={0} format={this.formatText} />
                            </div>
                            <Button className="sort-button" variant="primary" size="sm" onClick={onSubGenomeChangeThreshold}>
                                Sort
                            </Button>
                        </div>
                        :
                        <div>
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
                    }
                </div>
            </div>
        );
    }
}