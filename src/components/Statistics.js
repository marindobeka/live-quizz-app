/* eslint-disable max-len */
import React from 'react';
import Chart from 'react-google-charts';

import Display from './parts/Display';
import {Link} from 'react-router-dom';


/**
 * @author Marindo Beka
 */
class Statistics extends React.Component {
  /**
  *
  * @param {props} props The props.
  */
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title: '',
    };
  }
  /**
   *
   */
  componentDidMount() {
    if (this.props.Member && this.props.Member.type == 'speaker') {
      const index = this.props.questions.findIndex((x) => x.code == this.props.Member.code);
      if (index != -1 && (this.props.questions[index].question.type === 'radio' || this.props.questions[index].question.type === 'checkbox')) {
        const d = [];
        d.push(['Answers', 'Counts']);
        // console.log(Object.entries(this.props.questions[index].results));
        Object.entries(this.props.questions[index].results).forEach((value)=>{
          d.push(value);
        });
        this.setState({data: d, title: this.props.questions[index].question.question});
      }
    }
  };
  /**
  * @return {header} The header html.
  */
  render() {
    return (

      <div>
        <Display if={this.props.status == 'connected'}>
          <Display if={this.props.Member && this.props.Member.type == 'speaker' && this.state.data.length > 0}>
            <Chart chartType="BarChart" width="110%" height="500px" data={this.state.data}
              options={{
                title: `${this.state.title}`,
                titleTextStyle: {fontSize: 30},
                chartArea: {width: '50%'},
                bars: 'horizontal',
                hAxis: {
                  format: 'decimal',
                  minValue: 0,
                  viewWindow: {min: 0},
                },
                legend: {position: 'none'},
              }}/>
            <p>
              <Link to="/lecturer">Back</Link>
            </p>
          </Display>
          <Display if={this.props.Member && this.props.Member.type == 'speaker' && !this.state.data.length > 0}>
            <h3>No questions to visualize.</h3>
            <p>
              <Link to="/postQuestion">Post question</Link>
            </p>
          </Display>
        </Display>

        <Display if={this.props.status == 'disconnected'}>
          <h2>Server stopped working. Will back soon...</h2>
        </Display>
      </div>
    );
  }
}

export default Statistics;
