import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import qs from 'qs';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';

import Footer from '../components/Footer/Footer';
import Home from '../components/Home/Home';
import CodeContainer from "../components/Code/Code";
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import Authenticate from '../containers/Authenticate';
import withTracker from './withTracker';

// Dummy component created solely for tracking
const GATracker = withTracker(class extends Component {
  render() {
    return <div />
  }
});

const Routes = ({ props }) => (
  <div>
    <NotificationsSystem theme={theme} />
    <Route path="/" component={Header} />
    <Route exact path="/" component={() => <div className="home__mask"/>} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/code" render={(props) => {
        let params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        return <CodeContainer code={params.code} />;
      }} />
      <Route path="/search" component={Authenticate(Search)} />
      <Redirect to="/" />
    </Switch>
    <Route path="/" component={Footer} />
    <Route path="/" component={GATracker} />
  </div>
);

export default Routes;
