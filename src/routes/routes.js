import React from 'react';
import { Route, Switch } from 'react-router-dom';
import queryString from 'query-string';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';

import Footer from '../components/Footer/Footer';
import Home from '../components/Home/Home';
import CodeContainer from "../containers/CodeContainer";
import HeaderContainer from '../containers/HeaderContainer';
import SearchContainer from '../containers/SearchContainer';
import Authenticate from '../containers/Authenticate';


const Routes = ({ props }) => (
  <div>
    <Route path="/" component={HeaderContainer}/>
    <NotificationsSystem theme={theme} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/code" render={(props) => {
        let params = queryString.parse(props.location.search);
        return <CodeContainer code={params.code}/>;
      }} />
      <Route path="/search" component={Authenticate(SearchContainer)}/>
    </Switch>
    <Route path="/" component={Footer} />
  </div>
);

export default Routes;
