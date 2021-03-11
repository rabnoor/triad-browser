import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import interact from 'interactjs';
import { schemeTableau10 } from 'd3';
import { setRegion } from '../redux/actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ChromosomeMap extends Component {

    componentDidMount() { this.drawChart() }

    componentDidUpdate() { this.drawChart() }

    drawChart = () => {

        const { chromosomeData = [], subGenomes = [], chartScale } = this.props;
        let context = clearAndGetContext(this.canvas);

        let chartData = _.map(chromosomeData, (dataPoint) => {

            let values = _.map(subGenomes, (d) => dataPoint[d]);

            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        });

        this.attachResizing();

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = CHART_HEIGHT / yMax;

        context.lineWidth = CHART_WIDTH / chromosomeData.length;

        _.map(chartData, (dataPoint, dataIndex) => {

            const padding_from_left = chartScale(dataIndex);

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

        const { chartScale, actions} = this.props;

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
    }

    render() {
        const { activeChromosome = '' } = this.props;

        return (
            <div style={{ 'width': CHART_WIDTH }} className="triad-stack-container">
                <h4 className='text-primary chart-title'>Chromosome ({activeChromosome})</h4>
                <div style={{ 'width': CHART_WIDTH }}
                    className='view-finder-wrapper'>
                    <div id="view-finder-window"
                        style={{ height: (CHART_HEIGHT + 5) + 'px' }}>
                    </div>
                </div>
                <canvas className="triad-stack-canvas" width={CHART_WIDTH} height={CHART_HEIGHT} ref={(el) => { this.canvas = el }} > </canvas>
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