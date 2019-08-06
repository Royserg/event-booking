import React, { useState, useEffect, useContext } from 'react';

import BookingList from 'components/Bookings/BookingList/BookingList';
import Spinner from 'components/Spinner/Spinner';
import AuthContext from 'context/auth-context';

const Bookings = props => {
  const [isLoading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);

    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
            }
            user {
              email
            }
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        setLoading(false);
        const bookings = resData.data.bookings;
        // Add to the state list of bookings
        setBookings(bookings);
      })
      .catch(err => {
        console.log(err);
      });
  }, [setBookings, token]);

  const bookingDeleteHandler = bookingId => {
    const requestBody = {
      query: `
        mutation {
          cancelBooking(bookingId: "${bookingId}") {
            _id
            title
          }
        }
      `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        // Remove booking from state
        const updatedBooking = bookings.filter(
          booking => booking._id !== bookingId
        );
        setBookings(updatedBooking);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Bookings Page</h1>
      {isLoading && <Spinner />}

      <BookingList onDelete={bookingDeleteHandler} bookings={bookings} />
    </div>
  );
};

export default Bookings;
