import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
// import io from 'socket.io-client';

// import Header from './components/parts/JoinForm';
import Lecturer from './components/Lecturer';

// export const socket = io();

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={Lecturer} />
      {/* <Route path="/speaker" component={Lecturer} /> */}
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById('react-app-root'));
