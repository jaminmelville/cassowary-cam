import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import moment from 'moment';

export default class Stats extends Component {

  render() {
    const firstOurrence = this.props.events[this.props.events.length - 1];
    const lastOurrence = this.props.events[0];

    const activeMonth = moment(firstOurrence.timestamp).startOf('month');
    const endMonth = moment();
    const months = [];

    while (endMonth > activeMonth || activeMonth.format('M') === endMonth.format('M')) {
       months.push({
         label: activeMonth.format('MMM'),
         moment: moment(activeMonth),
         events: [],
       });
       activeMonth.add(1, 'month');
    }
    this.props.events.forEach((event) => {
      months.find(month => month.moment.isSame(event.timestamp, 'month')).events.push(event);
    });
    const data = {
      labels: months.map(month => month.label),
      datasets: [{
        label: false,
        backgroundColor: 'rgba(255,255,255,1)',
        borderColor: 'rgba(55,255,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(55,255,255,1)',
        hoverBorderColor: 'rgba(55,255,255,1)',
        data: months.map(month => month.events.length),
      }],
    };
    const options = {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false //this will remove only the label
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: 'rgba(255,255,255,1)',
          },
        }]
       },
    };
    return (
      <div>
        <div className="text-white text-right py-3">
          Last activity was {moment(lastOurrence.timestamp).fromNow()}
          <br />
          A total of {this.props.events.length} sightings
        </div>
        <Bar
          data={data}
          options={options}
          height={200}
          getElementAtEvent={(elements) => {
            // debugger
          }}
        />
      </div>
    );
  }
}
