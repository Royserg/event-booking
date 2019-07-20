import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    console.log('login triggered');
    setToken(token);
    setUserId(userId);
  };

  const logout = () => {
    console.log('logout method');
    setToken(null);
    setUserId(null);
  };

  return (
    <BrowserRouter>
      {/* Fragment, because BrowserRouter allows only one child component */}
      <React.Fragment>
        {/* value sets initial value of the context, so here can be set functions */}
        <AuthContext.Provider
          value={{ token: token, userId: userId, login: login, logout: logout }}
        >
          <MainNavigation />
          <main className='main-content'>
            <Switch>
              {!token && <Redirect exact from='/' to='/auth' />}
              {/* When logged in and when trying to access root redirect to Events page */}
              {token && <Redirect exact from='/' to='/events' />}
              {token && <Redirect exact from='/auth' to='/events' />}

              {!token && <Route path='/auth' component={AuthPage} />}
              <Route path='/events' component={EventsPage} />
              {token && <Route path='/bookings' component={BookingsPage} />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
