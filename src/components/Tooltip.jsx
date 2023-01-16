import React from 'react';

export default (props) =>   
    <div className='graph-tooltip' style={{ 'left': props.x, 'top': props.y }}>
        {<p><b>Gene: </b><span>{props.gene}</span></p>}
        {/* {<p><b>SG1: </b><span>{props.SG1}</span></p>}
        {<p><b>SG2: </b><span>{props.SG2}</span></p>}
        {<p><b>SG3: </b><span>{props.SG3}</span></p>}
        {<p><b>SG4: </b><span>{props.SG4}</span></p>}
        {<p><b>SG5: </b><span>{props.SG5}</span></p>}
        {<p><b>SG6: </b><span>{props.SG6}</span></p>} */}
        {props.data}
    </div>;
