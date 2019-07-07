/* eslint-disable max-len */
import React from 'react';
import {Route, Switch} from 'react-router-dom';

import JoinForm from '../components/parts/JoinForm';
import Lecturer from '../components/Lecturer';
import CreateSession from '../components/parts/CreateSession';
import AskQuestion from '../components/AskQuestion';
import Student from '../components/Students';


/**
* @author Marindo Beka
*/
class Routes extends React.Component {
  /**
  * @param {props} props The props parameter.
  */
  constructor(props) {
    super(props);
  }
  /**
  * @return {routes} The routes html.
  */
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={() => <JoinForm {...this.props} />}/>
          <Route path='/create_session' component={() => <CreateSession {...this.props}/>}/>
          <Route path='/lecturer/:id' component={() => <Lecturer {...this.props} />}/>
          <Route path='/student' component={() => <Student {...this.props} />}/>
          <Route path='/postQuestion' component={() => <AskQuestion {...this.props} />}/>
          {/* <Route component={NotFound} /> */}
        </Switch>
      </main>
    );
  }
}

export default Routes;
