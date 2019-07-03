import React from 'react';
/**
* @author Marindo Beka
*/
class Lecturer extends React.Component {
  /**
  * @return {header} The header html.
  */
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Card title</h5>
          <p className="card-text">Some quick example text to build
            on the card title and make up the bulk of the card's content.</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">LINK:</li>
          <li className="list-group-item">CODE:</li>
        </ul>
        <div className="card-body">
          <a href="#" className="card-link">Post Question</a>
          <a href="#" className="card-link">Get responses</a>
        </div>
      </div>
    );
  }
}

export default Lecturer;
