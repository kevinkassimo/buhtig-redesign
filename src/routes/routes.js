import React from 'react';
import { Route, Switch } from 'react-router-dom';
import queryString from 'query-string';

import Footer from '../components/Footer/Footer';
import Home from '../components/Home/Home';
import Dashboard from '../components/Dashboard/Dashboard';
import CodeContainer from "../containers/CodeContainer";
import HeaderContainer from '../containers/HeaderContainer';
import SearchContainer from '../containers/SearchContainer';


const Routes = ({ props }) => (
  <div>
    <Route path="/" component={HeaderContainer}/>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/code" render={(props) => {
        let params = queryString.parse(props.location.search);
        return <CodeContainer code={params.code}/>;
      }} />
      <Route path="/search" component={SearchContainer}/>
    </Switch>
    <Route path="/" component={Footer} />
  </div>
);

export default Routes;
