import React, { useRef, useState, useContext } from 'react';

import AuthContext from '../context/auth-context';

import './Auth.css';

const AuthPage = props => {
  // Extract login method from Auth context
  const { login } = useContext(AuthContext);

  const emailEl = useRef(null);
  const passwordEl = useRef(null);
  const [isLogin, setIsLogin] = useState(true);

  const onFormSubmit = e => {
    e.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    // Validation
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }

      `
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(email: "${email}", password: "${password}") {
              _id
              email
            }
          }
        `
      };
    }

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
        if (resData.data.login.token) {
          // Call method from context
          login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <form className='auth-form' onSubmit={onFormSubmit}>
      <div className='form-control'>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' ref={emailEl} />
      </div>

      <div className='form-control'>
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' ref={passwordEl} />
      </div>

      <div className='form-actions'>
        <button type='submit'>Submit</button>
        <button type='button' onClick={() => setIsLogin(!isLogin)}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
