import React from 'react';
import socket from '../index';

/**
* @author Marindo Beka
*/
class APP extends React.Component {
  /**
  * @param {props} props The props parameter.
  */
  constructor(props) {
    super();
    this.state = {
      status: 'disconnected',
      presentation_title: '',
      member: {},
      speaker: '',
      updateAudiences: [],
      questions: [],
      answered: 'no',
      selectedQuestion: 0,
    };
  }

  /**
  * @param {props} props The props parameter.
  */
  componentDidMount() {
    socket.on('connect', () => {
      // eslint-disable-next-line max-len
      const member = (sessionStorage.member) ? JSON.parse(sessionStorage.member) : null;
      console.log(`${member}`);
    });
  }
};

export default APP;
