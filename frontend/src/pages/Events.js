import React, { useState, useRef, useContext, useEffect } from 'react';

import Modal from 'components/Modal/Modal';
import Backdrop from 'components/Backdrop/Backdrop';
import AuthContext from 'context/auth-context';
import EventList from 'components/Events/EventList/EventList';
import Spinner from 'components/Spinner/Spinner';

import './Events.css';

const EventsPage = props => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // References to form fields
  const titleEl = useRef(null);
  const priceEl = useRef(null);
  const dateEl = useRef(null);
  const descriptionEl = useRef(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
  }, []);

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent(null);
      return;
    }

    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
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
          throw new Error('Failed');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        // Close modal
        setSelectedEvent(null);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const modalConfirmHandler = () => {
    const title = titleEl.current.value;
    // Place '+' at the beginning converts string into integer/float value
    const price = +priceEl.current.value;
    const date = dateEl.current.value;
    const description = descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    setCreating(false);

    const event = { title, price, date, description };

    const requestBody = {
      query: `
        mutation {
          createEvent(
            title: "${event.title}",
            description: "${event.description}",
            price: ${event.price},
            date: "${event.date}") {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
          }
        }`
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
        // Added event object
        const event = resData.data.createEvent;
        console.log(event);
        // Add to the state list of events
        setEvents(events.concat(event));
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Fetch all events from databse
  const fetchEvents = () => {
    // Show spinner
    setLoading(true);

    const requestBody = {
      query: `
        query {
          events {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
          }
        }`
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        setEvents(events);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const viewDetailsHandler = eventId => {
    setSelectedEvent(events.find(event => event._id === eventId));
  };

  return (
    <React.Fragment>
      {creating && (
        <React.Fragment>
          <Backdrop closeModal={() => setCreating(false)} />
          <Modal
            title='Add Event'
            confirmText='Confirm'
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
          >
            <form>
              <div className='form-control'>
                <label htmlFor='title'>Title</label>
                <input type='text' id='title' ref={titleEl} />
              </div>
              <div className='form-control'>
                <label htmlFor='price'>price</label>
                <input type='number' id='price' ref={priceEl} />
              </div>
              <div className='form-control'>
                <label htmlFor='date'>Date</label>
                <input type='datetime-local' id='date' ref={dateEl} />
              </div>
              <div className='form-control'>
                <label htmlFor='description'>Description</label>
                <textarea id='description' rows='4' ref={descriptionEl} />
              </div>
            </form>
          </Modal>
        </React.Fragment>
      )}

      {/* Modal for event's details - show modal when selectedEvent holds event */}
      {selectedEvent && (
        <React.Fragment>
          <Backdrop closeModal={() => setSelectedEvent(null)} />
          <Modal
            title='Event Details'
            confirmText={token ? 'Book' : 'Confirm'}
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={bookEventHandler}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} -{' '}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{selectedEvent.description}</p>
          </Modal>
        </React.Fragment>
      )}

      {token && (
        <div className='events-control'>
          <p>Share your own events</p>
          <button className='btn' onClick={() => setCreating(true)}>
            Create Event
          </button>
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <EventList onViewDetails={viewDetailsHandler} events={events} />
      )}
    </React.Fragment>
  );
};

export default EventsPage;
