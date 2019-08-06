import React from 'react';

import BookingItem from './BookingItem/BookingItem';
import './BookingList.css';

const BookingList = props => {
  const bookingItems = props.bookings.map(booking => {
    return (
      <BookingItem
        key={booking._id}
        onDelete={() => props.onDelete(booking._id)}
        booking={booking}
      />
    );
  });

  return <ul className='booking-list'>{bookingItems}</ul>;
};

export default BookingList;
