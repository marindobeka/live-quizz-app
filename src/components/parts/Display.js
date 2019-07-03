import React from 'react';

/**
 * @author Marindo Beka
 */
class Display extends React.Component {
  /**
   * @return {html}
   */
  render() {
    return (this.props.if) ? <div>{this.props.children}</div> : null;
  }
}

export default Display;
