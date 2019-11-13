import React from 'react';
/**
* @author Marindo Beka
*/
class HeaderMain extends React.Component {
  /**
  * @return {header} The header html.
  */
  render() {
    return (
      <div className="card text-white bg-dark mb-3">
        <div className="row no-gutters">
          <div className="col-md-4">
            <img src="img/kepler_logo_white.png"
              className="card-img" alt="kepler-img"/>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Card title</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderMain;
