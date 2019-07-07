import React from 'react';
/**
 * @author Marindo Beka
 */
class Attendance extends React.Component {
  /**
   * Add member
   * @param {member} member The member.
   * @param {i} i The i-th position.
   * @return {key}
   */
  addMemberRow(member, i) {
    return (
      <tr key={i}>
        <td>{member.name}</td>
        <td>{member.answer}</td>
      </tr>
    );
  }

  /**
  * @return {header} The header html.
  */
  render() {
    return (
      <div>
        <h2>Attendance - {this.props.updateAudiences.length} members</h2>
        <table className = "table table-stripred">
          <thead>
            <tr>
              <th>Audience Member</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {this.props.updateAudiences.map(this.addMemberRow)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Attendance;
