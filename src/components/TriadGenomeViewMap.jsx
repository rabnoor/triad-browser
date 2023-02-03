import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContextRemoveAlpha } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10, scaleLinear } from 'd3';
import TriadLegend from './TriadLegend';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setGenomeRegion } from '../redux/actions/actions';
import interact from 'interactjs';



class TriadGenomeViewMap extends Component {

    componentDidMount() { 
        const { chartScale, genomeViewData = [] } = this.props;

        let genomeWindowRange = chartScale.invert(75);

        let centerPoint = genomeViewData.length / 2;

        let start = centerPoint - genomeWindowRange;
        let end = centerPoint + genomeWindowRange;

        start = chartScale(start);
        end = chartScale(end);
        let width = end - start;

        var target = document.getElementById('genome-finder-window');
        target.setAttribute('data-x', start);

        target.style.webkitTransform = target.style.transform = 'translate(' + start + 'px,' + '0px)';

        target.style.width = width + 'px';

        target = document.getElementById('genome-finder-window2');
        target.setAttribute('data-x', start);

        target.style.webkitTransform = target.style.transform = 'translate(' + start + 'px,' + '0px)';

        target.style.width = width + 'px';
        this.drawChart();
     }

    componentDidUpdate() { this.drawChart(); }

    drawChart = () => {
        const { genomeViewData = [], subGenomes = [] } = this.props;

        let context = clearAndGetContextRemoveAlpha(this.canvas);

        let chartData = _.map(genomeViewData, (dataPoint) => {
            let values = _.map(subGenomes, (d) => dataPoint[d]);
            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))
        });

        this.attachResizing();

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = CHART_HEIGHT / yMax;

        context.lineWidth = CHART_WIDTH / chartData.length;

        const scale = CreateScale(chartData, CHART_WIDTH);

        _.map(chartData, (dataPoint, dataIndex) => {

            const padding_from_left = scale(dataIndex);

            _.map(dataPoint, (d, stackIndex) => {
                    context.beginPath();
                    context.strokeStyle = schemeTableau10[stackIndex];
                    context.moveTo(padding_from_left, CHART_HEIGHT - (stackIndex == 0 ? 0 : dataPoint[stackIndex - 1] * scaleFactor));
                    context.lineTo(padding_from_left, CHART_HEIGHT - (dataPoint[stackIndex] * scaleFactor));
                    context.stroke();
            })
        });
    }

    attachResizing = () => {

        const { chartScale, actions } = this.props;

        interact('#genome-finder-window')
            .draggable({
                inertia: true,
                listeners: {
                    move(event) {
                        // Generic code that handles position of the window and sets it back onto the dom elemen
                        var target = event.target;
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        x += event.dx;
                        if (x >= 0 && x <= (CHART_WIDTH - event.rect.width)) {
                            target.style.webkitTransform = target.style.transform =
                                'translate(' + x + 'px,' + '0px)'
                            target.setAttribute('data-x', x);

                            target = document.getElementById('genome-finder-window2')
                            target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);
                        }
                    },
                    end(event) {
                        actions.setGenomeRegion(getStartAndEnd(event.target, chartScale))
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
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        // update the element's style
                        target.style.width = event.rect.width + 'px';
                        // translate when resizing from left edges
                        x += event.deltaRect.left;
                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);


                        target = document.getElementById('genome-finder-window2')

                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);


                    },
                    end(event) {
                        actions.setGenomeRegion(getStartAndEnd(event.target, chartScale))
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


            interact('#genome-finder-window2')
            .draggable({
                inertia: true,
                listeners: {
                    move(event) {
                        // Generic code that handles position of the window and sets it back onto the dom elemen
                        var target = event.target;
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        x += event.dx;
                        if (x >= 0 && x <= (CHART_WIDTH - event.rect.width)) {
                            target.style.webkitTransform = target.style.transform =
                                'translate(' + x + 'px,' + '0px)'
                            target.setAttribute('data-x', x);

                            target = document.getElementById('genome-finder-window')
                            target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);
                        }
                    },
                    end(event) {
                        actions.setGenomeRegion(getStartAndEnd(event.target, chartScale))
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
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        // update the element's style
                        target.style.width = event.rect.width + 'px';
                        // translate when resizing from left edges
                        x += event.deltaRect.left;
                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);


                        target = document.getElementById('genome-finder-window')

                        target.style.webkitTransform = target.style.transform =
                            'translate(' + x + 'px,' + '0px)'
                        target.setAttribute('data-x', x);


                    },
                    end(event) {
                        actions.setGenomeRegion(getStartAndEnd(event.target, chartScale))
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
    }

    render() {
        const { subGenomes = [] } = this.props;

        return (
            <div style={{ 'width': CHART_WIDTH }} className="triad-stack-container">
                    <TriadLegend
                        subGenomes={subGenomes} />
                    <h4 className='text-primary chart-title'>Genome</h4>

                    <div className='variable-window' id="genome-finder-window"
                            style={{ height: (15) + 'px' }}>
                        </div>

                    <div style={{ 'width': CHART_WIDTH }}
                        className='view-finder-wrapper'>
                        
                    </div>
                    <canvas colorRendering="optimizeQuality" className="triad-stack-canvas" width={CHART_WIDTH} height={CHART_HEIGHT} ref={(el) => { this.canvas = el }} > </canvas>

                    <div className='variable-window' id="genome-finder-window2"
                            style={{ height: (15) + 'px' }}>
                        </div>
            </div>
        );
    }
}

function ChartScale(genomeData, chromosomes, chromIndex) {
    return Math.round((genomeData[chromosomes[chromIndex]].length / _.sum(_.map(genomeData, (genome) => genome.length)) * CHART_WIDTH));
}

function CreateScale(data, width) {
    return scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);
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
            setGenomeRegion,
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        // fill in with props that you need to read from state
        region: state.oracle.genomeRegion
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TriadGenomeViewMap);