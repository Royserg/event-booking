import React from 'react';

import './BookingItem.css';

const BookingItem = props => {
  return (
    <li className='booking__item'>
      <div className='booking__item-data'>
        {props.booking.event.title} -{' '}
        {new Date(props.booking.createdAt).toLocaleDateString()}
      </div>
      <div className='booking__item-actions'>
        <button className='btn btn--red' onClick={props.onDelete}>
          Cancel booking
        </button>
      </div>
    </li>
  );
};

export default BookingItem;
