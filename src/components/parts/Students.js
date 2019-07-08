import React from 'react';
/**
 * @author Marindo Beka
 */
class Students extends React.Component {
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
        <h2>Attendance - {this.props.updateStudents.length} members</h2>
        <table className = "table table-stripred">
          <thead>
            <tr>
              <th>Audience Member</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {this.props.updateStudents.map(this.addMemberRow)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Students;
