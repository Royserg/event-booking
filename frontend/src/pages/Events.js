import React, { useState } from 'react';

import Modal from 'components/Modal/Modal';
import Backdrop from 'components/Backdrop/Backdrop';
import './Events.css';

const EventsPage = props => {
  const [creating, setCreating] = useState(false);

  const modalCancelHandler = () => {
    setCreating(false);
  };
  const modalConfirmHandler = () => {
    setCreating(false);
  };

  return (
    <React.Fragment>
      {creating && (
        <React.Fragment>
          <Backdrop />}
          <Modal
            title='Add Event'
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
          >
            <p>Modal Contetnt</p>
          </Modal>
        </React.Fragment>
      )}
      <div className='events-control'>
        <p>Share your own events</p>
        <button className='btn' onClick={() => setCreating(true)}>
          Create Event
        </button>
      </div>
    </React.Fragment>
  );
};

export default EventsPage;
