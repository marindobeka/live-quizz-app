import React from 'react';
import {HashRouter} from 'react-router-dom';
// import {socket} from '../index';
import Header from './parts/Header';
import Routes from '../routers/Routes';
import io from 'socket.io-client';

export const socket = io();
/**
* @author Marindo Beka
*/
class APP extends React.Component {
  /**
  * @param {props} props The props parameter.
  */
  constructor(props) {
    super(props);
    this.state = {
      status: 'disconnected',
      presentation_title: '',
      Member: {},
      speaker: '',
      updateStudents: [],
      questions: [],
      answered: 'no',
      selectedQuestion: 0,
    };
    this.emit = this.emit.bind(this);
  }

  /**
  *
  */
  componentWillMount() {
    socket.on('connect', () => {
      // eslint-disable-next-line max-len
      const member = (sessionStorage.Memeber) ? JSON.parse(sessionStorage.Memeber) : null;
      const mem = member;
      console.log(mem);
      console.log('client connected');
      this.setState({status: 'connected'});
    });
    socket.on('joined', (newMember) => {
      sessionStorage.Memeber = JSON.stringify(newMember);
      this.setState({Member: newMember});
      console.log('Joined Client');
      console.log(this.state.Member);
      console.log(sessionStorage.Memeber);
      console.log(this.props);
    });
    socket.on('updateStudents', (students) => {
      this.setState({updateStudents: students});
      console.log(students);
    });
    socket.on('askquestion', (questionsFromServer) => {
      this.setState({questions: questionsFromServer, answered: 'no'});
    });
    socket.on('disconnect', () => this.setState({status: 'disconnected'}));
  }

  /**
  * @param {eventName} eventName The event name.
  * @param {payload} payload The payload.
  */
  emit(eventName, payload) {
    console.log('Emit Eventname: '+eventName);
    console.log(payload);
    socket.emit(eventName, payload);
  }

  /**
  * @return {header} The header html.
  */
  render() {
    return (
      <HashRouter>
        <div className="container">
          <Header/>
          {/* <Header {...this.state} /> */}
          <Routes emit={this.emit} {...this.state} />
        </div>
      </HashRouter>
    );
  };
};

export default APP;
