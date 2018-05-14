import { push } from 'react-router-redux';

const SAVE_USER_DATA = 'save_user_data';

const defaultState = {
  login: null,
  avatar: null,
};

const saveUserData = (data) => {
  return {
    type: SAVE_USER_DATA,
    data,
  }
};

const isProd = () => {
  // in .env, only REACT_APP_* is imported
  return process.env.REACT_APP_NODE_ENV === 'production'
};

const completeOAuth = (code) => {
  return async (dispatch) => {
    try {
      let url = isProd() ?
        '/account/auth_code' :
        'http://localhost:8000/account/auth_code';

      let res = await fetch(`${url}?code=${code}`, {
        method: 'POST',
        credentials: isProd() ? 'same-origin' : 'include', // stupid thing... same-site is chrome only
      });

      if (!res.ok) {
        dispatch(push('/'));
        return;
      }
      let json = await res.json();
      dispatch(saveUserData(json));
      dispatch(push('/search'));
    } catch (err) {
      dispatch(push('/'));
    }
  }
};

// add optional navigate on failure handle to navigate to home when no search
const getUserData = (shouldNavigateHomeOnFailure = true) => {
  return async (dispatch) => {
    try {
      let url = isProd() ?
        '/account/user' :
        'http://localhost:8000/account/user';

      let res = await fetch(`${url}`, {
        method: 'GET',
        credentials: isProd() ? 'same-origin' : 'include'
      });
      if (!res.ok) {
        if (shouldNavigateHomeOnFailure) {
          dispatch(push('/'));
        }
        return
      }
      let json = await res.json();
      dispatch(saveUserData(json))
    } catch (err) {
      dispatch(push('/'))
    }
  }
};

const LoginReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_USER_DATA:
      return {
        ...state,
        login: action.data.login,
        avatar: action.data.avatar_url,
      };
    default:
      return state;
  }
};

export {
  LoginReducer,
  completeOAuth,
  getUserData,
};