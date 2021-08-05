import React, { Component } from 'react';
import _ from 'lodash';
import ReactSelect from 'react-select';
import Switch from 'react-switch';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import Slider, { SliderTooltip  } from 'rc-slider';
import 'rc-tooltip/assets/bootstrap.css';
import 'rc-slider/assets/index.css';
import { setGenomeDataThreshold, sortGenomeViewData } from '../redux/actions/actions';


const { Handle } = Slider;

const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
      <SliderTooltip
        prefixCls="rc-slider-tooltip"
        overlay={`${value} %`}
        visible={dragging}
        placement="top"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </SliderTooltip>
    );
  };

class FilterPanel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showDropDown: false,
            localSG1Value: 0,
            localSG2Value: 0,
            localSG3Value: 0,
        }
    }

    onToggleSelection = (showDropDown) => {
        this.setState({ showDropDown });
    }

    formatText = (num) => {
        return num + "%";
    }

    changeSG1 = (localSG1Value) => {
        this.setState({localSG1Value})
    }

    changeSG2 = (localSG2Value) => {
        this.setState({localSG2Value})
    }

    changeSG3 = (localSG3Value) => {
        this.setState({localSG3Value})
    }

    onClickFunction = () => {
        let SubGenomeThreshold = { "SG1": this.state.localSG1Value, "SG2": this.state.localSG2Value, "SG3": this.state.localSG3Value };
        this.props.actions.setGenomeDataThreshold(SubGenomeThreshold, this.props.activeChromosome);
    }

    render() {

        const { subGenomes = [], onSubGenomeChange, onSubGenomeChangeThreshold, activeSubGenome = 'N/A',  } = this.props;
        const { showDropDown = false,} = this.state;

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
                            <span>
                                <div className='inner-span-text'>
                                    <b className="percent-subgenome-text">SG1</b>
                                    <Slider id="sortingPercent" min={0} max={100} defaultValue={0} handle={handle} onChange={this.changeSG1}/>
                                </div>
                                <div className='inner-span-text'>
                                    <b className="percent-subgenome-text">SG2</b>
                                    <Slider id="sortingPercent" min={0} max={100} defaultValue={0} handle={handle} onChange={this.changeSG2}/>
                                </div>
                                <div className='inner-span-text'>
                                    <b className="percent-subgenome-text">SG3</b>
                                    <Slider id="sortingPercent" min={0} max={100} defaultValue={0} handle={handle} onChange={this.changeSG3}/>
                                </div>
                            </span>
                            <Button className="sort-button" variant="primary" size="sm" onClick={this.onClickFunction}>
                                Sort
                            </Button>
                        </div>
                        :
                        <div>
                            <span className='inner-span'>Sort By Subgenome</span>
                            <ReactSelect
                                value={defaultActiveSubGenome}
                                defaultValue={defaultActiveSubGenome}
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setGenomeDataThreshold,
            sortGenomeViewData
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(FilterPanel);

