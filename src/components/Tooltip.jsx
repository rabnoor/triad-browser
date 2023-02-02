import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default (props) =>   
    <div className='graph-tooltip' style={{ 'left': props.x, 'top': props.y }}>
            <CopyToClipboard text={"Gene: " + props.gene + "\nSubgenomes Information: " + JSON.stringify(props.subGenomeInfo)}>
    <button> <span style={{"color": "black"}}>|||</span> </button>
    </CopyToClipboard>
        {<p><b>Gene: </b><span>{props.gene}</span></p>}
      
        {props.data}
    </div>;
