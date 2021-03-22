import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10, scaleLinear } from 'd3';
import TriadLegend from './TriadLegend';
import { connect, bindActionCreators} from 'react-redux';



class TriadGenomeViewMap extends Component {

    componentDidMount() { this.drawChart(); }

    componentDidUpdate() { this.drawChart(); }

    drawChart = () => {
        const { genomeData = [], subGenomes = [] } = this.props;

        debugger;

        let overallSize = 0;
        let context = clearAndGetContext(this.canvas);

        let overallData = _.map(genomeData, (data) => {
            let chartData = _.map(data, (dataPoint) => {
                let values = _.map(subGenomes, (d) => dataPoint[d]);
                return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))
            });
            overallSize += chartData.length;
            return chartData;
        })

        this.attachResizing();

        let yMax = _.max(_.max(_.map(overallData, (d) => _.max(d))));

        let scaleFactor = CHART_HEIGHT / yMax;

        context.lineWidth = CHART_WIDTH / overallSize;

        _.map(overallData, (dataPoint, dataIndex) => {
            _.map(dataPoint, (d, stackIndex) => {

                const scale = CreateScale(dataPoint, CHART_WIDTH);
                const padding_from_left = scale(stackIndex);

                _.map(d, (x, stackIndex2) => {
                    context.beginPath();
                    context.strokeStyle = schemeTableau10[stackIndex2];
                    context.moveTo(padding_from_left, CHART_HEIGHT - (stackIndex2 == 0 ? 0 : d[stackIndex2 - 1] * scaleFactor));
                    context.lineTo(padding_from_left, CHART_HEIGHT - (d[stackIndex2] * scaleFactor));
                    context.stroke();
                });
            });
        });
    }

    attachResizing = () => {

        const { chartScale, actions } = this.props;

        interact('#view-finder-window')
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
            <div className="genomemap-container">
                <div className="text-center">
                    <TriadLegend
                        subGenomes={subGenomes} />
                    <h4 className='text-primary chart-title'>Genome</h4>
                    <div style={{ 'width': CHART_WIDTH }}
                        className='view-finder-wrapper'>
                        <div id="view-finder-window"
                            style={{ height: (CHART_HEIGHT + 5) + 'px' }}>
                        </div>
                    </div>
                    <canvas className="genomemap-canvas-single" width={CHART_WIDTH} height={CHART_HEIGHT} ref={(el) => { this.canvas = el }} > </canvas>
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
        width = 50;
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