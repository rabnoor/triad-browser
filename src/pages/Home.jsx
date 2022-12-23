import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
    render() {
        return (
            <div className='home-header'>

                <div className="container-fluid home-body">
                    <p>
                        There are two modes in which this system can be used - Chromosome and Whole Genome. The Chromosome mode lets you explore the data by visualizing the gene expressions one chromsome at a time.</p>
                    <p>WWe have loaded up some sample files below that you can play around with, click one of the links below to get started :</p>
                    {/*shallow page reload to fix any cache errors*/}
                    <ul onClick={(e) => { location.reload(); }}>
                        <li> <Link to={'/chromosome-view/AT_camelina'}> Camelina </Link> - Camelina (referenced against Arabidopsis) </li>
                        <li> <Link to={'/chromosome-view/AT_bn-a-stigma'}> B.napus Stigma A genome </Link> B.napus Stigma A genome (referenced against Arabidopsis)</li>
                        <li> <Link to={'/chromosome-view/AT_bn-c-stigma'}> B.napus Stigma C genome </Link> B.napus Stigma C genome (referenced against Arabidopsis)</li>
                        <li> <Link to={'/chromosome-view/AT_bn-a-pollen'}> B.napus Pollen A genome </Link> B.napus Pollen A genome (referenced against Arabidopsis)</li>
                        <li> <Link to={'/chromosome-view/AT_bn-c-pollen'}> B.napus Pollen C genome </Link> B.napus Pollen C genome (referenced against Arabidopsis)</li>
                    </ul>
                </div>
            </div>

        )
    }
};

export default Home;
