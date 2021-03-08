import React from 'react';

export default (props) =>
    <div className='graph-tooltip' style={{ 'left': props.x, 'top': props.y }}>
        {props.gene && <p><b>Gene: </b><span>{props.gene}</span></p>}
        {props.SG1 && <p><b>SG1: </b><span>{props.SG1}</span></p>}
        {props.SG2 && <p><b>SG2: </b><span>{props.SG2}</span></p>}
        {props.SG3 && <p><b>SG3: </b><span>{props.SG3}</span></p>}
    </div>;
