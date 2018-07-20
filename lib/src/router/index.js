import React from 'react';


import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Base from './base.js';
import Login from '../view/login.js';
import ErrorPage from '../view/404/404.js';
import Entry from '../view/content/Entry';
import Hello1 from '../view/content/Entry/test1';
import Hello2 from '../view/content/Entry/test2';

const filter = (powers, power) => component => (!powers || powers[power]) ? component : null;

export default connect(
  state => ({
    powers: state.powers,
  }),
)(props => {
  const p = filter.bind(null, props.powers);
  return <HashRouter basename="">
    <Switch>
      <Route path="/login" component={Login} />
      <Redirect from="/" to="/login" exact />
      <Base {...props}>
        <Switch>
          <Route path="/main" component={Entry} />
          <Route path="/hello/pageone" component={Hello1} />
          <Route path="/hello/pagetwo" component={Hello2} />
        </Switch>
      </Base>
    </Switch>
  </HashRouter>;
});
