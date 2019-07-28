import React from 'react';
/**
* @author Marindo Beka
*/
class Header extends React.Component {
  /**
  * @return {header} The header html.
  */
  render() {
    return <header className="banner">
      <div className="container">
        <h1 className="white-text center-on-small-only">LectureQuizz</h1>
        <div className="row white-text">
          <div className="col">
            <p>LectureQuizz is a web bassed interactive system for lectures.</p>
          </div>
        </div>
      </div>
    </header>;
  }
}

Header.deafaultProps = {
  status: 'disconnected',
};

export default Header;
