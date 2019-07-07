/* eslint-disable max-len */
import React from 'react';
import Display from './parts/Display';

/**
 * @author Marindo Beka
 */
class AskQuestion extends React.Component {
  /**
   * @param {props} props The props.
   */
  constructor(props) {
    super(props);
    this.state = {file: '', htmlFileData: ''};
    this._handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * @param {e} e The event
   */
  handleSubmit(e) {
    e.preventDefault();
    console.log('handle uploading-', this.state.htmlFileData);
    console.log('handle uploading-', this.state.file);
    this.props.emit('askquestion', this.state.htmlFileData);
    window.location = '/#/';
  }

  /**
   *
   * @param {e} e The event.
   */
  handleHtmlChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    if (file != null) {
      const reader = new FileReader();


      reader.onloadend = () => {
        this.setState({
          file: file,
          htmlFileData: reader.result,
        });
      };

      reader.readAsText(file);
    }
  }

  /**
  * @return {html} The ask question html.
  */
  render() {
    const {htmlFileData} = this.state;
    let htmlData = null;
    if (htmlFileData) {
      htmlData = <div dangerouslySetInnerHTML={createMarkup(htmlFileData)} />;
    } else {
      htmlData = (<div className="previewText"></div>);
    }
    return (
      <div >
        <Display if={this.props.Member.name && this.props.Member.type == 'speaker'} >
          <form onSubmit={(e)=>this.handleSubmit(e)}>
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="customFile" onChange={(e)=>this.handleHtmlChange(e)}/>
              <label className="custom-file-label" htmlFor="customFile">Choose file</label>
            </div>
            {htmlData}
          </form>
        </Display>
      </div>
    );
  }
}

/**
 * Creates a markup.
 * @param {text} text The text.
 * @return {number} The sum of the two numbers.
 */
function createMarkup(text) {
  return {__html: '<div class="card text-center"> '
                  +'<div class="card-header">Question Preview</div> '
                  +'<div class="card-body"> '
                  +'<p class="card-text"> '+text+' </p>'
                  +'<button class="btn btn-primary" type="submit">Post Question</button></div></div>'};
};

export default AskQuestion;
