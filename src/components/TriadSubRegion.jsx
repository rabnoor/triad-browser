import React, { Component } from 'react';
import { CHART_WIDTH, CHART_HEIGHT } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10, scaleLinear } from 'd3';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showTooltip } from '../redux/actions/actions';

class TriadSubRegion extends Component {

    componentDidMount() { this.drawChart() }

    componentDidUpdate() { this.drawChart() }


    onMouseMove = (event) => {

        let { showTooltip, chartScale, triadData } = this.props;


        var pageWidth = document.body.getBoundingClientRect().width,
            canvasRect = event.currentTarget.getBoundingClientRect();

        const xPosition = event.pageX - canvasRect.left,
            yPosition = event.pageY - window.pageYOffset - canvasRect.top;

        // const lineName = lineNames[Math.round((yPosition - 12) / TRACK_HEIGHT)],
        //     referenceIndex = Math.floor(referenceScale.invert(xPosition)),
        //     dataPoint = referenceMap[referenceIndex];

        const referenceIndex = Math.floor(chartScale.invert(xPosition)),
            dataPoint = triadData[referenceIndex];

        showTooltip(true, {
            'x': event.pageX + 200 > pageWidth ? event.pageX - 200 : event.pageX + 25,
            'y': event.pageY - 50,
            'gene': dataPoint.Gene,
            'SG1': Math.round(dataPoint['SG1']) + '%',
            'SG2': Math.round(dataPoint['SG2']) + '%',
            'SG3': Math.round(dataPoint['SG3']) + '%'
        });

    }

    onMouseLeave = (event) => { this.props.showTooltip(false) }



    drawChart = () => {

        const { triadData = [], subGenomes = [], chartScale,
            geneData = [], activeGene = '' } = this.props;
        let context = clearAndGetContext(this.canvas);

        let chartData = _.map(triadData, (dataPoint) => {

            let values = _.map(subGenomes, (d) => dataPoint[d]);

            return _.map(values, (d, i) => _.sum(values.slice(0, i + 1)))

        });

        let yMax = _.max(_.map(chartData, (d) => _.max(d)));

        let scaleFactor = CHART_HEIGHT / yMax;

        context.lineWidth = CHART_WIDTH / triadData.length;

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

        // Start drawing the gene map here 
        const sortedGeneData = _.sortBy(geneData, (d) => d.start);

        // The genomic scale runs from starting coordinate 
        // of the first gene to ending coordinate of the last gene 
        const geneChartScale = scaleLinear()
            .domain([sortedGeneData[0].start, sortedGeneData[sortedGeneData.length - 1].end])
            .range([0, CHART_WIDTH]);

        const geneLines = _.map(sortedGeneData, (d, i) => {
            return {
                'color': d.gene == activeGene ? 'white' : schemeTableau10[4],
                'start': geneChartScale(d.start),
                'end': d.gene == activeGene ? geneChartScale(d.end) + 5 : geneChartScale(d.end),
                'y': 30,
                'height': d.gene == activeGene ? 75 : 40
            };
        });

        let geneContext = clearAndGetContext(this.geneCanvas);

        _.map(geneLines, (line) => {
            geneContext.beginPath();
            geneContext.lineWidth = line.height;
            geneContext.strokeStyle = line.color;
            geneContext.moveTo(Math.round(line.start), line.y);
            geneContext.lineTo(Math.round(line.end), line.y);
            geneContext.stroke();
        });
    }

    render() {
        return (
            <div style={{ 'width': CHART_WIDTH }} className="triad-stack-container">
                <h4 className='chart-title'>Sub Region</h4>
                <canvas onMouseOver={this.onMouseMove}
                    onMouseMove={this.onMouseMove}
                    onMouseLeave={this.onMouseLeave}
                    className="triad-stack-canvas" width={CHART_WIDTH} height={CHART_HEIGHT} ref={(el) => { this.canvas = el }} > </canvas>

                <h4 className='chart-title m-t'>Reference Gene Map</h4>
                <canvas className="gene-canvas" width={CHART_WIDTH} height={60} ref={(el) => { this.geneCanvas = el }} > </canvas>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        showTooltip: bindActionCreators(showTooltip, dispatch)
    };
}


export default connect(null, mapDispatchToProps)(TriadSubRegion);