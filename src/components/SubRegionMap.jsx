import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10, scaleLinear } from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setActiveGenes, showTooltip } from '../redux/actions/actions';
import interact from 'interactjs';
import Switch from 'react-switch';
import TriadLegend from './TriadLegend';


class SubRegionMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chartHeight: CHART_HEIGHT,
            enableSelectionRegion: false,
            geneSelected: false,
            region: {
                start: 850,
                end: 1000,
            },
        };
    }

    componentDidMount() {
        this.drawChart()
    }

    componentDidUpdate() { this.drawChart() }

    onMouseMove = (event) => {

        let { actions, chartScale, subRegionData } = this.props;


        var pageWidth = document.body.getBoundingClientRect().width,
            canvasRect = event.currentTarget.getBoundingClientRect();

        const xPosition = event.pageX - canvasRect.left;


        const referenceIndex = Math.round(chartScale.invert(xPosition)),
            dataPoint = subRegionData[referenceIndex];


        let tooltipData = {
            'x': event.pageX + 200 > pageWidth ? event.pageX - 200 : event.pageX + 25,
            'y': event.pageY - 50,
            'gene': dataPoint.Gene,
            'data' : []
        }
        let Prptindex = 0;
        for(var propt in dataPoint){
            if (typeof(dataPoint[propt]) == 'number'){
                tooltipData[propt] = dataPoint[propt]
                let tooltipColor = schemeTableau10[Prptindex-1];
                tooltipData['data'].push(<p key={propt+"tooltipinfo"}><b><span style={{color: tooltipColor}}>{propt}</span>: </b><span>{Math.round(dataPoint[propt])+"%"}</span></p>)}
                Prptindex++ ;
        }
        // console.log(tooltipData)
        if (!this.state.geneSelected){
        actions.showTooltip(true, tooltipData);
}
    }

    onToggleRegionWindow = (enableSelectionRegion) => {
        // Remove active genes when switching modes

        const { subRegionData } = this.props;

        const chartScale = scaleLinear()
            .domain([0, subRegionData.length - 1])
            .range([0, CHART_WIDTH]);

        var target = document.getElementById('gene-finder-window');

        if (enableSelectionRegion) {
            this.setRegion(getStartAndEnd(target, chartScale));
        }
        else {
            this.props.actions.setActiveGenes([]);
        }

        this.setState({ enableSelectionRegion });
    };
    onMouseClick= (event) => { this.state.geneSelected = !this.state.geneSelected ;

    }
    onMouseLeave = (event) => { 
        if (!this.state.geneSelected){
            console.log(this.state.geneSelected)
        this.props.actions.showTooltip(false) }

}    

    drawChart = () => {

        const { subRegionData = [], subGenomes = [], chartScale } = this.props;
        let context = clearAndGetContext(this.canvas);

        let chartData = _.map(subRegionData, (dataPoint) => {

            let values = _.map(subGenomes, (d) => dataPoint[d]);

            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        });

        this.attachResizing();

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = this.state.chartHeight / yMax;

        context.lineWidth = CHART_WIDTH / subRegionData.length;

        _.map(chartData, (dataPoint, dataIndex) => {

            const padding_from_left = chartScale(dataIndex);

            _.map(dataPoint, (d, stackIndex) => {
                context.beginPath();
                context.strokeStyle = schemeTableau10[stackIndex];
                context.moveTo(padding_from_left, this.state.chartHeight - (stackIndex == 0 ? 0 : dataPoint[stackIndex - 1] * scaleFactor));
                context.lineTo(padding_from_left, this.state.chartHeight - (dataPoint[stackIndex] * scaleFactor));
                context.stroke();
            })
        });
    }


    setRegion = (region) => {
        let activeGenes = this.props.subRegionData.slice(region.start, region.end);
        this.props.actions.setActiveGenes(_.map(activeGenes, (d) => d.Gene));
        this.setState({ region });
    }

    attachResizing = () => {

        const { chartScale } = this.props;

        interact('#gene-finder-window')
            .draggable({
                inertia: true,
                listeners: {
                    'move': (event) => {
                        // Generic code that handles position of the window and sets it back onto the dom elemen
                        var target = event.target;
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        x += event.dx;
                        if (x >= 0 && x <= (CHART_WIDTH - event.rect.width)) {
                            target.style.webkitTransform = target.style.transform =
                                'translate(' + x + 'px,' + '0px)'
                            target.setAttribute('data-x', x);
                        }
                    },
                    'end': (event) => {
                        this.setRegion(getStartAndEnd(event.target, chartScale));
                    }
                },
            })
            .resizable({
                // resize from all edges and corners
                edges: { left: true, right: true, bottom: false, top: false },
                listeners: {
                    'move': (event) => {
                        // Generic code that handles width and position of the window and sets it back onto the dom element
                        var target = event.target;
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        // update the element's style
                        target.style.width = event.rect.width + 'px';
                        // translate when resizing from left edges
                        x += event.deltaRect.left;
                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);
                    },
                    'end': (event) => {
                        this.setRegion(getStartAndEnd(event.target, chartScale));
                    }
                },
                modifiers: [
                    // keep the edges inside the parent
                    interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }),
                    // minimum size
                    interact.modifiers.restrictSize({
                        min: { width: 30 }
                    })
                ],
                inertia: true
            })

            interact(this.canvas).resizable({
                // resize from all edges and corners
                edges: { left: false, right: false, bottom: true, top: false },
                listeners: {
                    'move': (event) => {
                        // Generic code that handles width and position of the window and sets it back onto the dom element

                        console.log(event.deltaRect)
                        // this.state.chartHeight -= event.delta.y;
                        // this.drawChart()
                        var target = event.target;

                        // update the element's style
                        let chartHeight = this.state.chartHeight + event.deltaRect.bottom;
                        this.setState({chartHeight})

                        // translate when resizing from left edges
                        // x += event.deltaRect.top;
                        // target.style.webkitTransform = target.style.transform =
                        //     'translate(0px, ' + x + 'px)'

                    },
                    'end': (event) => {
                        // this.setRegion(getStartAndEnd(event.target, chartScale));
                        console.log(this.state.chartHeight);


                    }
                },
                modifiers: [
                    // keep the edges inside the parent
                    // interact.modifiers.restrictEdges({
                    //     outer: 'parent'
                    // }),
                    // minimum size
                    interact.modifiers.restrictSize({
                        min: { height: 100 }
                    })
                ],
                inertia: true
            })
    }


    render() {
        let { enableSelectionRegion = false } = this.state;
        let { activeChromosome = '', subGenomes = [], hideChromosome = false } = this.props;

        return (
            <div style={{ 'width': CHART_WIDTH }} className="triad-stack-container">
                <div className='m-b'>
                    <TriadLegend
                        subGenomes={subGenomes} />
                    {hideChromosome == true ?
                        <h4 className='chart-title'>Inner Subregion</h4> : <h4 className='chart-title'>Subregion ({activeChromosome})</h4>}
                    <span className='switch-container'>
                        <div className='switch-inner'>
                            <label htmlFor="material-switch-norm">
                                <Switch
                                    checked={enableSelectionRegion}
                                    onChange={this.onToggleRegionWindow}
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
                        <span className='switch-label'>Select Region</span>
                    </span>
                </div>
                <div style={{ 'width': CHART_WIDTH }}
                onMouseOver={this.onMouseMove}
                onMouseMove={this.onMouseMove}
                onMouseLeave={this.onMouseLeave}
                onClick={this.onMouseClick}
                    className={'gene-finder-wrapper ' + (enableSelectionRegion ? '' : 'hide')}>
                    <div className='variable-window' id="gene-finder-window"
                        style={{ height: (this.state.chartHeight + 5) + 'px' }}>
                    </div>
                </div>
                <canvas
                    onMouseOver={this.onMouseMove}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={this.onMouseLeave}
                    onClick={this.onMouseClick}
                    className="triad-stack-canvas" width={CHART_WIDTH} height={this.state.chartHeight} ref={(el) => { this.canvas = el }} > </canvas>
            </div>
        );
    }
}

function getStartAndEnd(target, chartScale) {
    let xPosition = (parseFloat(target.getAttribute('data-x')) || 0),
        width = target.style.width;
    if (width.indexOf('px') > -1) {
        width = +width.slice(0, -2);
    }
    else {
        width = 150;
    }
    const start = Math.abs(xPosition), end = start + width;
    return {
        'start': Math.round(chartScale.invert(start)),
        'end': Math.round(chartScale.invert(end))
    };
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ showTooltip, setActiveGenes }, dispatch),
    };
}

export default connect(null, mapDispatchToProps)(SubRegionMap);