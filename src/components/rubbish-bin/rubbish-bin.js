import React from 'react';

import './rubbish-bin.css';

const RubbishBin = ({ action }) => {
    return (
        <button 
            className=""
            onClick={action}>
            <i className="fas fa-trash rubbish-bin-color"></i>
        </button>
    )
}

export default RubbishBin;
