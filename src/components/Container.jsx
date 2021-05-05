import React, { Component } from 'react';
import NavBar from './NavBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setUsernameAndRoom, disconnectFromRoom } from '../redux/actions/actions';

class Container extends Component {

    constructor(props) {
        super(props);
    }

    handleSubmit = () => {
        let { connection, roomName, userName } = this.props;

        if (connection) {
            this.DisconnectFromRoom(roomName, userName);
        } else {
            let tempRoomName = document.getElementById("RoomName").value;
            let tempUserName = document.getElementById("Username").value;
            let Connection = true;
            this.props.actions.setUsernameAndRoom(tempRoomName, tempUserName, Connection);
    
            this.ConnectToRoom(roomName, userName);
        }
    }

    ConnectToRoom = (roomName, userName) => {
        // code to connect to room
        return;
    }
    
    DisconnectFromRoom = (roomName, userName) => {
        let Connection = false;
        this.props.actions.disconnectFromRoom(Connection);
        // Actual code to disconnect 
        return;
    }

    render() {
        let { connection } = this.props;

        return (
            <div id='app-container'>
                {/* navbar content , common for entire application */}
                <NavBar
                    handleSubmit={this.handleSubmit}
                    Disconnect={this.Disconnect}
                    isConnected={connection} />
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