import React from 'react';

import './Backdrop.css';

const Backdrop = props => {
  return <div onClick={props.closeModal} className='backdrop' />;
};

export default Backdrop;
