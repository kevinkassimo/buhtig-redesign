import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import createHistory from 'history/createBrowserHistory'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import registerServiceWorker from './registerServiceWorker';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Routes from './routes/routes';
import { reducers } from './redux';

const history = createHistory();
const middleware = [routerMiddleware(history), thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    user: reducers.LoginReducer,
    repo: reducers.RepoReducer,
    routing: routerReducer,
  }),
  composeEnhancers(applyMiddleware(...middleware))
);

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#263238",
    accent1Color: "#448aff"
  },
});


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Routes />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
