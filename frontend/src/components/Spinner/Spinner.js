import React from 'react';

import './Spinner.css';

const Spinner = props => {
  return (
    <div className='spinner'>
      <div className='lds-ripple'>
        <div />
        <div />
      </div>
    </div>
  );
};

export default Spinner;
