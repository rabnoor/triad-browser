import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Dashboard extends Component {

    render() {

        return (
            <div className='dashboard-root container-fluid'>
                <p>Build you dashboard here</p>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            // fill in with actions here 
        }, dispatch)
    };
}

function mapStateToProps(state) {
    return {
        // fill in with props that you need to read from state
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);



