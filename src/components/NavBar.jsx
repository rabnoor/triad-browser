/*global $*/
import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse ">
                        <ul className='nav navbar-nav'>
                            <li>
                                <Link to={'/'}>
                                    Chromosome analysis
                                </Link>
                            </li>
                            <li>
                                <Link to='/genome-view'>
                                    Whole genome analysis
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
