import React from 'react';
import { Route, Switch } from 'react-router-dom';
import queryString from 'qs';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';

import Footer from '../components/Footer/Footer';
import Home from '../components/Home/Home';
import CodeContainer from "../components/Code/Code";
import Header from '../components/Header/Header';
import Search from '../components/Search/Search';
import Authenticate from '../containers/Authenticate';


const Routes = ({ props }) => (
  <div>
    <NotificationsSystem theme={theme} />
    <Route path="/" component={Header} />
    <Route exact path="/" component={() => <div className="home__mask"/>} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/code" render={(props) => {
        let params = queryString.parse(props.location.search);
        return <CodeContainer code={params.code} />;
      }} />
      <Route path="/search" component={Authenticate(Search)} />
    </Switch>
    <Route path="/" component={Footer} />
  </div>
);

export default Routes;
