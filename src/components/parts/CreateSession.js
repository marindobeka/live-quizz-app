/* eslint-disable max-len */
import React from 'react';
import ReactDOM from 'react-dom';
// import {Redirect} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import {socket} from '../APP';

/**
 * @author Marindo Beka
 */
class CreateSession extends React.Component {
  /**
  *
  * @param {props} props The props.
  */
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      toSpeaker: false,
      roomName: '',
    };
    this.start = this.start.bind(this);
  }
  /**
  *
  */
  start() {
    const roomName = ReactDOM.findDOMNode(this.refs.room_name).value;
    const secureCode = ReactDOM.findDOMNode(this.refs.secure_code).value;
    const config = {
      name: roomName,
      code: secureCode,
    };
    socket.emit('validateSession', config, (res) => {
      console.log(res);
      if (res.code === 'OK') {
        this.props.emit('join', {name: config.name, code: config.code});
        this.setState({roomName: config.name});
        // this.props.history.push('/lecturer/'+config.name);
        this.props.history.push('/lecturer');
      } else {
        this.setState({error: res.msg});
        console.log(res.msg);
      }
    });
    console.log(roomName);
    console.log(secureCode);
  };
  /**
  * @return {header} The header html.
  */
  render() {
    return (
      <div className="row justify-content-center">
        <div className="card text-center col-8">
          <div className="card-body">
            <h5 className="card-title">Room Creation</h5>
            {this.state.error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {this.state.error}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>}
            <form action="Javascript:void(0)" onSubmit = {this.start}>
              {/* <label>Room Name</label> */}
              <div className="input-group">
                <input ref="room_name"
                  className="form-control"
                  placeholder = "Room Name" required />
                {/* <label>Secure Code</label> */}
                <input ref="secure_code"
                  className="form-control"
                  placeholder = "Secure Code"
                  required />
              </div>
              <button type="submit"
                className="btn btn-primary btn-block">
                  Create Room
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateSession);
