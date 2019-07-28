/* eslint-disable max-len */
import React from 'react';
import Display from './parts/Display';
import {createElements} from '../utils/DslUtil';

/**
 * @author Marindo Beka
 */
class AskQuestion extends React.Component {
  /**
   * @param {props} props The props.
   */
  constructor(props) {
    super(props);
    this.state = {file: '', htmlFileData: null};
    this._handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * @param {e} e The event
   */
  handleSubmit(e) {
    e.preventDefault();
    console.log('handle uploading-', this.state.htmlFileData.htmlText);
    console.log('handle uploading-', this.state.file);
    this.props.emit('askquestion', this.state.htmlFileData);
    window.location = '/#/lecturer';
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
      reader.onloadend = (evt) => {
        if (evt.target.readyState == FileReader.DONE) {
          const data = reader.result;
          const splitData = data.split(/\r\n|\n/);
          this.setState({
            file: file,
            htmlFileData: createElements(splitData),
          });
        }
      };
      // console.log(this.state.htmlFileData);
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
 * @param {data} data The text.
 * @return {number} The sum of the two numbers.
 */
function createMarkup(data) {
  return {__html: '<div class="card"> '
                  +'  <div class="card-header">Question Preview</div>'
                  +'<div class="card-body"> '
                  +'<p class="card-text"> '+data.htmlText+' </p>'
                  +'<button class="btn btn-primary" type="submit" formnovalidate>Post Question</button></div></div>'};
};

export default AskQuestion;
