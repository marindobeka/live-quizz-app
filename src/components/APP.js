/* eslint-disable max-len */
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
      if (member && member.type == 'student') {
        this.emit('join', member);
      } else if (member && member.type == 'speaker') {
        this.emit('reloadSpeaker', {code: member.code});
      }
      this.setState({status: 'connected'});
      console.log('client connected');
      this.setState({status: 'connected'});
    });
    socket.on('joined', (newMember) => {
      console.log('joined');
      sessionStorage.Memeber = JSON.stringify(newMember);
      this.setState({Member: newMember});
      console.log('Joined Client');
      console.log(this.state.Member);
      console.log(sessionStorage.Memeber);
      console.log(this.props);
    });
    socket.on('joinedWithQuestionAvailable', (newMember) => {
      console.log('joinedWithQuestionAvailable');
      sessionStorage.Memeber = JSON.stringify(newMember.s);
      this.setState({Member: newMember.s, questions: newMember.q, answered: 'no'});
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
    socket.on('welcomeBack', (x) => {
      sessionStorage.Memeber = JSON.stringify(x);
      console.log('welcome');
      console.log(x);
      this.setState({Member: x});
    });
  }

  /**
  * @param {eventName} eventName The event name.
  * @param {payload} payload The payload.
  */
  emit(eventName, payload) {
    if (eventName == 'statistics') {
      this.setState({selectedQuestion: payLoad.selectedQuestion});
    } else if (eventName == 'sendAnswer') {
      // const name = 'question ' + payLoad.questionNumber;
      const json = JSON.parse(payload.answer);
      console.log('Parsed json sendAnswer');
      console.log(json);
      const memeber = (sessionStorage.Memeber) ? JSON.parse(sessionStorage.Memeber) : null;
      console.log('session meember send answer');
      console.log(memeber);
      if (memeber && memeber.type == 'student') {
        console.log('Member found send answer');
        memeber.answer = Object.values(json);
        this.setState({Member: memeber});
        console.log(this.state.Member);
        console.log('answer client: ' + Object.values(json));
        this.setState({answered: 'yes'});
      }
      console.log('Emit Eventname: '+eventName);
      console.log(payload);
      socket.emit(eventName, payload, memeber);
    } else {
      socket.emit(eventName, payload);
    }
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
