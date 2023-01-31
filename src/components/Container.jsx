import React, { Component } from 'react';
import NavBar from './NavBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setUsernameAndRoom, disconnectFromRoom } from '../redux/actions/actions';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { connection } = this.props;

        return (
            <div id='app-container'>
                {/* navbar content , common for entire application */}
                <NavBar/>
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
                            {/* <span className='m-r'>
                                Made with <span style={{ "color": '#e25555', 'fontSize': '19px', 'margin': '0px 3px' }}>&hearts;</span> by <a href="https://github.com/jeremy-storring">jeremy-storring</a></span> */}
                                <span className='m-r'>
                                Developed by the HCI lab</span>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setUsernameAndRoom,
            disconnectFromRoom
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        // fill in with props that you need to read from state
        connection: state.oracle.Connection,
        userName: state.oracle.Username,
        roomName: state.oracle.RoomName,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);