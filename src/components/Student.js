/* eslint-disable max-len */
import React from 'react';

import Display from './parts/Display';
import JoinForm from './parts/JoinForm';
// import Question from './partials/Question';

/**
 * @author Marindo Beka
 */
class Student extends React.Component {
  /**
   * @return {html} Return html text.
   */
  render() {
    // const name = 'question '+ this.props.questions.length;
    return (
      <div>
        <Display if={this.props.status == 'connected'}>
          <Display if={this.props.Memeber.name && this.props.Memeber.type == 'student'}>
            <Display if={!this.props.questions.length>0}>
              <h2>Welcome</h2>
              <p>Please wait! The questions will appear shortly...</p>
            </Display>
            <Display if={this.props.questions.length>0}>
              <Display if={this.props.answered == 'no'}>
                <Question questions={this.props.questions} emit={this.props.emit} />
              </Display>
              <Display if={this.props.answered == 'yes'}>
                <p>Thank you for your answer.</p>
                <p>The next question will appear shortly...</p>
              </Display>
            </Display>
          </Display>

          <Display if={!this.props.Memeber.name }>
            <JoinForm emit = {this.props.emit}/>
          </Display>
        </Display>

        <Display if={this.props.status == 'disconnected'}>
          <h2>Server stopped working. Will back soon...</h2>
        </Display>
      </div>
    );
  }
}

export default Student;
