/* eslint-disable max-len */
import React from 'react';
import {Link} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import {socket} from '../APP';


/**
* @author Marindo Beka
*/
class JoinForm extends React.Component {
  /**
  *
  * @param {props} props The props.
  */
  constructor(props) {
    super(props);
    this.state = {
      error: '',
    };
    this.submit = this.submit.bind(this);
  }

  /**
  *
  */
  submit() {
    const sessionId = ReactDOM.findDOMNode(this.refs.session_id).value;
    const config = {
      id: sessionId,
    };
    socket.emit('validateSessionId', config, (res) => {
      console.log(res);
      if (res.code === 'OK') {
        this.props.emit('joinStudent', {id: config.id});
        this.props.history.push('/student');
      } else {
        this.setState({error: res.msg});
      }
    });
  };
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
                please enter the session code here.</p>
              <form action="Javascript:void(0)" onSubmit = {this.submit}>
                {this.state.error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {this.state.error}
                  <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>}
                <div className="form-inline">
                  <div className="form-group mx-sm-3 mb-2">
                    <label htmlFor="sessionId" className="sr-only">Session Code</label>
                    <input ref="session_id" className="form-control" id="sessionId" placeholder="Session Code" required/>
                  </div>
                  <button type="submit" className="btn btn-primary mb-2">Join</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(JoinForm);
