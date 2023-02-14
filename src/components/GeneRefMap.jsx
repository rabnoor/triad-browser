import React, { Component } from 'react';
import { CHART_WIDTH } from '../utils/chartConstants';
import { clearAndGetContext } from '../utils/canvasUtilities';
import _ from 'lodash';
import { schemeTableau10, scaleLinear } from 'd3';
import { connect } from 'react-redux';

class GeneRefMap extends Component {

    componentDidMount() { this.drawChart() }

    componentDidUpdate() { this.drawChart() }

    drawChart = () => {
        console.log()

        const { geneData = [], activeGenes = [], hoveredGene  =  [],  activeChromosome = '' } = this.props;
        console.log(hoveredGene)

        let tempData = geneData[activeChromosome.toLocaleLowerCase()] || [];
        // Start drawing the gene map here 
        const sortedGeneData = _.sortBy(tempData, (d) => d.start);

        // The genomic scale runs from starting coordinate 
        // of the first gene to ending coordinate of the last gene 
        const geneChartScale = scaleLinear()
            .domain([sortedGeneData[0].start, sortedGeneData[sortedGeneData.length - 1].end])
            .range([0, CHART_WIDTH]);

        const geneLines = _.map(sortedGeneData, (d, i) => {
            if (d.gene == hoveredGene[0]){
                console.log(d.gene)
            }
            return {
                'color':  d.gene == hoveredGene[0] ? 'red' : activeGenes.indexOf(d.gene) > -1 ? 'white' :  schemeTableau10[4],
                'start': geneChartScale(d.start),
                'end': activeGenes.indexOf(d.gene) > -1 ? geneChartScale(d.end) + 5 : hoveredGene.indexOf(d.gene) > -1 ? geneChartScale(d.end)+5 : geneChartScale(d.end),
                'y': 30,
                'height': activeGenes.indexOf(d.gene) > -1 ? 75 :  hoveredGene.indexOf(d.gene) > -1 ? 75 : 40
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
            <div className="gene-ref-map" style={{ 'width': CHART_WIDTH }}>
                <h4 className='chart-title m-t'>Reference Gene Map</h4>
                <canvas className="gene-canvas" width={CHART_WIDTH} height={60} ref={(el) => { this.geneCanvas = el }} > </canvas>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        // fill in with props that you need to read from state
        activeGenes: state.oracle.activeGenes,
        hoveredGene: state.oracle.hoveredGene,
        activeChromosome: state.oracle.activeChromosome,
        geneData: state.genome.geneData,
    };
}

export default connect(mapStateToProps, null)(GeneRefMap);
