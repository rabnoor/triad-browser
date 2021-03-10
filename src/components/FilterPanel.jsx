import React, { Component } from 'react';
import _ from 'lodash';
import ReactSelect from 'react-select';



export default class FilterPanel extends Component {

    render() {

        const { subGenomes = [], onSubGenomeChange, activeSubGenome = '' } = this.props;

        let combinations = getCombinations(subGenomes);
        console.log(combinations)

        let options = _.map(combinations, (subGenome) => {
            return { label: subGenome, value: subGenome }
        });

        options.unshift({label: 'N/a', value: 'N/a'})

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

function getCombinations(chars) {
    var result = [];
    var f = function(prefix, chars) {
      for (var i = 0; i < chars.length; i++) {
        result.push(prefix + chars[i]);
        f(prefix + chars[i] + " + ", chars.slice(i + 1));
      }
    }
    f('', chars);
    return result;
  }