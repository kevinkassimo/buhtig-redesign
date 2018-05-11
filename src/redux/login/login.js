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
  return process.env.NODE_ENV === 'production'
};

const completeOAuth = (code) => {
  return async (dispatch) => {
    try {
      let url = isProd() ?
        '/account/auth_code' :
        'http://localhost:8000/account/auth_code';

      let res = await fetch(`${url}?code=${code}`, {
        method: 'POST',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(push('/'));
        return
      }
      let json = await res.json();
      dispatch(saveUserData(json));
      dispatch(push('/search'))
    } catch (err) {
      dispatch(push('/'))
    }
  }
};

const getUserData = () => {
  return async (dispatch) => {
    try {
      let url = isProd() ?
        '/account/user' :
        'http://localhost:8000/account/user';

      let res = await fetch(`${url}`, {
        method: 'GET',
        credentials: isProd() ? 'same-site' : 'include'
      });
      if (!res.ok) {
        dispatch(push('/'));
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