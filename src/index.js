import React from 'react';
import ReactDOM from 'react-dom';
// import {Router, Route, Switch} from 'react-router-dom';
// import io from 'socket.io-client';

// import APP from './components/APP';
// import JoinForm from './components/parts/JoinForm';

// export const socket = io();

// const routing = (
//   <main>
//     <Switch>
//       <Route exact path='/' component={() => <Audience {...this.props} />} />
//       <Route path='/speaker' component={() => <Speaker {...this.props} />} />
//       <Route path='/board' component={() => <Board {...this.props} />} />
//       <Route component={NotFound} />
//     </Switch>
//   </main>
// );

import App from './components/APP';

ReactDOM.render(<App />, document.getElementById('react-app-root'));

// ReactDOM.render(routing, document.getElementById('react-app-root'));
