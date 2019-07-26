import React, { useContext } from 'react';

import './EventItem.css';

import AuthContext from 'context/auth-context';

const EventItem = props => {
  const { userId } = useContext(AuthContext);
  const creatorId = props.event.creator._id;

  return (
    <li className='event__list-item'>
      <div>
        <h1>{props.event.title}</h1>
        <h2>199.28</h2>
      </div>
      <div>
        {userId === creatorId ? (
          <p>You are the owner of this event</p>
        ) : (
          <button className='btn'>View Details</button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
