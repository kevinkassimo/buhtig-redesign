import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import queryString from 'query-string';

import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import Home from '../components/Home/Home';
import Dashboard from '../components/Dashboard/Dashboard';
import Code from "../components/Code/Code";


const Routes = ({ props }) => (
  <div>
    <Route path="/" component={Header}/>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/code" render={(props) => {
        let params = queryString.parse(props.location.search);
        return <Code code={params.code}/>;
      }} />
      <Route path="/search" component={Dashboard}/>
    </Switch>
    <Route path="/" component={Footer} />
  </div>
);

export default Routes;
