import React, { Component } from 'react';
import NavBar from './NavBar';

export default class Container extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app-container'>
                {/* navbar content , common for entire application */}
                <NavBar />
                <div id='container-body'>
                    {this.props.children}
                </div>
                <footer className="footer w-full m-t">
                    <div className="container-fluid">
                        <div className='w-md footer-inner'>
                            <span className="left text-xs-left">
                                <a className="footer-link" href="mailto:venkat.bandi@usask.ca?subject=Triad Browser Tool&amp;body=Please%20Fill%20">Contact Us</a>
                            </span>
                        </div>
                        <div className='w-md footer-inner text-xs-right'>
                            <span className='m-r'>
                                Made with <span style={{ "color": '#e25555', 'fontSize': '19px', 'margin': '0px 3px' }}>&hearts;</span> by <a href="https://github.com/jeremy-storring">jeremy-storring</a></span>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}  