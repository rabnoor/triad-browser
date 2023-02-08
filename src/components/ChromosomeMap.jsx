import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import interact from 'interactjs';
import { schemeTableau10 } from 'd3';
import { setRegion } from '../redux/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TriadLegend from './TriadLegend';
import '../assets/Styling.css'

class ChromosomeMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chartHeight: CHART_HEIGHT,
            
        };


    }

    componentDidMount() {

        const { chartScale, region } = this.props;

        let start = chartScale(region.start);
        let end = chartScale(region.end);
        let width = end - start;

        

        var target = document.getElementById('view-finder-window');

        target.setAttribute('data-x', start);

        target.style.webkitTransform = target.style.transform = 'translate(' + start + 'px,' + '0px)';

        target.style.width = width + 'px';

        target = document.getElementById('view-finder-window2');

        target.setAttribute('data-x', start);

        target.style.webkitTransform = target.style.transform = 'translate(' + start + 'px,' + '0px)';

        target.style.width = width + 'px';

        this.drawChart()
    }

    componentDidUpdate() {

        this.drawChart() 
    }

    drawChart = () => {

        const { chromosomeData = [], subGenomes = [], chartScale } = this.props;

        let context = clearAndGetContext(this.canvas);

        let chartData = _.map(chromosomeData, (dataPoint) => {

            let values = _.map(subGenomes, (d) => dataPoint[d]);

            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        });


        this.attachResizing();

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = this.state.chartHeight / yMax;

        context.lineWidth = CHART_WIDTH / chromosomeData.length;

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

    attachResizing = () => {

        const { chartScale, actions, markers } = this.props;

        interact('#view-finder-window')
            .draggable({
                inertia: true,
                listeners: {
                    move(event) {
                        // Generic code that handles position of the window and sets it back onto the dom elemen
                        var target = event.target;
                        var targetCounterpart = document.getElementById('view-finder-window2')
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        x += event.dx;
                        if (x >= 0 && x <= (CHART_WIDTH - event.rect.width)) {
                            target.style.webkitTransform = target.style.transform =
                                'translate(' + x + 'px,' + '0px)'
                            target.setAttribute('data-x', x);

                            targetCounterpart.style.webkitTransform = targetCounterpart.style.transform =
                                'translate(' + x + 'px,' + '0px)'
                                targetCounterpart.setAttribute('data-x', x);
                        }
                    },
                    end(event) {
                        markers.length  = 0;

                        actions.setRegion(getStartAndEnd(event.target, chartScale))
                    }
                },
            })
            .resizable({
                // resize from all edges and corners
                edges: { left: true, right: true, bottom: false, top: false },
                listeners: {
                    move(event) {
                        // Generic code that handles width and position of the window and sets it back onto the dom element
                        var target = event.target;
                        var targetCounterpart = document.getElementById('view-finder-window2')

                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        // update the element's style
                        target.style.width = event.rect.width + 'px';
                        // translate when resizing from left edges
                        x += event.deltaRect.left;
                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);

                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        // update the element's style
                        targetCounterpart.style.width = event.rect.width + 'px';
                        // translate when resizing from left edges
                        x += event.deltaRect.left;
                        targetCounterpart.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                            targetCounterpart.setAttribute('data-x', x);

                        
                    },
                    end(event) {
                        markers.length  = 0;

                        actions.setRegion(getStartAndEnd(event.target, chartScale))
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

            interact('#view-finder-window2')
            .draggable({
                inertia: true,
                listeners: {
                    move(event) {
                        // Generic code that handles position of the window and sets it back onto the dom elemen
                        var target = event.target;
                        var targetCounterpart = document.getElementById('view-finder-window')
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        x += event.dx;
                        if (x >= 0 && x <= (CHART_WIDTH - event.rect.width)) {
                            target.style.webkitTransform = target.style.transform =
                                'translate(' + x + 'px,' + '0px)'
                            target.setAttribute('data-x', x);

                            targetCounterpart.style.webkitTransform = targetCounterpart.style.transform =
                                'translate(' + x + 'px,' + '0px)'
                                targetCounterpart.setAttribute('data-x', x);
                        }
                    },
                    end(event) {
                        markers.length  = 0;

                        actions.setRegion(getStartAndEnd(event.target, chartScale))
                    }
                },
            })
            .resizable({
                // resize from all edges and corners
                edges: { left: true, right: true, bottom: false, top: false },
                listeners: {
                    move(event) {
                        // Generic code that handles width and position of the window and sets it back onto the dom element
                        var target = event.target;
                        var targetCounterpart = document.getElementById('view-finder-window')

                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        // update the element's style
                        target.style.width = event.rect.width + 'px';
                        // translate when resizing from left edges
                        x += event.deltaRect.left;
                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);

                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        // update the element's style
                        targetCounterpart.style.width = event.rect.width + 'px';
                        // translate when resizing from left edges
                        x += event.deltaRect.left;
                        targetCounterpart.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                            targetCounterpart.setAttribute('data-x', x);

                        
                    },
                    end(event) {
                        markers.length  = 0;

                        actions.setRegion(getStartAndEnd(event.target, chartScale))
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

            interact('#view-finder-wrapper').resizable({
                // resize from all edges and corners
                edges: { left: false, right: false, bottom: true, top: false },
                listeners: {
                    'move': (event) => {




                        var target = event.target;

                        // update the element's style
                        let chartHeight = this.state.chartHeight + event.deltaRect.bottom;
                        this.setState({chartHeight})

                    },
                    'end': (event) => {




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
        const { activeChromosome = '', subGenomes = [], hideChromosome = false } = this.props;

        return (
            <div style={{ 'width': CHART_WIDTH }} className="triad-stack-container">
                <TriadLegend
                    subGenomes={subGenomes} />
                {hideChromosome == true ?
                    <h4 className='chart-title'>Subregion</h4> : <h4 className='chart-title'>Chromosome ({activeChromosome})</h4>}


                    <div className='variable-window' id="view-finder-window"
                        style={{ height: (15) + 'px' }}>
                    </div>
                <div id="view-finder-wrapper">
                
                <canvas className="triad-stack-canvas snapshot" width={CHART_WIDTH} height={this.state.chartHeight} ref={(el) => { this.canvas = el }} > </canvas>
                
                </div>
                <div className='variable-window' id="view-finder-window2"
                        style={{ height: (15) + 'px' }}>
                    </div>
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
        actions: bindActionCreators({
            setRegion,
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        // fill in with props that you need to read from state
        region: state.oracle.region
    };
}



export default connect(mapStateToProps, mapDispatchToProps)(ChromosomeMap);