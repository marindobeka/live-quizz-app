import React from 'react';
import {Link} from 'react-router-dom';

/**
* @author Marindo Beka
*/
class JoinForm extends React.Component {
  /**
  * @return {header} The header html.
  */
  render() {
    return (
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create new session</h5>
              <p className="card-text">As a lecturer, you can create a new
                presentation here. </p>
              <Link to='/create_session'>
                <button className="btn btn-primary">Create Session</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Join Session</h5>
              <p className="card-text">To participate in the event,
                please enter the session ID here.</p>
              <div className="form-inline">
                <div className="form-group mx-sm-1">
                  <input className="form-control"
                    id="sessionId" placeholder="Session Id"/>
                </div>
                <button type="submit" className="btn btn-primary">Join</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default JoinForm;
