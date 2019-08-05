import React from 'react';

import './EventList.css';

import EventItem from './EventItem/EventItem';

const EventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem
        key={event._id}
        event={event}
        onViewDetails={props.onViewDetails}
        onDelete={() => props.onDelete(event._id)}
      />
    );
  });

  return <ul className='event__list'>{events}</ul>;
};

export default EventList;
