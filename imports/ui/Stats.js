import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import moment from 'moment';

export default class Stats extends Component {

  render() {
    const eventsGroupedByDay = this.props.events
      .reduce((days, event) => {
        const day = moment(event.timestamp).format('YYYY-MM-DD');
        if (Object.keys(days).indexOf(day) < 0) {
          days[day] = {
            events: [],
            day,
          };
        }
        days[day].events.push(event);
        return days;
      }, {});
    let lastOurrence = false;
    if (this.props.events.length > 1) {
      lastOurrence = this.props.events[0];
    }
    const data = {
      labels: Object.keys(eventsGroupedByDay),
      datasets: [{
        label: false,
        backgroundColor: 'rgba(255,255,255,1)',
        borderColor: 'rgba(55,255,255,1)',
        borderWidth: 1,
        barThickness: 'flex',
        hoverBackgroundColor: 'rgba(55,255,255,1)',
        hoverBorderColor: 'rgba(55,255,255,1)',
        data: Object.keys(eventsGroupedByDay).map((key) => {
          return { x: key, y: eventsGroupedByDay[key].events.length };
        })
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
             display: false //this will remove only the label
           },
           offset: true,
           type: 'time',
					 display: true,
					 time: {
					   round: 'day'
					 }
         }],
       },
    };
    return (
      <div>
        {!!lastOurrence &&
          <div className="text-white text-right py-3">
            Last activity was {moment(lastOurrence.timestamp).fromNow()}
          </div>
        }
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
