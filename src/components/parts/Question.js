/* eslint-disable max-len */
import React from 'react';
import AutoForm from 'react-auto-form';
import Display from './Display';

/**
 * @author Marindo Beka
 */
class Question extends React.Component {
  /**
   * @param {props} props The props.
   */
  constructor(props) {
    super(props);
    this.state = {
      submittedData: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  };
  /**
   * Handle submit event.
   * @param {event} event The event.
   * @param {submittedData} submittedData The submitted data.
   */
  handleSubmit(event, submittedData) {
    event.preventDefault();
    console.log(event);
    console.log(submittedData);
    console.log(JSON.stringify(submittedData, null, 2));
    const response = JSON.stringify(submittedData, null, 2);
    this.setState({submittedData});
    this.props.emit('sendAnswer', {answer: response, questionNumber: this.props.questions.length});
  };

  /**
   * @return {render} Render html.
   */
  render() {
    return (
      <div>
        <Display if={this.props.questions.length>0}>
          <h4>Question - {this.props.questions.length}</h4>
          <AutoForm onSubmit={this.handleSubmit}>
            <div dangerouslySetInnerHTML={{__html: this.props.questions[this.props.questions.length -1]}}>
            </div>
            <input className="btn btn-primary" type="submit" value="Submit answer"/>
          </AutoForm>
          {/* {this.state.submittedData && <pre>
            {JSON.stringify(this.state.submittedData, null, 2)}
          </pre>} */}
        </Display>
      </div>

    );
  }
}

export default Question;
